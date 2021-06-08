from django.urls import path
from . import views
#from try import views

urlpatterns = [
    path('', views.home, name='home')
]