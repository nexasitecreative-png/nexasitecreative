from django.contrib import admin

from .models import AboutUs


@admin.register(AboutUs)
class AboutUsAdmin(admin.ModelAdmin):

    list_display = (
        'title',
        'founded_year',
        'is_active',
        'updated_at',
    )

    list_filter = (
        'is_active',
    )

    search_fields = (
        'title',
        'story',
        'mission',
        'vision',
    )

    ordering = (
        '-updated_at',
    )