
import uuid

from django.db import models


class ChatbotSettings(models.Model):
    title = models.CharField(
        max_length=100,
        default="NexaSiteCreative",
    )
    welcome_message = models.TextField(
        default="Hello! Welcome to NexaSiteCreative. How can we help you?"
    )
    is_enabled = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Chatbot Settings"
        verbose_name_plural = "Chatbot Settings"

    def __str__(self):
        return self.title


class ChatbotQuestion(models.Model):
    ANSWER_TYPES = [
        ("text", "Text"),
        ("email", "Email"),
        ("phone", "Phone Number"),
        ("choice", "Multiple Choice"),
        ("textarea", "Long Text"),
    ]

    question_text = models.CharField(max_length=500)
    answer_type = models.CharField(
        max_length=20,
        choices=ANSWER_TYPES,
        default="text",
    )
    order = models.PositiveIntegerField(default=0)
    is_required = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Chatbot Question"
        verbose_name_plural = "Chatbot Questions"

    def __str__(self):
        return self.question_text


class ChatbotOption(models.Model):
    question = models.ForeignKey(
        ChatbotQuestion,
        on_delete=models.CASCADE,
        related_name="options",
    )
    label = models.CharField(max_length=200)
    value = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.question.question_text} - {self.label}"


class ChatSession(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("completed", "Completed"),
    ]

    session_id = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
    )
    visitor_name = models.CharField(max_length=150, blank=True)
    visitor_email = models.EmailField(blank=True)
    visitor_phone = models.CharField(max_length=20, blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="active",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Chat {self.session_id}"


class ChatResponse(models.Model):
    session = models.ForeignKey(
        ChatSession,
        on_delete=models.CASCADE,
        related_name="responses",
    )
    question = models.ForeignKey(
        ChatbotQuestion,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="responses",
    )
    answer = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["session", "question"],
                name="unique_chat_session_question",
            )
        ]

    def __str__(self):
        return f"Response from {self.session.session_id}"
