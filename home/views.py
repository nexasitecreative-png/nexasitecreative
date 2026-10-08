from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import HomeHero
from .serializers import HomeHeroSerializer


def home(request):
    return render(request, 'home.html')


class HomeHeroView(APIView):

    def get(self, request):

        hero = (
            HomeHero.objects
            .filter(is_active=True)
            .order_by('-updated_at')
            .first()
        )

        if not hero:

            return Response(
                {
                    'detail': 'Home hero content not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = HomeHeroSerializer(
            hero,
            context={
                'request': request
            }
        )

        return Response(
            serializer.data
        )