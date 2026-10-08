document.addEventListener('DOMContentLoaded', function () {

    const loading = document.getElementById('hero-loading');
    const content = document.getElementById('hero-content');
    const error = document.getElementById('hero-error');

    const badge = document.getElementById('hero-badge');
    const title = document.getElementById('hero-title');
    const description = document.getElementById('hero-description');

    const button = document.getElementById('hero-button');

    const image = document.getElementById('hero-image');
    const imageContainer = document.getElementById(
        'hero-image-container'
    );


    // =========================================
    // Check required elements
    // =========================================

    if (!loading || !content || !title) {
        console.error('Hero elements not found.');
        return;
    }


    // =========================================
    // WORD-BY-WORD TITLE ANIMATION
    // =========================================

    function animateHeroTitle(text) {

        title.innerHTML = '';

        if (!text) {
            return;
        }

        const words = text.trim().split(/\s+/);

        words.forEach(function (word, index) {

            const span = document.createElement('span');

            span.className = 'hero-word';

            span.textContent = word;

            span.style.animationDelay =
                (index * 0.10) + 's';

            title.appendChild(span);


            // Add space between words
            if (index < words.length - 1) {

                title.appendChild(
                    document.createTextNode(' ')
                );

            }

        });

    }


    // =========================================
    // LOAD HERO FROM API
    // =========================================

    fetch('/hero/')

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    'Failed to load hero content.'
                );

            }

            return response.json();

        })

        .then(function (data) {

            // =========================================
            // BADGE
            // =========================================

            badge.textContent =
                data.badge_text || '';


            // =========================================
            // HERO TITLES
            // =========================================

            const heroTitles = [

                data.title,
                data.title_2,
                data.title_3

            ].filter(function (item) {

                return (
                    item &&
                    item.trim() !== ''
                );

            });


            let currentTitle = 0;


            // =========================================
            // SHOW FIRST TITLE
            // =========================================

            if (heroTitles.length > 0) {

                animateHeroTitle(
                    heroTitles[0]
                );

            }


            // =========================================
            // CHANGE TITLE EVERY 3 SECONDS
            // =========================================

            if (heroTitles.length > 1) {

                setInterval(function () {

                    currentTitle =
                        (currentTitle + 1)
                        % heroTitles.length;


                    animateHeroTitle(
                        heroTitles[currentTitle]
                    );

                }, 3000);

            }


            // =========================================
            // DESCRIPTION
            // =========================================

            description.textContent =
                data.description || '';


            // =========================================
            // BUTTON
            // =========================================

            button.textContent =
                data.button_text ||
                'Get Started';


            button.href =
                data.button_link ||
                '#quote';


            // =========================================
            // IMAGE
            // =========================================

            if (data.image) {

                image.src = data.image;

                image.alt =
                    data.title ||
                    'Company Hero Image';

            }

            else {

                imageContainer.innerHTML = `
                    <div class="bg-light rounded shadow p-5 text-center">

                        <i class="bi bi-laptop fs-1 text-primary"></i>

                        <p class="mt-3 mb-0 text-muted">
                            Digital Solutions
                        </p>

                    </div>
                `;

            }


            // =========================================
            // SHOW HERO CONTENT
            // =========================================

            loading.classList.add('d-none');

            content.classList.remove('d-none');

        })


        // =========================================
        // ERROR
        // =========================================

        .catch(function (err) {

            console.error(
                'Hero error:',
                err
            );

            loading.classList.add('d-none');

            error.classList.remove('d-none');

        });

});