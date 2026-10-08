from django.db import models


class Project(models.Model):

    title = models.CharField(max_length=200)

    slug = models.SlugField(
        unique=True
    )

    category = models.CharField(
        max_length=100,
        blank=True
    )

    thumbnail = models.ImageField(
        upload_to='projects/',
        blank=True,
        null=True
    )

    short_description = models.TextField()

    full_description = models.TextField()

    tech_stack = models.CharField(
        max_length=500,
        blank=True
    )

    client_name = models.CharField(
        max_length=200,
        blank=True
    )

    live_url = models.URLField(
        blank=True
    )

    is_featured = models.BooleanField(
        default=False
    )

    is_active = models.BooleanField(
        default=True
    )

    order = models.IntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )


    def __str__(self):
        return self.title