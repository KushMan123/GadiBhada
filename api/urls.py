from django.urls import path
from .views import CreateRouteView, CreateStopView, DeleteRoute, StopView, RouteView,GetRouteView,GetShortestPath, DeleteStop

urlpatterns = [
    path('stops',StopView.as_view()),
    path('create-stop',CreateStopView.as_view()),
    path('routes',RouteView.as_view()),
    path('create-route',CreateRouteView.as_view()),
    path('get-route',GetRouteView.as_view()),
    path('get-path',GetShortestPath.as_view()),
    path('delete-stop',DeleteStop.as_view()),
    path('delete-route',DeleteRoute.as_view()),
]
