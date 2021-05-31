from django.urls import path
from .views import *

urlpatterns = [
    path('busstop', stopDetails),
    path('getallstop', getAllStops),
    path('connectBaB', connectBaB),
    path('getroute', getRoute),
    path('suggroute', getSuggestedRoute)
]
