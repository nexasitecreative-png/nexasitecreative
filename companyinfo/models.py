from django.db import models


class CompanyInfo(models.Model):

    company_name = models.CharField(
        max_length=200,
        default='My Company'
    )

    tagline = models.CharField(
        max_length=300,
        blank=True
    )

    description = models.TextField(
        blank=True
    )

    email = models.EmailField(
        blank=True
    )

    phone = models.CharField(
        max_length=50,
        blank=True
    )

    address = models.TextField(
        blank=True
    )

    logo = models.ImageField(
        upload_to='company/',
        blank=True,
        null=True
    )

    copyright_text = models.CharField(
        max_length=300,
        blank=True
    )

    is_active = models.BooleanField(
        default=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )


    def __str__(self):
        return self.company_name