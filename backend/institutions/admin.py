from django.contrib import admin

from institutions.models import Institution

# Register your models here.
@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = ("name", "address", "logo")
    search_fields = ("name", "address")
    fieldsets = (
        (None, {
            'fields': ("name", "address", "logo")
        }),
    )