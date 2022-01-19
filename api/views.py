from django.db.models import query
from django.shortcuts import render
from django.contrib.gis.geos.point import Point
from django.contrib.gis.db.models.functions import Distance
from django.db import models
from django.shortcuts import render
from neo4j.graph import Node
from rest_framework import generics, serializers, status
from.serializers import StopSerializer, CreateStopSerializaer, BusRouteSerializer, CreateRouteSerializer, GetRouteSerializer 
from .models import Route, Stop, Busstop
from rest_framework.views import APIView
from rest_framework.response import Response
from neomodel import db
from django.http import JsonResponse
from accounts.models import User

def createRoute(stops,rname,rid,usid):
        count=0
        while count<len(stops)-1:
            stop1=Busstop.nodes.get(name=stops[count])
            stop2=Busstop.nodes.get(name=stops[count+1])
            stop1.next_stop.connect(stop2,{"rname":rname,"rid":rid,"user":usid})
            count+=1
        return

def sortRoute(respone,routes):
    temp=[]
    for i in routes:
        for j in respone:
            if(j['name']==i):
                temp.append(j)
                break
    return temp

def getRouteInfo(route,busstop):
    count=0
    data=[]
    for r in route:
        obj={
            "route": r,
            "stops" : []
        }
        while count<len(busstop)-1:
            print(count)
            stop1=Busstop.nodes.get(name=busstop[count])
            stop2=Busstop.nodes.get(name=busstop[count+1])
            is_route_present=db.cypher_query(
                f'''
                    MATCH (a:Busstop) where a.name="{stop1.name}"
                    MATCH (b:Busstop) where b.name="{stop2.name}"
                    MATCH (a:Busstop)-[r:ROUTE]->(b:Busstop) where r.rname="{r}"
                    RETURN r
                '''
            )[0]
            if(is_route_present==[]):
                stop={
                'name': stop1.name,
                'latitude': stop1.latitude,
                'longitude': stop1.longitude,
                    }
                obj['stops'].append(stop)
                break
            stop={
                'name': stop1.name,
                'latitude': stop1.latitude,
                'longitude': stop1.longitude,
            }
            obj['stops'].append(stop)
            if(count==len(busstop)-2):
                stop={
                'name': stop2.name,
                'latitude': stop2.latitude,
                'longitude': stop2.longitude,
                    }
                obj['stops'].append(stop)
            count=count+1
        data.append(obj)
    return data

def getInstructions(data,sourceStop):
    instructions=[f'''From your Location, Go to {sourceStop} Busstop''']
    for i in data:
        instructions.append(f'''Take a bus [BUS ROUTE: {i["route"]}] from {i["stops"][0]["name"]} to {i["stops"][-1]["name"]}''')
    instructions.append("Go to your destination.")
    return instructions

# Create your views here.
class StopView(generics.ListAPIView):
    queryset=Stop.objects.all()
    serializer_class=StopSerializer

