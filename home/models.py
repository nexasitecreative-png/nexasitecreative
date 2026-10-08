from django.db import models


class HomeHero(models.Model):

    badge_text = models.CharField(
        max_length=200,
        default='Welcome to My Company'
    )

    title = models.CharField(
        max_length=300,
        default='We build modern digital solutions.'
    )

    title_2 = models.CharField(
        max_length=300,
        blank=True,
        default='We create powerful digital experiences.'
    )

    title_3 = models.CharField(
        max_length=300,
        blank=True,
        default='We turn ideas into innovative solutions.'
    )

    description = models.TextField(
        blank=True
    )

    button_text = models.CharField(
        max_length=100,
        default='Get Started'
    )

    button_link = models.CharField(
        max_length=300,
        default='#quote'
    )

    image = models.ImageField(
        upload_to='hero/',
        blank=True,
        null=True
    )

    is_active = models.BooleanField(
        default=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.title