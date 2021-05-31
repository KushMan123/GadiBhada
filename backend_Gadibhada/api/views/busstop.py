from django.http import JsonResponse
from api.models import Busstop
from django.views.decorators.csrf import csrf_exempt
import json

# func to get all the instances of bus stops


def getAllStops(request):
    if (request.method == 'GET'):
        try:
            buses = Busstop.nodes.all()
            # print(buses)
            response = []
            for bus in buses:
                obj = {
                    "bid": bus.bid,
                    "name": bus.name,
                    "longitude": bus.longitude,
                    "latitude": bus.latitude
                }
                response.append(obj)
                # print(response)
            return JsonResponse(response, safe=False)

        except:
            response = {"error": "Error Occured"}
            return JsonResponse(response, safe=False)

# CRUD operations for busstops


def stopDetails(request):
    if(request.method == "GET"):
        name = request.GET.get('name', '')
        try:
            bus = Busstop.nodes.get(name=name)
            response = {
                'bid': bus.bid,
                'name': bus.name,
                'longitude': bus.longitude,
                'latitude': bus.latitude
            }
            return JsonResponse(response, safe=False)

        except:
            response = {"error": "Error Occured"}
            return JsonResponse(response, safe=False)

    if(request.method == "POST"):
        # creates one busstop
        json_data = json.loads(request.body)
        name = json_data['name']
        longitude = float(json_data['longitude'])
        latitude = float(json_data['latitude'])
        try:
            bus = Busstop(name=name, longitude=longitude, latitude=latitude)
            bus.save()
            response = {
                "bid": bus.bid
            }
            return JsonResponse(response)
        except:
            response = {
                "error": "Error occured"
            }
            return JsonResponse(response, safe=False)

    if request.method == "PUT":
        # update bus
        json_data = json.loaods(request.body)
        old_name = json_data['old_name']
        name = json_data['name']
        longitude = float(json_data['longitude'])
        latitude = float(json_data['latitude'])
        try:
            bus = Busstop.nodes.get(name=old_name)
            bus.name = name
            bus.longitude = longitude
            bus.latitude = latitude
            bus.save()
            response = {
                'bid': bus.bid,
                'name': bus.name,
                'longitude': bus.longitude,
                'latitude': bus.latitude
            }
            return JsonResponse(response, safe=False)
        except:
            response = {"error": "Error occured"}
            return JsonResponse(response, safe=False)

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
