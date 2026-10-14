
import base64
import logging
import os
import secrets
from datetime import timedelta
from email.message import EmailMessage

from django.utils import timezone
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import EmailOTP
from .serializers import (
    QuoteRequestSerializer,
    SendOTPSerializer,
    VerifyOTPSerializer,
)


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
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = serializer.validated_data["email"]
        otp = str(secrets.randbelow(900000) + 100000)

        client_id = os.getenv("GMAIL_CLIENT_ID")
        client_secret = os.getenv("GMAIL_CLIENT_SECRET")
        refresh_token = os.getenv("GMAIL_REFRESH_TOKEN")
        sender_email = os.getenv("GMAIL_SENDER_EMAIL")

        if not all([client_id, client_secret, refresh_token, sender_email]):
            logging.error("Gmail API environment variables are missing.")
            return Response(
                {"detail": "Email service is not configured. Please try again later."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            credentials = Credentials(
                token=None,
                refresh_token=refresh_token,
                token_uri="https://oauth2.googleapis.com/token",
                client_id=client_id,
                client_secret=client_secret,
                scopes=["https://www.googleapis.com/auth/gmail.send"],
            )

            service = build(
                "gmail",
                "v1",
                credentials=credentials,
                cache_discovery=False,
            )

            message = EmailMessage()
            message["To"] = email
            message["From"] = sender_email
            message["Subject"] = "Your Email Verification Code"
            message.set_content(
                f"Your verification code is: {otp}\n\n"
                "This code will expire in 5 minutes.\n\n"
                "If you did not request a quote, please ignore this email."
            )

            encoded_message = base64.urlsafe_b64encode(
                message.as_bytes()
            ).decode("utf-8")

            service.users().messages().send(
                userId="me",
                body={"raw": encoded_message},
            ).execute()

        except Exception:
            logging.exception("Failed to send quote verification email via Gmail API")
            return Response(
                {
                    "detail": (
                        "Unable to send the verification email. "
                        "Please try again."
                    )
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

        # Save the OTP only after the email is sent successfully.
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
            {"message": "Verification code sent to your email."},
            status=status.HTTP_200_OK,
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