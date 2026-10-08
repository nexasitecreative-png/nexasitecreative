from django.urls import path
from .views import *

urlpatterns = [
    path(
        "serviceslist/",
        ServiceListView.as_view(),
        
        name="service-list"
    ),

    path(
        "services/<slug:slug>/",
        service_detail,
        name="service-detail"
    ),
]