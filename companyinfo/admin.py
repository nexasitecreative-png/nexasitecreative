from django.contrib import admin

from .models import CompanyInfo


@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):

    list_display = (
        'company_name',
        'email',
        'phone',
        'is_active',
        'updated_at',
    )

    list_filter = (
        'is_active',
    )

    search_fields = (
        'company_name',
        'email',
        'phone',
        'address',
    )

    ordering = (
        '-updated_at',
    )