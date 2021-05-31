from django.db import models
from neomodel import StructuredNode, StringProperty, IntegerProperty, UniqueIdProperty, Relationship, StructuredRel, FloatProperty

# Create your models here.


class Busroute(StructuredRel):
    rid = StringProperty(required=True)
    rname = StringProperty(required=True)


class Busstop(StructuredNode):
    bid = UniqueIdProperty()
    name = StringProperty(unique_index=True, required=True)
    latitude = FloatProperty(index=True, required=True)
    longitude = FloatProperty(index=True, required=True)

    # Relations:
    next_stop = Relationship('Busstop', 'ROUTE', model=Busroute)
