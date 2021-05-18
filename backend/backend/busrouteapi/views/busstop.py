from django.http import JsonResponse
from ..models import Busstop
from django.views.decorators.csrf import csrf_exempt
import json

def getAllStops(request):
    #get all busstops
    if (request.method=='GET'):
        try:
            buses=Busstop.nodes.all()
            response=[]
            for bus in buses:
                obj={
                    'bid':bus.bid,
                    'name':bus.name,
                    'longitude':bus.longitude,
                    'latitude':bus.latitude
                }
                response.append(obj)
            return JsonResponse(response,safe=False)
        except:
            response={"error":"Error Occured"}
            return JsonResponse(response,safe=False)

@csrf_exempt
def StopDetails(request):
    if(request.method=="GET"):
        #get one data by name
        name=request.GET.get('name','')
        try:
            bus=Busstop.nodes.get(name=name)
            response={
                    'bid':bus.bid,
                    'name':bus.name,
                    'longitude':bus.longitude,
                    'latitude':bus.latitude
            }
            return JsonResponse(response,safe=False)
        except:
            response={"error":"Error occured"}
            return JsonResponse(response,safe=False)

    if(request.method=='POST'):
        print("Post request")
        #create one busstop
        json_data=json.loads(request.body)
        name=json_data['name']
        longitude=float(json_data['longitude'])
        latitude=float(json_data['latitude'])
        try:
            bus=Busstop(name=name, longitude=longitude, latitude=latitude)
            bus.save()
            response={
                "bid": bus.bid
            }
            return JsonResponse(response)
        except:
            response={
                "error": "Error occured"
            }
            return JsonResponse(response, safe=False)

    if request.method=="PUT":
        #update bus
        json_data=json.loaods(request.body)
        old_name=json_data['old_name']
        name=json_data['name']
        longitude=float(json_data['longitude'])
        latitude=float(json_data['latitude'])
        try:
            bus=Busstop.nodes.get(name=old_name)
            bus.name=name
            bus.longitude=longitude
            bus.latitude=latitude
            bus.save()
            response={
                    'bid':bus.bid,
                    'name':bus.name,
                    'longitude':bus.longitude,
                    'latitude':bus.latitude
            }
            return JsonResponse(response,safe=False)
        except:
            response={"error":"Error occured"}
            return JsonResponse(response,safe=False)

    if request.method == 'DELETE':
        # delete one bus
        json_data = json.loads(request.body)
        bid = json_data['bid']
        try:
            bus = Person.nodes.get(bid=bid)
            bus.delete()
            response = {"success": "Busstop deleted"}
            return JsonResponse(response, safe=False)
        except:
            response = {"error": "Error occurred"}
            return JsonResponse(response, safe=False)
        