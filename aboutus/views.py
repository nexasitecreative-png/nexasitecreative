from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import AboutUs
from .serializers import AboutUsSerializer


class AboutUsView(APIView):

    def get(self, request):

        about = AboutUs.objects.filter(
            is_active=True
        ).order_by('-updated_at').first()

        if not about:
            return Response(
                {
                    'detail': 'About Us content not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = AboutUsSerializer(
            about,
            context={'request': request}
        )

        return Response(serializer.data)


def about_page(request):

    return render(
        request,
        'aboutus/detail.html'
    )