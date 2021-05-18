from django.http import JsonResponse
from ..models import Busstop
from django.views.decorators.csrf import csrf_exempt
import json
from neomodel import db

route={
    'SRS_ROUTE': ['Swayambhu','Thulo Bharyang','Sano Bharyang','Dhungedhara','Banasthali','Balaju Chowk','Nayabazar','Sorakhutte','Thamel','ASCOL','Lainchaur','Jamal','RNAC','Jamal_Maya'],

    'KG_ROUTE': ['Kalanki','Sitapaila','Swayambhu','Thulo Bharyang','Sano Bharyang','Dhungedhara','Banasthali','Balaju Chowk','Machha Pokari','New BusPark','Gongabu Chowk','Samakhusi','Basundhara Chauki','Basundhara','Narayan Gopal Chowk','Chappal Karkhana','Dhumbarahi','Sukedhara','Gopi Krisha Hall','Chabhahil Chowk','Chuchepati','Tusal','Boudha Gate','Boudha Pipalbot','Arab Bank','Chamunda Gate','Jorpati','Besigaun','NMC Hospital','Bhagwatithan, Gokharna'],

    'BK_ROUTE': ['Balaju Chowk','Machha Pokari','New BusPark','Gongabu Chowk','Samakhusi','Basundhara Chauki','Basundhara','Narayan Gopal Chowk','Chappal Karkhana','Dhumbarahi','Sukedhara','Gopi Krisha Hall','Chabhahil Chowk','Mitrapark','Jaya Bageswori','Gausala Chowk','Pingalstan','Tilganga','Tribhuwan International Airport','Sinamangal','Gairigaun','Koteshwor','Jadibuti','Lokanthali','Kausaltar','Gathaghar','Chardobato,Thimi','Naya Thimi Bus stand','Radhe Radhe','Srijana Nagar','Sallaghari','Chundevi','Suryabinayak','Jagati','Chyamasingh','Kamalbinayak'],

    'RINGROAD':['Kalanki','Sitapaila','Swayambhu','Thulo Bharyang','Sano Bharyang','Dhungedhara','Banasthali','Balaju Chowk','Machha Pokari','New BusPark','Gongabu Chowk','Samakhusi','Basundhara Chauki','Basundhara','Narayan Gopal Chowk','Chappal Karkhana','Dhumbarahi','Sukedhara','Gopi Krisha Hall','Chabhahil Chowk','Mitrapark','Jaya Bageswori','Gausala Chowk','Pingalstan','Tilganga','Tribhuwan International Airport','Sinamangal','Gairigaun','Koteshwor','Bhatbhateni, Koteshwor','Balkumari','Gwarko','Satdobato','Chapagaun Dobato Satobato','Mahalaximisthan, Patan','Thasikhel','Ekantakuna','Nakhu','Bagdol','Dhobighat','Nayabato','Sanepa Height, ringroad','Sanepa, Ringroad','Balkhu, Ringroad','Sita Petrol Pump, Kalanki','Khasibazar, Kalanki','Kalanki']
}

def sortroute(respone,name):
    temp=[]
    if name=="GK_ROUTE":
        routes=route['KG_ROUTE']
        routes.reverse()
    elif name=="KB_ROUTE":
        routes=route['BK_ROUTE']
        routes.reverse()
    elif name=="RINGROAD_REVERSE":
        routes=route['RINGROAD']
        routes.reverse()
    else:
        routes=route[name]
    for i in routes:
        for j in respone:
            if(j['name']==i):
                temp.append(j)
    return temp


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
            response=sortroute(response,name)
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
            sortroute(response)
            return JsonResponse(response, safe=False)
        except:
            response={"error":"error"}
            return JsonResponse(response, safe=False)