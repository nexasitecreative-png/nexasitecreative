document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================
       SCROLL REVEAL
    ========================================== */

    function setupScrollAnimations() {

        const elements = document.querySelectorAll(
            "#services-container > *, " +
            "#projects-container > *, " +
            "#quote .card, " +
            "#faq-container .accordion-item"
        );

        elements.forEach(function (element, index) {

            /*
             * Don't add the class twice
             */
            if (!element.classList.contains("scroll-reveal")) {

                element.classList.add("scroll-reveal");

                /*
                 * Stagger animation
                 */
                element.style.transitionDelay =
                    (index * 100) + "ms";
            }

        });

        /*
         * Create observer
         */
        elements.forEach(function (element) {

            if (element.dataset.observed === "true") {
                return;
            }

            element.dataset.observed = "true";

            const observer =
                new IntersectionObserver(

                    function (entries) {

                        entries.forEach(function (entry) {

                            if (entry.isIntersecting) {

                                /*
                                 * Element comes
                                 * bottom -> top
                                 */
                                entry.target.classList.add("show");

                            } else {

                                /*
                                 * Remove class when
                                 * leaving viewport.
                                 *
                                 * This makes animation
                                 * happen again when
                                 * scrolling back.
                                 */
                                entry.target.classList.remove("show");

                            }

                        });

                    },

                    {
                        threshold: 0.15,

                        rootMargin:
                            "0px 0px -50px 0px"
                    }

                );

            observer.observe(element);

        });

    }


    /*
     * Run initially
     */
    setupScrollAnimations();


    /* ==========================================
       WATCH DYNAMIC CONTENT
    ========================================== */

    const servicesContainer =
        document.getElementById("services-container");

    const projectsContainer =
        document.getElementById("projects-container");

    const faqContainer =
        document.getElementById("faq-container");


    /*
     * MutationObserver watches for
     * elements inserted by fetch()
     */
    const mutationObserver =
        new MutationObserver(function () {

            setupScrollAnimations();

        });


    if (servicesContainer) {

        mutationObserver.observe(
            servicesContainer,
            {
                childList: true
            }
        );

    }


    if (projectsContainer) {

        mutationObserver.observe(
            projectsContainer,
            {
                childList: true
            }
        );

    }


    if (faqContainer) {

        mutationObserver.observe(
            faqContainer,
            {
                childList: true
            }
        );

    }


    /* ==========================================
       HERO PARALLAX
    ========================================== */

    const hero =
        document.getElementById("hero");

    const heroImage =
        document.getElementById("hero-image");


    if (
        hero &&
        heroImage &&
        window.matchMedia("(pointer: fine)").matches
    ) {

        hero.addEventListener(
            "mousemove",
            function (e) {

                const rect =
                    hero.getBoundingClientRect();

                const x =
                    (e.clientX - rect.left)
                    / rect.width;

                const y =
                    (e.clientY - rect.top)
                    / rect.height;


                const rotateX =
                    (0.5 - y) * 8;

                const rotateY =
                    (x - 0.5) * 8;


                heroImage.style.transform =
                    `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    scale(1.03)
                    `;
            }
        );


        hero.addEventListener(
            "mouseleave",
            function () {

                heroImage.style.transform =
                    `
                    perspective(1000px)
                    rotateX(0deg)
                    rotateY(0deg)
                    scale(1)
                    `;
            }
        );

    }


    /* ==========================================
       SCROLL PROGRESS
    ========================================== */

    const progress =
        document.createElement("div");

    progress.className =
        "scroll-progress";

    document.body.appendChild(progress);


    window.addEventListener(
        "scroll",
        function () {

            const scrollTop =
                window.scrollY;

            const height =
                document.documentElement.scrollHeight -
                window.innerHeight;

            const percentage =
                height > 0
                    ? (scrollTop / height) * 100
                    : 0;

            progress.style.width =
                percentage + "%";

        },
        {
            passive: true
        }
    );

});