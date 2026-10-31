document.addEventListener("DOMContentLoaded", function () {

    loadService();

});


async function loadService() {

    const loading =
        document.getElementById("service-loading");

    const content =
        document.getElementById("service-content");

    const error =
        document.getElementById("service-error");


    /*
     * Get slug from current URL
     *
     * Example:
     *
     * /services/web-development/
     *
     * slug = web-development
     */

    const pathParts =
        window.location.pathname
            .split("/")
            .filter(Boolean);

    const slug =
        pathParts[pathParts.length - 1];


    if (!slug) {

        showServiceError(
            loading,
            content,
            error
        );

        return;

    }


    try {

        /*
         * Get service from your existing API
         */

        const response =
            await fetch(
                `/service/services/${encodeURIComponent(slug)}/`
            );


        if (!response.ok) {

            throw new Error(
                "Service not found"
            );

        }


        const service =
            await response.json();


        /*
         * Check that API returned data
         */

        if (
            !service ||
            !service.title
        ) {

            throw new Error(
                "Invalid service data"
            );

        }


        /*
         * TITLE
         */

        const title =
            document.getElementById(
                "service-title"
            );

        if (title) {

            title.textContent =
                service.title;

        }


        /*
         * SHORT DESCRIPTION
         */

        const shortDescription =
            document.getElementById(
                "service-short-description"
            );

        if (shortDescription) {

            shortDescription.textContent =
                service.short_description || "";

        }


        /*
         * FULL DESCRIPTION
         */

        const fullDescription =
            document.getElementById(
                "service-full-description"
            );

        if (fullDescription) {

            fullDescription.textContent =
                service.full_description || "";

        }


        /*
         * IMAGE
         */

        const image =
            document.getElementById(
                "service-image"
            );


        if (image) {

            if (service.image) {

                image.src =
                    service.image;

                image.alt =
                    service.title;

                image.style.display =
                    "block";

            } else {

                image.style.display =
                    "none";

            }

        }


        /*
         * SERVICE ICON
         *
         * Your model already has:
         *
         * icon = models.CharField(...)
         *
         * So if admin contains:
         *
         * bi bi-code-slash
         *
         * it will use that icon.
         */

        const serviceIcon =
            document.getElementById(
                "service-icon"
            );


        if (serviceIcon) {

            if (service.icon) {

                serviceIcon.className =
                    service.icon;

            } else {

                serviceIcon.className =
                    "bi bi-stars";

            }

        }


        /*
         * WHATSAPP MESSAGE
         */

        const message =
            `Hi, I am interested in the ${service.title} service. ` +
            `Could you please share more details?`;


        const whatsappURL =
            `https://wa.me/919908318360?text=${encodeURIComponent(message)}`;


        /*
         * Main WhatsApp button
         */

        const whatsappButton =
            document.getElementById(
                "whatsapp-service-button"
            );


        if (whatsappButton) {

            whatsappButton.href =
                whatsappURL;

        }


        /*
         * Bottom WhatsApp button
         */

        const bottomButton =
            document.getElementById(
                "whatsapp-bottom-button"
            );


        if (bottomButton) {

            bottomButton.href =
                whatsappURL;

        }


        /*
         * Floating WhatsApp
         */

        const floatingWhatsApp =
            document.getElementById(
                "floating-whatsapp"
            );


        if (floatingWhatsApp) {

            floatingWhatsApp.href =
                whatsappURL;

        }


        /*
         * Hide loading
         */

        loading.classList.add(
            "d-none"
        );


        /*
         * Show page
         */

        content.classList.remove(
            "d-none"
        );


        /*
         * Start animations
         */

        startRevealAnimations();


        /*
         * Floating WhatsApp
         */

        setupFloatingWhatsApp();


    } catch (err) {

        console.error(
            "Service loading error:",
            err
        );


        showServiceError(
            loading,
            content,
            error
        );

    }

}


/*
=========================================================
SHOW ERROR
=========================================================
*/

function showServiceError(
    loading,
    content,
    error
) {

    if (loading) {

        loading.classList.add(
            "d-none"
        );

    }


    if (content) {

        content.classList.add(
            "d-none"
        );

    }


    if (error) {

        error.classList.remove(
            "d-none"
        );

    }

}


