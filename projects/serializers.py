from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):

    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'

    def get_thumbnail(self, obj):

        if not obj.thumbnail:
            return None

        request = self.context.get('request')

        if request:
            return request.build_absolute_uri(
                obj.thumbnail.url
            )

        return obj.thumbnail.url