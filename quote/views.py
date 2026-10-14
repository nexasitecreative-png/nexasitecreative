from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta

from django.core.mail import send_mail
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import EmailOTP
from .serializers import *
import requests
from django.conf import settings

class QuoteRequestCreateView(APIView):

    def post(self, request):

        serializer = QuoteRequestSerializer(
            data=request.data
        )

        if serializer.is_valid():

            quote = serializer.save()

            return Response(
                {
                    'message': (
                        'Your quote request has been '
                        'submitted successfully.'
                    ),
                    'quote_id': quote.id,
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
                status=status.HTTP_400_BAD_REQUEST
            )

        email = serializer.validated_data["email"]

        if not settings.RESEND_API_KEY or not settings.RESEND_FROM_EMAIL:
            return Response(
                {"detail": "Email service is not configured."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        otp = str(__import__("secrets").randbelow(900000) + 100000)

        try:
            response = requests.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": settings.RESEND_FROM_EMAIL,
                    "to": [email],
                    "subject": "Your Email Verification Code",
                    "text": (
                        f"Your verification code is: {otp}\n\n"
                        "This code will expire in 5 minutes.\n\n"
                        "If you did not request a quote, please ignore this email."
                    ),
                },
                timeout=15,
            )
            response.raise_for_status()

        except requests.RequestException as exc:
            error_response = getattr(exc, "response", None)

            print("Resend error type:", type(exc).__name__)
            print("Resend status:", getattr(error_response, "status_code", None))
            print("Resend response:", getattr(error_response, "text", ""))

            return Response(
                {"detail": "Unable to send the verification email. Please try again."},
                status=status.HTTP_502_BAD_GATEWAY
            )

        # Save the OTP only after Resend accepts the email request.
        EmailOTP.objects.filter(
            email=email, is_verified=False
        ).delete()

        EmailOTP.objects.create(
            email=email,
            otp=otp,
            expires_at=timezone.now() + timedelta(minutes=5),
        )

        return Response(
            {"message": "Verification code sent to your email."},
            status=status.HTTP_200_OK
        )

class VerifyQuoteOTPView(APIView):

    def post(self, request):
        print("VERIFY REQUEST DATA:", request.data)
        serializer = VerifyOTPSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            print(
                "VERIFY SERIALIZER ERRORS:",
                serializer.errors
            )
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']

        verification = EmailOTP.objects.filter(
            email=email,
            is_verified=False
        ).order_by('-created_at').first()

        if not verification:

            return Response(
                {
                    'detail':
                        'Verification code not found.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check expiration
        if timezone.now() > verification.expires_at:

            verification.delete()

            return Response(
                {
                    'detail':
                        'Verification code has expired.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Maximum 5 attempts
        if verification.attempts >= 5:

            verification.delete()

            return Response(
                {
                    'detail':
                        'Too many incorrect attempts.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check OTP
        if verification.otp != otp:

            verification.attempts += 1

            verification.save(
                update_fields=['attempts']
            )

            return Response(
                {
                    'detail':
                        'Invalid verification code.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # OTP correct
        verification.is_verified = True

        verification.save(
            update_fields=['is_verified']
        )

        return Response(
            {
                'message':
                    'Email verified successfully.'
            },
            status=status.HTTP_200_OK
        )