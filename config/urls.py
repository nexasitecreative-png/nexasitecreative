from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path,include
from services.views import service_detail_page,services_page
from projects.views import project_detail_page
from home.views import home
from projects.views import project_detail_page, projects_page
from aboutus.views import AboutUsView
from aboutus.views import about_page

urlpatterns = [
    path("admin/", admin.site.urls),
    path('',include('home.urls') ),
    path('service/',include('services.urls'))
  ,
#   path('service/', include('home.urls')),
    path(
    'service/',
    include('projects.urls')
),
path(
    'projects/',
    projects_page,
    name='projects-page'
),
path('services/',services_page,name='service-page'),
    path(
        'services/<slug:slug>/',
        service_detail_page,
        name='service-page'
    ),
    path(
        'projects/<slug:slug>/',
        project_detail_page,
        name='project-page'
    ),
     # About Us API
    path('service/', include('aboutus.urls')),

    path(
    'about/',
    about_page,
    name='about-page'
),
path('service/', include('faq.urls')),
   path('service/', include('quote.urls')),

   path('service/', include('companyinfo.urls')),

]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )