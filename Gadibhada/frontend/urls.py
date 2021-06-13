from django.urls import path
from .views import index, form

urlpatterns = [
    path('',index),
    path('createstop',index),
    path('map',index),
    path('createroute', index)
]