class CreateStopView(APIView):
    serializer_class=CreateStopSerializaer

    def post(self, request, format=None):
        serializer =self.serializer_class(data= request.data)
        print(serializer.is_valid())
        if serializer.is_valid():
            name=serializer.data.get('name')
            longitude=serializer.data.get('longitude')
            latitude=serializer.data.get('latitude')
            usid = serializer.data.get('usid')
            queryset=Stop.objects.filter(name=name)
            print(queryset,usid)
            if queryset.exists():
                stop=queryset[0]
                stop.latitude=latitude
                stop.longitude=longitude
                stop.usid = usid
                db.cypher_query(
                    f'''
                    MATCH (a:Busstop)-[r:OWNED_BY]->() where a.name="{name}"
                    DETACH DELETE r
                    '''
                )[0]
                busstop=Busstop.nodes.get(name=name)
                busstop.latitude=latitude
                busstop.longitude=longitude
                busstop.location=Point(longitude,latitude,srid=4326)
                neo_auth_user = User.nodes.get(uid=usid)
                busstop.save()
                busstop.user.connect(neo_auth_user)
                stop.save(update_fields=['longitude','latitude','location','usid'])
                return Response(StopSerializer(stop).data, status=status.HTTP_200_OK)
            else:
                location=Point(longitude,latitude,srid=4326)
                print(location)
                stop = Stop(name=name, longitude=longitude,
                            latitude=latitude, usid=usid, location=location)
                busstop = Busstop(
                    name=name, longitude=longitude, latitude=latitude)
                neo_auth_user = User.nodes.get(uid=usid)
                busstop.save()
                busstop.user.connect(neo_auth_user)
                stop.save()
                return Response(StopSerializer(stop).data,status=status.HTTP_201_CREATED)

        return Response({'Bad Request':"Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)

class RouteView(generics.ListAPIView):
    queryset=Route.objects.all()
    serializer_class=BusRouteSerializer

class CreateRouteView(APIView):
    serializer_class= CreateRouteSerializer
    
    def post(self,request, format=None):
        serializer=self.serializer_class(data=request.data)
        if (serializer.is_valid()):
            rname=serializer.data.get('rname')
            rid=serializer.data.get('rid')
            stops=serializer.data.get('stops')
            queryset=Route.objects.filter(rid=rid)
            usid = serializer.data.get('usid')
            if(queryset.exists()):
                route=queryset[0]
                route.rname=rname
                route.stops=stops
                db.cypher_query(
                    f'''
                    MATCH (a:Busstop)-[r:ROUTE]->(b:Busstop) where r.rid="{rid}"
                    DELETE r
                    '''
                )[0]
                createRoute(stops,rname,rid,usid)
                route.save(update_fields=['rname','stops'])
                return Response(BusRouteSerializer(route).data, status=status.HTTP_200_OK)
            else:
                createRoute(stops,rname,rid,usid)
                route=Route(stops=stops,rname=rname,rid=rid,usid=usid)
                route.save()
                return Response(BusRouteSerializer(route).data, status=status.HTTP_201_CREATED)
        
        return Response({'Bad Request':"Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)

class GetRouteView(APIView):
    def get(self, request, format=None):
        rid=request.GET.get('rid','')
        print(rid)
        try:
            busstops=db.cypher_query(
            f'''
            MATCH (a:Busstop)-[r:ROUTE]->(b:Busstop)
            WHERE r.rid='{rid}'
            RETURN a,b AS stops
            '''
            )[0]
            print(busstops)
            busstop_name=[]
            response=[]
            route=Route.objects.filter(rid=rid)
            stop_list=route[0].stops
            for busstop in busstops:
                for bus in busstop:
                    stop_name=bus.get('name')
                    if stop_name not in busstop_name:
                        busstop_name.append(stop_name)
                        obj={
                            'name': stop_name,
                            'latitude': bus.get('latitude'),
                            'longitude': bus.get('longitude'),
                        }
                        response.append(obj)
            if(rid=="Ringroad" or rid=="Ringroad-Reverse"):
                kalanki=Busstop.nodes.get(name="Kalanki")
                obj={
                    'name': kalanki.name,
                    'latitude': kalanki.latitude,
                    'longitude': kalanki.longitude,
                }
                response.append(obj)
            print(busstop_name)
            print(len(response))
            print(len(stop_list))
            response=sortRoute(response,stop_list)
            # return JsonResponse(response,status=status.HTTP_400_BAD_REQUEST)
            return Response(response,status=status.HTTP_200_OK)
        except:
            response={"error":"Error occured"}
            return JsonResponse(response,status=status.HTTP_400_BAD_REQUEST)

class GetShortestPath(APIView):
    def get(self,request,format=None):
        source_longitude=float(request.GET.get('source-longitude'))
        source_latitude=float(request.GET.get('source-latitude'))
        destination_longitude=float(request.GET.get('destination-longitude'))
        destination_latitude=float(request.GET.get('destination-latitude'))
        try:
            SourceLocation=Point(source_longitude,source_latitude,srid=4326)
            DestinationLocation=Point(destination_longitude,destination_latitude,srid=4326)
            stop_near_source=Stop.objects.annotate(distance=Distance('location',SourceLocation)).order_by('distance')[0:1]
            print(stop_near_source[0].name)
            
            stop_near_destination=Stop.objects.annotate(distance=Distance('location',DestinationLocation)).order_by('distance')[0:1]
            print(stop_near_destination[0].name)

            response=[]
            nodes=db.cypher_query(
                f'''
                MATCH (a:Busstop) where a.name="{stop_near_source[0].name}"
                MATCH (b:Busstop) where b.name="{stop_near_destination[0].name}"
                MATCH p = allshortestpaths ((a)-[:ROUTE*]->(b))
                RETURN nodes(p) AS stop
                '''
            )[0]

            relationships=db.cypher_query(
                 f'''
                MATCH (a:Busstop) where a.name="{stop_near_source[0].name}"
                MATCH (b:Busstop) where b.name="{stop_near_destination[0].name}"
                MATCH p = allshortestpaths ((a)-[:ROUTE*]->(b))
                RETURN relationships(p) AS stop
                '''
            )[0]
            busstops=[]
            routes=[]
            for pathstop in nodes:
                for bus in pathstop:
                    stop=[]
                    for b in bus:
                        if(not b.get('name') in stop):
                            stop.append(b.get('name'))
                    busstops.append(stop)
            for pathstop in relationships:
                for bus in pathstop:
                    route=[]
                    for b in bus:
                        if(not b.get('rname') in route):
                            route.append(b.get('rname'))
                    routes.append(route)
            #Shortest route calculate
            count=0
            index=0
            min_route=routes[count]
            while count<len(routes)-1:
                print(len(routes[count]),len(routes[count+1]))
                if len(routes[count+1])<len(routes[count]):
                    min_route=routes[count+1]
                    index=count
                count=count+1;
            routes=min_route
            stop_name=busstops[index]
            busstops=nodes[index]
            
            #Getting Instructions
            data=getRouteInfo(routes,stop_name)
            instructions=getInstructions(data,stop_near_source[0].name)
            print(instructions)

            #Setting Response
            routestops=[]
            busstop_name=[]
            for pathstop in nodes:
                for bus in pathstop:
                    for b in bus:
                        stop_name=b.get('name')
                        if stop_name not in busstop_name:
                            busstop_name.append(stop_name)
                            obj={
                                'name': stop_name,
                                'latitude': b.get('latitude'),
                                'longitude': b.get('longitude'),
                            }
                            routestops.append(obj)
            response={
                "route": routestops,
                "instructions": instructions
            }
            return JsonResponse(response,status=status.HTTP_200_OK)
        except:
            response={"error":"Error occured"}
            return JsonResponse(response,status=status.HTTP_400_BAD_REQUEST)

class DeleteStop(APIView):
    def get(self,request,format=None):
        print(request)
        name=str(request.GET.get('name',''))
        print(name)
        try:
            queryset=Stop.objects.filter(name=name)
            print(queryset)
            if(queryset.exists()):
                Busstop.nodes.get(name=name).delete()
                queryset.delete();
                response={ "success": "Delete Successfully"}
                return JsonResponse(response, status=status.HTTP_200_OK)
        except:
            response={ "error": "Error Occured"}
            return JsonResponse(response, status=status.HTTP_200_OK)

class DeleteRoute(APIView):
    def get(self,request,format=None):
        rid=request.GET.get('rid','')
        try:
            queryset=Route.objects.filter(rid=rid)
            if(queryset.exists()):
                db.cypher_query(
                    f'''
                    match (n:Busstop)-[r:ROUTE]->(m:Busstop) where r.rid="{rid}" 
                    delete r      
                    '''
                )
                queryset.delete()
                response={ "success": "Delete Successfully"}
                return JsonResponse(response, status=status.HTTP_200_OK)
        except:
            response={ "error": "Error Occured"}
            return JsonResponse(response, status=status.HTTP_200_OK)
