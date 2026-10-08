from django.urls import path

from .views import AboutUsView


urlpatterns = [
    path(
        'about/',
        AboutUsView.as_view(),
        name='about-us'
    ),
]