from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import CompanyInfo
from .serializers import CompanyInfoSerializer


class CompanyInfoView(APIView):

    def get(self, request):

        company = (
            CompanyInfo.objects
            .filter(is_active=True)
            .order_by('-updated_at')
            .first()
        )

        if not company:

            return Response(
                {
                    'detail': 'Company information not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CompanyInfoSerializer(
            company,
            context={
                'request': request
            }
        )

        return Response(
            serializer.data
        )