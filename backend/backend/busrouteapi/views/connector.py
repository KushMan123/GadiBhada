from django.http import JsonResponse
from busrouteapi.models import *
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def connectBaB(request):
    if request.method == 'PUT':
        json_data = json.loads(request.body)
        bid1 = json_data['bid1']
        bid2 = json_data['bid2']
        try:
            bus = bus.nodes.get(bid=bid1)
            bus_next = bus.nodes.get(code=bid2)
            res = bus.next_stop.connect(bus_next)
            response = {"result": res}
            return JsonResponse(response, safe=False)
        except:
            response = {"error": "Error occurred"}
            return JsonResponse(response, safe=False)