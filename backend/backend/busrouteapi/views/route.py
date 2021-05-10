from django.http import JsonResponse
from busrouteapi.models import Busstop
from django.views.decorators.csrf import csrf_exempt
import json
from neomodel import db

@csrf_exempt
def getRoute(request):
    if(request.method=="GET"):
        name=request.GET.get('rname','')
        try:
            busstops=db.cypher_query(
            f'''
            MATCH (a:Busstop)-[r:ROUTE]->(b:Busstop)
            WHERE r.rid='{name}'
            RETURN DISTINCT a,b AS stops
            '''
            )[0]
            busstop_name=[]
            response=[]
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
            return JsonResponse(response,safe=False)
        except:
            response={"error":"Error occured"}
            return JsonResponse(response,safe=False)

@csrf_exempt
def getsuggestedroute(request):
    if request.method=="GET":
        try:
            start=request.GET.get('sname','')
            end=request.GET.get('ename','')
            pathstops=db.cypher_query(
                f'''
                MATCH (a:Busstop) where a.name="{start}"
                MATCH (b:Busstop) where b.name="{end}"
                MATCH p = shortestpath ((a)-[:ROUTE*]->(b))
                RETURN nodes(p) AS stop
                '''
            )[0]
            response=[]
            for pathstop in pathstops:
                for bus in pathstop:
                    for b in bus:
                        obj={
                            'name': b.get('name'),
                            'latitude': b.get('latitude'),
                            'longitude': b.get('longitude'),
                        }
                        response.append(obj)
            return JsonResponse(response, safe=False)
        except:
            response={"error":"error"}
            return JsonResponse(response, safe=False)