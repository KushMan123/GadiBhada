from django.contrib.gis.db import models
from django.contrib.gis.geos.point import Point
from django.contrib.postgres.fields import ArrayField
from neomodel import StructuredNode, StringProperty, FloatProperty, IntegerProperty, UniqueIdProperty, Relationship, RelationshipTo, StructuredRel
from accounts.models import UserAccount, User

default = []
# Create your models here.


class Stop(models.Model):
    usid = models.CharField(max_length=255, default=0)
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    location=models.PointField(default=Point(0,0))


class Route(models.Model):
    usid = models.CharField(max_length=255, default=0)
    stops = ArrayField(models.CharField(max_length=100),
                       blank=True, default=list)
    rid = models.CharField(max_length=100)
    rname = models.CharField(max_length=100)


class Busroute(StructuredRel):
    rid = StringProperty(required=True)
    rname = StringProperty(required=True)
    user = StringProperty(required=True)


class Busstop(StructuredNode):
    uid = UniqueIdProperty()
    name = StringProperty()
    latitude = FloatProperty(index=True)
    longitude = FloatProperty(index=True)

    # Relationship
    next_stop = Relationship('Busstop', 'ROUTE', model=Busroute)
    user = Relationship('User', 'OWNED_BY')
