from django.db import models
from django.contrib.postgres.fields import ArrayField
from neomodel import StructuredNode, StringProperty, FloatProperty, IntegerProperty, UniqueIdProperty,Relationship,StructuredRel


# Create your models here.
class Stop(models.Model):
    name=models.CharField(max_length=100)
    latitude=models.FloatField()
    longitude=models.FloatField()
    created_at=models.DateTimeField(auto_now_add=True)

class Route(models.Model):
    stops=ArrayField(models.CharField(max_length=100),blank=True,default=list)
    rid=models.CharField(max_length=100)
    rname=models.CharField(max_length=100)

class Busroute(StructuredRel):
    rid=StringProperty(required=True)
    rname=StringProperty(required=True)

class Busstop(StructuredNode):
    uid=UniqueIdProperty()
    name=StringProperty()
    latitude=FloatProperty(index=True)
    longitude=FloatProperty(index=True)

    #Relationship
    next_stop=Relationship('Busstop','ROUTE',model=Busroute)