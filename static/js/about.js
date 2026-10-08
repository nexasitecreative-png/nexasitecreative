document.addEventListener('DOMContentLoaded', function () {

    // =====================================================
    // MAIN ELEMENTS
    // =====================================================

    const loading =
        document.getElementById('about-loading');

    const error =
        document.getElementById('about-error');

    const content =
        document.getElementById('about-content');


    // =====================================================
    // MAIN ABOUT
    // =====================================================

    const eyebrow =
        document.getElementById('about-eyebrow');

    const title =
        document.getElementById('about-title');

    const story =
        document.getElementById('about-story');


    // =====================================================
    // IMAGE
    // =====================================================

    const image =
        document.getElementById('about-image');

    const imageContainer =
        document.getElementById(
            'about-image-container'
        );


    // =====================================================
    // MISSION / VISION
    // =====================================================

    const mission =
        document.getElementById('about-mission');

    const vision =
        document.getElementById('about-vision');


    // =====================================================
    // STATS
    // =====================================================

    const foundedYear =
        document.getElementById('founded-year');

    const projectsCompleted =
        document.getElementById(
            'projects-completed'
        );

    const happyClients =
        document.getElementById(
            'happy-clients'
        );

    const yearsExperience =
        document.getElementById(
            'years-experience'
        );


    // =====================================================
    // WHY CHOOSE US
    // =====================================================

    const whyTitle =
        document.getElementById('why-title');

    const whyDescription =
        document.getElementById(
            'why-description'
        );

    const whyPoint1 =
        document.getElementById('why-point-1');

    const whyPoint2 =
        document.getElementById('why-point-2');

    const whyPoint3 =
        document.getElementById('why-point-3');

    const whyPoint4 =
        document.getElementById('why-point-4');


    // =====================================================
    // VALUES
    // =====================================================

    const value1Title =
        document.getElementById(
            'value-1-title'
        );

    const value1Description =
        document.getElementById(
            'value-1-description'
        );


    const value2Title =
        document.getElementById(
            'value-2-title'
        );

    const value2Description =
        document.getElementById(
            'value-2-description'
        );


    const value3Title =
        document.getElementById(
            'value-3-title'
        );

    const value3Description =
        document.getElementById(
            'value-3-description'
        );


    // =====================================================
    // CTA
    // =====================================================

    const ctaTitle =
        document.getElementById('cta-title');

    const ctaDescription =
        document.getElementById(
            'cta-description'
        );

    const ctaButton =
        document.getElementById('cta-button');


    // =====================================================
    // CHECK
    // =====================================================

    if (!loading || !content) {

        console.error(
            'About page elements not found.'
        );

        return;
    }


    // =====================================================
    // FETCH ABOUT API
    // =====================================================

    fetch('/service/about/')

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    'Failed to load About Us.'
                );

            }

            return response.json();

        })


        // =================================================
        // API DATA
        // =================================================

        .then(function (data) {

            console.log(
                'About API:',
                data
            );


            // =============================================
            // MAIN ABOUT
            // =============================================

            if (eyebrow) {

                eyebrow.textContent =
                    data.eyebrow ||
                    'ABOUT OUR COMPANY';

            }


            if (title) {

                title.textContent =
                    data.title || '';

            }


            if (story) {

                story.textContent =
                    data.story || '';

            }


            // =============================================
            // IMAGE
            // =============================================

            if (data.image) {

                image.src =
                    data.image;

                image.alt =
                    data.title ||
                    'About Our Company';

            }

            else {

                imageContainer.innerHTML = `
                    <div class="about-image-placeholder">

                        <i class="bi bi-building"></i>

                        <p>
                            About Our Company
                        </p>

                    </div>
                `;

            }


            // =============================================
            // MISSION
            // =============================================

            if (mission) {

                mission.textContent =
                    data.mission || '';

            }


            // =============================================
            // VISION
            // =============================================

            if (vision) {

                vision.textContent =
                    data.vision || '';

            }


            // =============================================
            // STATISTICS
            // =============================================

            if (foundedYear) {

                foundedYear.textContent =
                    data.founded_year || '';

            }


            if (projectsCompleted) {

                projectsCompleted.textContent =
                    data.projects_completed || '0';

            }


            if (happyClients) {

                happyClients.textContent =
                    data.happy_clients || '0';

            }


            if (yearsExperience) {

                yearsExperience.textContent =
                    data.years_experience || '0';

            }


            // =============================================
            // WHY CHOOSE US
            // =============================================

            if (whyTitle) {

                whyTitle.textContent =
                    data.why_title || '';

            }


            if (whyDescription) {

                whyDescription.textContent =
                    data.why_description || '';

            }


            if (whyPoint1) {

                whyPoint1.textContent =
                    data.why_point_1 || '';

            }


            if (whyPoint2) {

                whyPoint2.textContent =
                    data.why_point_2 || '';

            }


            if (whyPoint3) {

                whyPoint3.textContent =
                    data.why_point_3 || '';

            }


            if (whyPoint4) {

                whyPoint4.textContent =
                    data.why_point_4 || '';

            }


            // =============================================
            // VALUE 1
            // =============================================

            if (value1Title) {

                value1Title.textContent =
                    data.value_1_title || '';

            }


            if (value1Description) {

                value1Description.textContent =
                    data.value_1_description || '';

            }


            // =============================================
            // VALUE 2
            // =============================================

            if (value2Title) {

                value2Title.textContent =
                    data.value_2_title || '';

            }


            if (value2Description) {

                value2Description.textContent =
                    data.value_2_description || '';

            }


            // =============================================
            // VALUE 3
            // =============================================

            if (value3Title) {

                value3Title.textContent =
                    data.value_3_title || '';

            }


            if (value3Description) {

                value3Description.textContent =
                    data.value_3_description || '';

            }


            // =============================================
            // CTA
            // =============================================

            if (ctaTitle) {

                ctaTitle.textContent =
                    data.cta_title ||
                    'Have an idea? Let’s build it together.';

            }


            if (ctaDescription) {

                ctaDescription.textContent =
                    data.cta_description || '';

            }


            if (ctaButton) {

                ctaButton.textContent =
                    data.cta_button_text ||
                    'Start a Project';


                ctaButton.href =
                    data.cta_button_link ||
                    '#quote';

            }


            // =============================================
            // SHOW PAGE
            // =============================================

            loading.classList.add('d-none');

            content.classList.remove('d-none');


            // =============================================
            // OPTIONAL AOS REFRESH
            // =============================================

            if (
                typeof AOS !== 'undefined'
            ) {

                AOS.refresh();

            }

        })


        // =================================================
        // ERROR
        // =================================================

        .catch(function (err) {

            console.error(
                'About error:',
                err
            );


            loading.classList.add('d-none');

            error.classList.remove('d-none');

        });

});