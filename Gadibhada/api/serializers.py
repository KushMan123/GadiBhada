from django.db import models
from django.db.models import fields
from rest_framework import serializers
from .models import Route, Stop

class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model= Stop
        fields = ('id','name','longitude','latitude','created_at')

class CreateStopSerializaer(serializers.ModelSerializer):
    class Meta:
        model=Stop
        fields = ('name','longitude','latitude')

class BusRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model=Route
        fields=('rid','rname','stops')

class CreateRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model=Route
        fields = ('rid','rname','stops')

class GetRouteSerializer(serializers.Serializer):
    route_id=serializers.CharField(max_length=200)