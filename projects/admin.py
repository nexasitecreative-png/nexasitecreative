from django.contrib import admin

from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):

    list_display = (
        'title',
        'category',
        'is_featured',
        'is_active',
        'order',
        'created_at',
    )

    list_filter = (
        'category',
        'is_featured',
        'is_active',
    )

    search_fields = (
        'title',
        'category',
        'client_name',
        'tech_stack',
    )

    prepopulated_fields = {
        'slug': ('title',)
    }

    ordering = (
        'order',
        'title',
    )