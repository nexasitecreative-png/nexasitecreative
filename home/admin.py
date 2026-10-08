from django.contrib import admin

from .models import HomeHero


@admin.register(HomeHero)
class HomeHeroAdmin(admin.ModelAdmin):

    list_display = (
        'title',
        'button_text',
        'is_active',
        'updated_at',
    )

    list_filter = (
        'is_active',
    )

    search_fields = (
        'badge_text',
        'title',
        'description',
    )

    ordering = (
        '-updated_at',
    )