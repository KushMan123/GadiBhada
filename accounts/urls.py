from django.urls import path
from .views import GetProfileView, CreateProfileView, GetUserRoutesView

urlpatterns = [
    path('get-profiledata', GetProfileView.as_view()),
    path('create-profiledata/', CreateProfileView.as_view()),
    path('get-routedata', GetUserRoutesView.as_view()),

]
