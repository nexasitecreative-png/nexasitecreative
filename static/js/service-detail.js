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
            `https://wa.me/916304668991?text=${encodeURIComponent(message)}`;


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