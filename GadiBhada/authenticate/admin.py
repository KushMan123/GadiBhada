from django.contrib.auth.admin import UserAdmin
from django.contrib import admin
#from .models import Profile
from authenticate.models import User

# Register your models here.

# class MyUserAdmin(UserAdmin):
#     model = User
#     #fieldsets = UserAdmin.fieldsets + ((None,{'fields' : ('name')}),)

admin.site.register(User)