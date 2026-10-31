
import logging
import secrets
from datetime import timedelta
import requests

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import EmailOTP
from .serializers import (
    QuoteRequestSerializer,
    SendOTPSerializer,
    VerifyOTPSerializer,
)


logger = logging.getLogger(__name__)


class QuoteRequestCreateView(APIView):

    def post(self, request):

        serializer = QuoteRequestSerializer(data=request.data)

        if serializer.is_valid():

            quote = serializer.save()

            return Response(
                {
                    "message": (
                        "Your quote request has been "
                        "submitted successfully."
                    ),
                    "quote_id": quote.id,
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class SendQuoteOTPView(APIView):

    def post(self, request):

        serializer = SendOTPSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = serializer.validated_data["email"]

        # Generate secure six-digit OTP
        otp = str(secrets.randbelow(900000) + 100000)

        # Check Brevo SMTP configuration
        if not all([
            settings.EMAIL_HOST_USER,
            settings.EMAIL_HOST_PASSWORD,
            settings.DEFAULT_FROM_EMAIL,
        ]):
            logger.error("Brevo SMTP credentials are missing.")

            return Response(
                {
                    "detail": (
                        "Email service is not configured. "
                        "Please try again later."
                    )
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        # Send OTP through Brevo SMTP
        try:
            response = requests.post(
                "https://api.brevo.com/v3/smtp/email",
                headers={
                    "accept": "application/json",
                    "api-key": settings.BREVO_API_KEY,
                    "content-type": "application/json",
                },
                json={
                    "sender": {
                        "name": "NexaSiteCreative",
                        "email": settings.DEFAULT_FROM_EMAIL,
                    },
                    "to": [
                        {"email": email}
                    ],
                    "subject": "Your NexaSiteCreative Email Verification Code",
                    "textContent": (
                        f"Your verification code is: {otp}\n\n"
                        "This code will expire in 5 minutes."
                    ),
                },
                timeout=20,
            )

            response.raise_for_status()

        except requests.RequestException:
            logger.exception("Brevo API email sending failed.")
            return Response(
                {"detail": "Unable to send the verification email. Please try again."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        # Save OTP only after successful email delivery
        EmailOTP.objects.filter(
            email=email,
            is_verified=False,
        ).delete()

        EmailOTP.objects.create(
            email=email,
            otp=otp,
            expires_at=timezone.now() + timedelta(minutes=5),
        )

        return Response(
            {
                "message": "Verification code sent to your email."
            },
            status=status.HTTP_200_OK,
        )


class VerifyQuoteOTPView(APIView):

    def post(self, request):

        serializer = VerifyOTPSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]

        verification = EmailOTP.objects.filter(
            email=email,
            is_verified=False
        ).order_by("-created_at").first()

        if not verification:
            return Response(
                {
                    "detail": "Verification code not found."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check expiration
        if timezone.now() > verification.expires_at:

            verification.delete()

            return Response(
                {
                    "detail": "Verification code has expired."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Maximum 5 attempts
        if verification.attempts >= 5:

            verification.delete()

            return Response(
                {
                    "detail": "Too many incorrect attempts."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check OTP
        if verification.otp != otp:

            verification.attempts += 1

            verification.save(
                update_fields=["attempts"]
            )

            return Response(
                {
                    "detail": "Invalid verification code."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # OTP correct
        verification.is_verified = True

        verification.save(
            update_fields=["is_verified"]
        )

        return Response(
            {
                "message": "Email verified successfully."
            },
            status=status.HTTP_200_OK
        )
