from django.contrib import admin
from .models import Route, Stop
from mapbox_location_field.spatial.admin import SpatialMapAdmin

# Register your models here.
class StopAdmin(admin.ModelAdmin):
    list_display=("name","latitude","longitude")

class RouteAdmin(admin.ModelAdmin):
    list_display=('rname','rid','stops')

admin.site.register(Stop,StopAdmin)
admin.site.register(Route,RouteAdmin)
