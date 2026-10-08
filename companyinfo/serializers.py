from rest_framework import serializers

from .models import CompanyInfo


class CompanyInfoSerializer(serializers.ModelSerializer):

    logo = serializers.SerializerMethodField()


    class Meta:
        model = CompanyInfo

        fields = '__all__'


    def get_logo(self, obj):

        if not obj.logo:
            return None

        request = self.context.get('request')

        if request:
            return request.build_absolute_uri(
                obj.logo.url
            )

        return obj.logo.url