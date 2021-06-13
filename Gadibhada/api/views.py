from django.db import models
from django.shortcuts import render
from rest_framework import generics, serializers, status
from.serializers import StopSerializer, CreateStopSerializaer, BusRouteSerializer, CreateRouteSerializer, GetRouteSerializer 
from .models import Route, Stop, Busstop
from rest_framework.views import APIView
from rest_framework.response import Response
from neomodel import db
from django.http import JsonResponse

def createRoute(stops,rname,rid):
        count=0
        while count<len(stops)-1:
            stop1=Busstop.nodes.get(name=stops[count])
            stop2=Busstop.nodes.get(name=stops[count+1])
            stop1.next_stop.connect(stop2,{"rname":rname,"rid":rid})
            count+=1
        return

def sortRoute(respone,routes):
    temp=[]
    for i in routes:
        for j in respone:
            if(j['name']==i):
                temp.append(j)
    return temp

# Create your views here.
class StopView(generics.ListAPIView):
    queryset=Stop.objects.all()
    serializer_class=StopSerializer

class CreateStopView(APIView):
    serializer_class=CreateStopSerializaer

    def post(self, request, format=None):
        serializer =self.serializer_class(data= request.data)
        print(serializer)
        print(serializer.is_valid())
        if serializer.is_valid():
            name=serializer.data.get('name')
            longitude=serializer.data.get('longitude')
            latitude=serializer.data.get('latitude')
            queryset=Stop.objects.filter(name=name)
            print(queryset)
            if queryset.exists():
                stop=queryset[0]
                stop.latitude=latitude
                stop.longitude=longitude
                busstop=Busstop.nodes.get(name=name)
                busstop.latitude=latitude
                busstop.longitude=longitude
                busstop.save()
                stop.save(update_fields=['longitude','latitude'])
                return Response(StopSerializer(stop).data, status=status.HTTP_200_OK)
            else:
                stop= Stop(name=name, longitude=longitude, latitude=latitude)
                busstop= Busstop(name=name, longitude=longitude, latitude=latitude)
                busstop.save()
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
                createRoute(stops,rname,rid)
                route.save(update_fields=['rname','stops'])
                return Response(BusRouteSerializer(route).data, status=status.HTTP_200_OK)
            else:
                createRoute(stops,rname,rid)
                route=Route(stops=stops,rname=rname,rid=rid)
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
            RETURN DISTINCT a,b AS stops
            '''
            )[0]
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
                        response=sortRoute(response,stop_list)
            return Response(response,status=status.HTTP_200_OK)
        except:
            response={"error":"Error occured"}
            return JsonResponse(response,status=status.HTTP_400_BAD_REQUEST)
    

