from django.urls import path

from .views import *

name='home'
urlpatterns = [

    path(
        'hero/',
        HomeHeroView.as_view(),
        name='home-hero'
    ),
    path(
            '',home,name='home'
        ),

]