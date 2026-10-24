
import json

from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.http import require_POST

from .models import (
    ChatbotSettings,
    ChatbotQuestion,
    ChatSession,
    ChatResponse,
)


def get_next_question(session):
    answered_ids = session.responses.exclude(
        question__isnull=True
    ).values_list("question_id", flat=True)

    return (
        ChatbotQuestion.objects
        .filter(is_active=True)
        .exclude(id__in=answered_ids)
        .order_by("order", "id")
        .first()
    )


def question_data(question):
    data = {
        "id": question.id,
        "text": question.question_text,
        "type": question.answer_type,
        "required": question.is_required,
        "options": [],
    }

    if question.answer_type == "choice":
        data["options"] = list(
            question.options.filter(is_active=True)
            .order_by("order", "id")
            .values("label", "value")
        )

    return data


@require_POST
def start_chat(request):
    settings = ChatbotSettings.objects.first()

    if not settings or not settings.is_enabled:
        return JsonResponse(
            {"error": "Chatbot is currently unavailable."},
            status=503,
        )

    session = ChatSession.objects.create()

    question = get_next_question(session)

    if not question:
        return JsonResponse({
            "session_id": str(session.session_id),
            "welcome_message": settings.welcome_message,
            "completed": True,
        })

    return JsonResponse({
        "session_id": str(session.session_id),
        "welcome_message": settings.welcome_message,
        "question": question_data(question),
        "completed": False,
    })


@require_POST
def send_answer(request):
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid request."}, status=400)

    session_id = data.get("session_id")
    question_id = data.get("question_id")
    answer = data.get("answer", "")

    if not isinstance(answer, str):
        return JsonResponse(
            {"error": "Answer must be text."},
            status=400,
        )

    answer = answer.strip()

    if len(answer) > 5000:
        return JsonResponse(
            {"error": "Answer is too long."},
            status=400,
        )

    with transaction.atomic():
        try:
            session = ChatSession.objects.select_for_update().get(
                session_id=session_id,
                status="active",
            )
        except (ChatSession.DoesNotExist, ValueError, TypeError):
            return JsonResponse(
                {"error": "Chat session not found or completed."},
                status=404,
            )

        question = get_next_question(session)

        if not question or str(question.id) != str(question_id):
            return JsonResponse(
                {"error": "This question is no longer current. Please refresh the chat."},
                status=400,
            )

        if question.is_required and not answer:
            return JsonResponse(
                {"error": "Please answer this question."},
                status=400,
            )

        if question.answer_type == "email" and answer:
            from django.core.validators import validate_email
            from django.core.exceptions import ValidationError

            try:
                validate_email(answer)
            except ValidationError:
                return JsonResponse(
                    {"error": "Please enter a valid email address."},
                    status=400,
                )

        if question.answer_type == "phone" and answer:
            import re

            if not re.fullmatch(r"[0-9]{10}", answer):
                return JsonResponse(
                    {"error": "Please enter a valid phone number."},
                    status=400,
                )

        if question.answer_type == "choice":
            valid_values = list(
                question.options.filter(is_active=True)
                .values_list("value", flat=True)
            )
            if answer and answer not in valid_values:
                return JsonResponse(
                    {"error": "Please select a valid option."},
                    status=400,
                )

        ChatResponse.objects.update_or_create(
            session=session,
            question=question,
            defaults={"answer": answer},
        )

        if question.question_text.lower().strip() in (
            "what is your name?",
            "what is your name",
        ):
            session.visitor_name = answer
        elif question.question_text.lower().strip() in (
            "what is your email address?",
            "what is your email address",
        ):
            session.visitor_email = answer
        elif question.question_text.lower().strip() in (
            "what is your phone number?",
            "what is your phone number",
        ):
            session.visitor_phone = answer

        session.save()

        next_question = get_next_question(session)

        if next_question is None:
            session.status = "completed"
            session.save(update_fields=["status", "updated_at"])

            return JsonResponse({
                "success": True,
                "completed": True,
                "message": "Thank you! Your details have been submitted successfully.",
            })

        return JsonResponse({
            "success": True,
            "completed": False,
            "question": question_data(next_question),
        })
