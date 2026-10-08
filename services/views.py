from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render, get_object_or_404
from .models import Service
from .serializers import ServiceSerializer
from rest_framework.views import APIView

def services_page(request):
    return render(request, 'services/list.html')


class ServiceListView(APIView):

    def get(self, request):

        services = (
            Service.objects
            .filter(is_active=True)
            .order_by('order', 'title')
        )

        page = request.query_params.get('page')

        if page:

            from rest_framework.pagination import PageNumberPagination

            paginator = PageNumberPagination()

            paginator.page_size = 6

            result_page = paginator.paginate_queryset(
                services,
                request
            )

            serializer = ServiceSerializer(
                result_page,
                many=True,
                context={
                    'request': request
                }
            )

            return paginator.get_paginated_response(
                serializer.data
            )

        serializer = ServiceSerializer(
            services,
            many=True,
            context={
                'request': request
            }
        )

        return Response(
            serializer.data
        )

@api_view(["GET"])
def service_detail(request, slug):
    try:
        service = Service.objects.get(
            slug=slug,
            is_active=True
        )

    except Service.DoesNotExist:
        return Response(
            {
                "detail": "Service not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ServiceSerializer(
        service,
        context={"request": request}
    )

    return Response(serializer.data)


def service_detail_page(request, slug):
    service = get_object_or_404(
        Service,
        slug=slug,
        is_active=True
    )

    return render(
        request,
        "services/details.html",
        {
            "service": service
        }
    )