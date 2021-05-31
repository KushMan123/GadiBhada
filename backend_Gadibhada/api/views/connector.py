from django.http import JsonResponse
from ..models import *
from django.views.decorators.csrf import csrf_exempt
import json


@csrf_exempt
def connectBaB(request):
    if request.method == 'PUT':
        json_data = json.loads(request.body)
        bname1 = json_data['bname1']
        bname2 = json_data['bname2']
        new_rid = json_data['new_rid']
        new_rname = json_data['new_rname']

        try:
            bus = Busstop.nodes.get(name=bname1)
            print(bus)
            bus_next = Busstop.nodes.get(name=bname2)
            print(bus_next)
            res = bus.next_stop.connect(
                bus_next, properties={"rid": new_rid, "rname": new_rname})
            print(res)
            response = {"result": f"{res}"}
            return JsonResponse(response, safe=False)

        except:
            response = {"error": "Error occurred"}
            return JsonResponse(response, safe=False)
