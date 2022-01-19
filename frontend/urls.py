from django.urls import path
from .views import index, form

urlpatterns = [
    path('',index),
    path('createstop',index),
    path('userprofile', index),
    path('map',index),
    path('login', index),
    path('signup', index),
    path('reset-password', index),
    path('password/reset/confirm/<str:uid>/<str:token>', index),
    path('activate/<str:uid>/<str:token>', index),
]
