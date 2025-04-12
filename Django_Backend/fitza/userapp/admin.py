from django.contrib import admin
from adminapp.models import AdminProfile
from common.models import CustomUser

# Register your models here.

from django.contrib import admin
from django.contrib.auth.hashers import make_password


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'phone_number', 'is_staff']  # Customize the displayed fields
    search_fields = ['username', 'email']  # Add search functionality
    list_filter = ['is_staff', 'is_active']  # Add filters in the admin panel

    def save_model(self, request, obj, form, change):
        # Only hash the password if it's being created or if it's in plaintext
        if not obj.pk or not obj.password.startswith("pbkdf2_"):
            obj.password = make_password(obj.password)
        super().save_model(request, obj, form, change)

# Register the CustomUser model with the customized admin class
admin.site.register(CustomUser, CustomUserAdmin)



admin.site.register(AdminProfile)