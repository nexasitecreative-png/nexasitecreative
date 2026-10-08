from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Project
from .serializers import ProjectSerializer

class ProjectListView(APIView):

    def get(self, request):

        projects = (
            Project.objects
            .filter(is_active=True)
            .order_by('order', '-created_at')
        )


        # Category filter

        category = request.query_params.get(
            'category'
        )

        if category:

            projects = projects.filter(
                category__iexact=category
            )


        # Featured filter

        featured = request.query_params.get(
            'featured'
        )

        if featured == 'true':

            projects = projects.filter(
                is_featured=True
            )


        # Search

        search = request.query_params.get(
            'search'
        )

        if search:

            from django.db.models import Q

            projects = projects.filter(
                Q(title__icontains=search) |
                Q(category__icontains=search) |
                Q(short_description__icontains=search)
            )


        # Pagination

        page = request.query_params.get(
            'page'
        )

        if page:

            from rest_framework.pagination import PageNumberPagination

            paginator = PageNumberPagination()

            paginator.page_size = 6

            result_page = paginator.paginate_queryset(
                projects,
                request
            )

            serializer = ProjectSerializer(
                result_page,
                many=True,
                context={
                    'request': request
                }
            )

            return paginator.get_paginated_response(
                serializer.data
            )


        # Normal response

        serializer = ProjectSerializer(
            projects,
            many=True,
            context={
                'request': request
            }
        )

        return Response(
            serializer.data
        )

class ProjectDetailView(APIView):

    def get(self, request, slug):

        try:
            project = Project.objects.get(
                slug=slug,
                is_active=True
            )

        except Project.DoesNotExist:

            return Response(
                {
                    'detail': 'Project not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ProjectSerializer(
            project,
            context={'request': request}
        )

        return Response(serializer.data)

from django.shortcuts import render


def project_detail_page(request, slug):

    return render(
        request,
        'projects/detail.html',
        {
            'slug': slug
        }
    )

def projects_page(request):
    return render(request, 'projects/list.html')
