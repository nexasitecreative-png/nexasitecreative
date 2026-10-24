
from django.contrib import admin

from .models import (
    ChatbotSettings,
    ChatbotQuestion,
    ChatbotOption,
    ChatSession,
    ChatResponse,
)


class ChatbotOptionInline(admin.TabularInline):
    model = ChatbotOption
    extra = 1


@admin.register(ChatbotQuestion)
class ChatbotQuestionAdmin(admin.ModelAdmin):
    list_display = (
        "question_text",
        "answer_type",
        "order",
        "is_required",
        "is_active",
    )
    list_editable = ("order", "is_required", "is_active")
    list_filter = ("answer_type", "is_required", "is_active")
    search_fields = ("question_text",)
    inlines = [ChatbotOptionInline]


@admin.register(ChatbotSettings)
class ChatbotSettingsAdmin(admin.ModelAdmin):
    list_display = ("title", "is_enabled")


class ChatResponseInline(admin.TabularInline):
    model = ChatResponse
    extra = 0
    readonly_fields = ("created_at", "updated_at")


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = (
        "visitor_name",
        "visitor_email",
        "visitor_phone",
        "status",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = (
        "visitor_name",
        "visitor_email",
        "visitor_phone",
    )
    readonly_fields = (
        "session_id",
        "created_at",
        "updated_at",
    )
    inlines = [ChatResponseInline]


@admin.register(ChatbotOption)
class ChatbotOptionAdmin(admin.ModelAdmin):
    list_display = ("label", "value", "question", "order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("label", "value")


@admin.register(ChatResponse)
class ChatResponseAdmin(admin.ModelAdmin):
    list_display = ("session", "question", "created_at")
    search_fields = (
        "session__visitor_name",
        "session__visitor_email",
        "answer",
    )
    readonly_fields = ("created_at", "updated_at")
