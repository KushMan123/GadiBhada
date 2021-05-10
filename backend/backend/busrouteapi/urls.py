from django.urls import path
from .views import *

urlpatterns=[
    path('busstop',StopDetails),
    path('getAllStop',getAllStops),
    path('connectBaB',connectBaB),
    path('getroute',getRoute),
    path('suggrout',getsuggestedroute)
]