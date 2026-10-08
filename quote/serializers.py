from rest_framework import serializers

from .models import QuoteRequest


class QuoteRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = QuoteRequest

        fields = [
            'id',
            'name',
            'email',
            'phone',
            'company',
            'service',
            'message',
            'status',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'status',
            'created_at',
        ]

    def validate_name(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                'Name is required.'
            )

        return value

    def validate_phone(self, value):

        value = value.strip()

        if not value.isdigit():
            raise serializers.ValidationError(
                'Phone number must contain only digits.'
            )

        if len(value) != 10:
            raise serializers.ValidationError(
                'Phone number must be exactly 10 digits.'
            )

        return value

    def validate_message(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                'Project requirements are required.'
            )

        return value

class SendOTPSerializer(serializers.Serializer):

    email = serializers.EmailField()

class VerifyOTPSerializer(serializers.Serializer):

    email = serializers.EmailField()

    otp = serializers.CharField(
        min_length=6,
        max_length=6
    )