from django.db import models


class FAQ(models.Model):

    question = models.CharField(
        max_length=300
    )

    answer = models.TextField()

    order = models.IntegerField(
        default=0
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.question