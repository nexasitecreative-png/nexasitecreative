from django.contrib import admin

from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):

    list_display = (
        'title',
        'order',
        'is_active',
        'created_at',
    )

    list_filter = (
        'is_active',
    )

    search_fields = (
        'title',
        'short_description',
    )

    prepopulated_fields = {
        'slug': ('title',)
    }

    ordering = (
        'order',
        'title',
    )