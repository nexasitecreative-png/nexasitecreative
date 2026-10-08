from django.db import models


class AboutUs(models.Model):

    # =====================================================
    # MAIN ABOUT SECTION
    # =====================================================

    eyebrow = models.CharField(
        max_length=100,
        default='ABOUT OUR COMPANY'
    )

    title = models.CharField(
        max_length=200,
        default='We Build Digital Experiences That Move Businesses Forward'
    )

    story = models.TextField()

    image = models.ImageField(
        upload_to='about/',
        blank=True,
        null=True
    )


    # =====================================================
    # MISSION & VISION
    # =====================================================

    mission = models.TextField()

    vision = models.TextField()


    # =====================================================
    # COMPANY STATS
    # =====================================================

    founded_year = models.PositiveIntegerField(
        blank=True,
        null=True
    )

    projects_completed = models.PositiveIntegerField(
        default=0
    )

    happy_clients = models.PositiveIntegerField(
        default=0
    )

    years_experience = models.PositiveIntegerField(
        default=0
    )


    # =====================================================
    # WHY CHOOSE US
    # =====================================================

    why_title = models.CharField(
        max_length=200,
        default='Why Businesses Choose Us'
    )

    why_description = models.TextField(
        blank=True
    )

    why_point_1 = models.CharField(
        max_length=200,
        default='Business-focused solutions'
    )

    why_point_2 = models.CharField(
        max_length=200,
        default='Modern and scalable technology'
    )

    why_point_3 = models.CharField(
        max_length=200,
        default='Clean and user-friendly experiences'
    )

    why_point_4 = models.CharField(
        max_length=200,
        default='Reliable long-term support'
    )


    # =====================================================
    # COMPANY VALUES
    # =====================================================

    value_1_title = models.CharField(
        max_length=100,
        default='Innovation'
    )

    value_1_description = models.TextField(
        default='We continuously explore better ideas, technologies and ways of solving problems.'
    )


    value_2_title = models.CharField(
        max_length=100,
        default='Quality'
    )

    value_2_description = models.TextField(
        default='We focus on creating reliable, polished and maintainable digital products.'
    )


    value_3_title = models.CharField(
        max_length=100,
        default='Trust'
    )

    value_3_description = models.TextField(
        default='We believe strong relationships are built through transparency, communication and consistency.'
    )


    # =====================================================
    # CALL TO ACTION
    # =====================================================

    cta_title = models.CharField(
        max_length=200,
        default='Have an idea? Let’s build it together.'
    )

    cta_description = models.TextField(
        default='Tell us about your project and discover how we can turn your idea into a powerful digital experience.'
    )

    cta_button_text = models.CharField(
        max_length=100,
        default='Start a Project'
    )

    cta_button_link = models.CharField(
        max_length=300,
        default='#quote'
    )


    # =====================================================
    # STATUS
    # =====================================================

    is_active = models.BooleanField(
        default=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )


    def __str__(self):
        return self.title