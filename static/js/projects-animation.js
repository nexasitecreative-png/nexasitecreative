document.addEventListener("DOMContentLoaded", function () {

    console.log("Projects animation loaded");


    /* =========================================
       PROJECT CONTAINER
    ========================================= */

    const container =
        document.getElementById(
            "projects-page-container"
        );


    if (!container) {

        console.log(
            "projects-page-container not found"
        );

        return;
    }


    /* =========================================
       PREPARE PROJECT CARDS
    ========================================= */

    function prepareProjects() {

        const projects =
            container.children;


        Array.from(projects).forEach(
            function (project, index) {

                /*
                 * Don't process the same project twice
                 */
                if (
                    project.dataset.animationReady === "true"
                ) {
                    return;
                }


                project.dataset.animationReady = "true";


                /*
                 * Add animation class
                 */
                project.classList.add(
                    "projects-page-reveal"
                );


                /*
                 * Stagger effect
                 *
                 * Project 1 = 0ms
                 * Project 2 = 100ms
                 * Project 3 = 200ms
                 */
                project.style.transitionDelay =
                    (index * 100) + "ms";


                /* =====================================
                   INTERSECTION OBSERVER
                ===================================== */

                const observer =
                    new IntersectionObserver(

                        function (entries) {

                            entries.forEach(
                                function (entry) {

                                    if (
                                        entry.isIntersecting
                                    ) {

                                        /*
                                         * Bottom -> Up
                                         */
                                        entry.target.classList.add(
                                            "show"
                                        );

                                    } else {

                                        /*
                                         * Reset animation
                                         *
                                         * This is what makes
                                         * it animate again
                                         * when scrolling back.
                                         */
                                        entry.target.classList.remove(
                                            "show"
                                        );

                                    }

                                }
                            );

                        },

                        {
                            threshold: 0.15,

                            rootMargin:
                                "0px 0px -60px 0px"
                        }

                    );


                observer.observe(project);

            }
        );

    }


    /* =========================================
       INITIAL CHECK
    ========================================= */

    prepareProjects();


    /* =========================================
       WATCH DYNAMIC PROJECTS
    ========================================= */

    const mutationObserver =
        new MutationObserver(
            function () {

                prepareProjects();

            }
        );


    mutationObserver.observe(
        container,
        {
            childList: true
        }
    );


    /* =========================================
       PROJECT PAGE HEADING
    ========================================= */

    const description =
        document.querySelector(
            ".projects-page-description"
        );


    if (description) {

        const heading =
            description.closest(".text-center");


        if (heading) {

            heading.classList.add(
                "projects-page-heading"
            );


            const headingObserver =
                new IntersectionObserver(

                    function (entries) {

                        entries.forEach(
                            function (entry) {

                                if (
                                    entry.isIntersecting
                                ) {

                                    entry.target.classList.add(
                                        "show"
                                    );

                                } else {

                                    entry.target.classList.remove(
                                        "show"
                                    );

                                }

                            }
                        );

                    },

                    {
                        threshold: 0.1
                    }

                );


            headingObserver.observe(heading);

        }

    }

});