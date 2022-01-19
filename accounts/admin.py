from django.contrib import admin
from .models import UserAccount, Profile
from django.contrib.auth.admin import UserAdmin

# Register your models here.


class UserAdminConfig(UserAdmin):

    ordering = ('name',)
    list_display = ('email', 'name', 'is_busowner', 'is_active', 'is_staff')

    fieldsets = (
        (None, {'fields': ('email', 'name',)}),
        ('Permissions', {'fields': ('is_busowner', 'is_staff', 'is_active',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2', 'is_busowner', 'is_staff', 'is_active')}
         ),
    )


admin.site.register(UserAccount, UserAdminConfig)
admin.site.register(Profile)


