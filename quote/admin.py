from django.contrib import admin

from .models import QuoteRequest, EmailOTP


@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'name',
        'email',
        'phone',
        'company',
        'service',
        'status',
        'created_at',
    )

    list_filter = (
        'status',
        'service',
        'created_at',
    )

    search_fields = (
        'name',
        'email',
        'phone',
        'company',
        'message',
    )

    readonly_fields = (
        'created_at',
        'updated_at',
    )

    ordering = (
        '-created_at',
    )


@admin.register(EmailOTP)
class EmailOTPAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'email',
        'otp',
        'is_verified',
        'attempts',
        'expires_at',
        'created_at',
    )

    list_filter = (
        'is_verified',
        'created_at',
        'expires_at',
    )

    search_fields = (
        'email',
    )

    readonly_fields = (
        'created_at',
    )

    ordering = (
        '-created_at',
    )