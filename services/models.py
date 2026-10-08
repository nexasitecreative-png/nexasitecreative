from django.db import models


class Service(models.Model):
    title = models.CharField(max_length=200)

    slug = models.SlugField(unique=True)

    icon = models.CharField(
        max_length=100,
        blank=True
    )

    short_description = models.TextField()

    full_description = models.TextField()

    image = models.ImageField(
        upload_to='services/',
        blank=True,
        null=True
    )

    order = models.IntegerField(default=0)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.title