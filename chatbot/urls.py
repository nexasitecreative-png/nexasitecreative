
from django.urls import path

from . import views

app_name = "chatbot"

urlpatterns = [
    path("start/", views.start_chat, name="start_chat"),
    path("answer/", views.send_answer, name="send_answer"),
]
