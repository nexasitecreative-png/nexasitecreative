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

        serializer = SendOTPSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        email = serializer.validated_data['email']

        # Delete previous unused OTP
        EmailOTP.objects.filter(
            email=email,
            is_verified=False
        ).delete()

        # Generate 6-digit OTP
        otp = str(
            __import__('secrets').randbelow(900000) + 100000
        )

        # Save OTP
        EmailOTP.objects.create(
            email=email,
            otp=otp,
            expires_at=(
                timezone.now()
                + timedelta(minutes=5)
            )
        )

        # Send email
        send_mail(
            subject='Your Email Verification Code',

            message=(
                f'Your verification code is: {otp}\n\n'
                'This code will expire in 5 minutes.\n\n'
                'If you did not request a quote, '
                'please ignore this email.'
            ),

            from_email=None,

            recipient_list=[
                email
            ],

            fail_silently=False
        )

        return Response(
            {
                'message':
                    'Verification code sent to your email.'
            },
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