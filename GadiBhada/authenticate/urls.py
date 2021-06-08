from django.urls import path
from . import views
#from try import views

urlpatterns = [
    path('register/', views.index, name='index'),
    path('login/', views.loginPage, name='login')
]