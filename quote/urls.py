from django.urls import path

from .views import *
urlpatterns = [
    path(
        'quote/',
        QuoteRequestCreateView.as_view(),
        name='quote-create'
    ),
    path(
    'quote/send-otp/',
    SendQuoteOTPView.as_view(),
    name='quote-send-otp'
),
path(
    'quote/verify-otp/',
    VerifyQuoteOTPView.as_view(),
    name='quote-verify-otp'
),
]