/*
=========================================================
SCROLL REVEAL ANIMATIONS
=========================================================
*/

function startRevealAnimations() {

    const elements =
        document.querySelectorAll(
            ".reveal-left, " +
            ".reveal-right, " +
            ".reveal-up"
        );


    if (!elements.length) {

        return;

    }


    /*
     * Browser does not support
     * IntersectionObserver
     */

    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(
            function (element) {

                element.classList.add(
                    "visible"
                );

            }
        );

        return;

    }


    const observer =
        new IntersectionObserver(

            function (
                entries,
                observerInstance
            ) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );


                            observerInstance.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },

            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -40px 0px"
            }

        );


    elements.forEach(
        function (element) {

            observer.observe(
                element
            );

        }
    );

}


/*
=========================================================
FLOATING WHATSAPP
=========================================================
*/

function setupFloatingWhatsApp() {

    const button =
        document.getElementById(
            "floating-whatsapp"
        );


    if (!button) {

        return;

    }


    /*
     * Show floating button
     * after user scrolls a little.
     */

    function updateButton() {

        if (
            window.scrollY > 300
        ) {

            button.classList.add(
                "visible"
            );

        } else {

            button.classList.remove(
                "visible"
            );

        }

    }


    window.addEventListener(
        "scroll",
        updateButton,
        {
            passive: true
        }
    );


    updateButton();

}
/* =========================================
   ADVANCED SCROLL REVEAL + CENTER FOCUS
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const animatedCards = document.querySelectorAll(
        ".benefit-card, .process-item"
    );

    const revealElements = document.querySelectorAll(
        ".benefits-header, .benefit-card, .process-item"
    );

    if (!revealElements.length) {
        console.warn("No service detail animation elements found.");
        return;
    }

    /* 1. Reveal on both downward and upward scrolling */
    const revealObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                } else {
                    // Remove this class so the animation can replay
                    // when the visitor scrolls back to the element.
                    entry.target.classList.remove("is-visible");
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealElements.forEach(function (element, index) {
        element.classList.add("scroll-reveal");

        // Small stagger between cards
        if (
            element.classList.contains("benefit-card") ||
            element.classList.contains("process-item")
        ) {
            element.style.transitionDelay =
                (index % 3) * 500 + "ms";
        }

        revealObserver.observe(element);
    });

    /* 2. Highlight the card closest to the viewport center */
    let centerFrame = null;

    function updateCenterFocus() {
        centerFrame = null;

        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;

        const visibleCards = [];

        animatedCards.forEach(function (card) {
            const rect = card.getBoundingClientRect();

            // Ignore cards outside the visible viewport
            if (
                rect.bottom <= 0 ||
                rect.top >= window.innerHeight ||
                rect.right <= 0 ||
                rect.left >= window.innerWidth
            ) {
                card.classList.remove(
                    "is-center-card",
                    "is-side-card"
                );
                return;
            }

            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;

            const distance = Math.hypot(
                viewportCenterX - cardCenterX,
                viewportCenterY - cardCenterY
            );

            visibleCards.push({
                card: card,
                distance: distance
            });
        });

        // Remove old focus states
        animatedCards.forEach(function (card) {
            card.classList.remove(
                "is-center-card",
                "is-side-card"
            );
        });

        if (!visibleCards.length) {
            return;
        }

        visibleCards.sort(function (a, b) {
            return a.distance - b.distance;
        });

        // Closest visible card receives the center effect
        visibleCards[0].card.classList.add("is-center-card");

        visibleCards.slice(1).forEach(function (item) {
            item.card.classList.add("is-side-card");
        });
    }

    function requestCenterUpdate() {
        if (centerFrame !== null) {
            return;
        }

        centerFrame = requestAnimationFrame(updateCenterFocus);
    }

    window.addEventListener("scroll", requestCenterUpdate, {
        passive: true
    });

    window.addEventListener("resize", requestCenterUpdate);

    // Initial position
    requestCenterUpdate();
});
