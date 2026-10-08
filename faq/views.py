from rest_framework.views import APIView
from rest_framework.response import Response

from .models import FAQ
from .serializers import FAQSerializer


class FAQListView(APIView):

    def get(self, request):

        faqs = FAQ.objects.filter(
            is_active=True
        ).order_by(
            'order',
            'question'
        )

        serializer = FAQSerializer(
            faqs,
            many=True
        )

        return Response(serializer.data)