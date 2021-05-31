from django.http import JsonResponse
from ..models import Busstop
from django.views.decorators.csrf import csrf_exempt
import json
from neomodel import db

route = {
    'RK_ROUTE': ['Ratnapark', 'Shahidgate', 'RNAC', 'Tripureshor', 'Teku', 'Kalimati', 'Rabibhawan', 'Lampati', 'Kalanki'],
    'KR_ROUTE': ['Kalanki', 'Lampati', 'Rabibhawan', 'Kalimati', 'Teku', 'Tripureshor', 'RNAC', 'Ratnapark'],
    'RBK_ROUTE': ['Ratnapark', 'Shahidgate', 'RNAC', 'Tripureshor', 'Teku', 'Kalimati', 'Kuleshor', 'Balkhu', 'Khasibazar', 'Kalanki'],
    'RD_ROUTE': ['Ratnapark', 'Maitighar', 'Babarmahal', 'Baneshwor', 'Koteshwor', 'Jadibuti', 'Lokanthali', 'Kaushaltar', 'Madhyapur Thimi', 'RadheRadhe', 'Suryabinayak', 'Jagaati', 'Nalinkchowk', 'Sanga', 'Banepa', '28 Kilo', 'Dhulikhel']
}


def sortRoute(response, name):
    temp = []
    # if name == "KR_ROUTE":
    #     routes = route['RK_ROUTE']
    #     routes.reverse()
    if name == "KBR_ROUTE":
        routes = route['RBK_ROUTE']
        routes.reverse()

    else:
        routes = route[name]
        print(routes)

    for i in routes:
        for j in response:
            if(j['name'] == i):
                temp.append(j)
    return temp


def getRoute(request):
    if(request.method == "GET"):
        name = request.GET.get('rname', '')
        try:
            busstops = db.cypher_query(
                f'''
            MATCH (a:Busstop)-[r:ROUTE]->(b:Busstop)
            WHERE r.rid= '{name}'
            RETURN DISTINCT a,b
            '''
            )[0]
            # print(busstops)
            busstop_name = []
            response = []
            for busstop in busstops:
                for bus in busstop:
                    stop_name = bus.get('name')
                    if stop_name not in busstop_name:
                        busstop_name.append(stop_name)
                        obj = {
                            'name': stop_name,
                            'latitude': bus.get('latitude'),
                            'longitude': bus.get('longitude'),
                        }
                        response.append(obj)
            response = sortRoute(response, name)
            return JsonResponse(response, safe=False)

        except:
            response = {"error": "Error occured"}
            return JsonResponse(response, safe=False)


def getSuggestedRoute(request):
    if request.method == "GET":
        try:
            start = request.GET.get('sname', '')
            end = request.GET.get('ename', '')
            pathstops = db.cypher_query(
                f'''
                MATCH (a:Busstop) where a.name="{start}"
                MATCH (b:Busstop) where b.name="{end}"
                MATCH p = shortestpath ((a)-[:ROUTE*]->(b))
                RETURN nodes(p) AS stop
                '''
            )[0]
            response = []
            for pathstop in pathstops:
                for bus in pathstop:
                    for b in bus:
                        obj = {
                            'name': b.get('name'),
                            'latitude': b.get('latitude'),
                            'longitude': b.get('longitude'),
                        }
                        response.append(obj)
            sortRoute(response)
            return JsonResponse(response, safe=False)
        except:
            response = {"error": "error"}
            return JsonResponse(response, safe=False)
