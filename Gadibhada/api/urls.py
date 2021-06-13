from django.urls import path
from .views import CreateRouteView, CreateStopView, StopView, RouteView,GetRouteView

urlpatterns = [
    path('stops',StopView.as_view()),
    path('create-stop',CreateStopView.as_view()),
    path('routes',RouteView.as_view()),
    path('create-route',CreateRouteView.as_view()),
    path('get-route',GetRouteView.as_view()),
]
