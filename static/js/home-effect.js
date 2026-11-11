
document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    document.body.classList.add("motion-ready");

    /* ==========================================
       1. HERO FLOATING ORBS
    ========================================== */

    const hero = document.getElementById("hero");

    if (hero && !reducedMotion) {

        const orbClasses = [
            "nx-orb-one",
            "nx-orb-two",
            "nx-orb-three"
        ];

        orbClasses.forEach(function (className) {

            const orb = document.createElement("span");

            orb.className = "nx-orb " + className;

            orb.setAttribute("aria-hidden", "true");

            hero.appendChild(orb);

        });

    }


    /* ==========================================
       2. SCROLL PROGRESS
    ========================================== */

    const progress = document.createElement("div");

    progress.className = "scroll-progress";

    progress.setAttribute("aria-hidden", "true");

    document.body.appendChild(progress);

    let scrollScheduled = false;

    function updateScrollProgress() {

        const scrollTop = window.scrollY;

        const totalHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const percentage = totalHeight > 0
            ? (scrollTop / totalHeight) * 100
            : 0;

        progress.style.width = percentage + "%";

        scrollScheduled = false;

    }

    window.addEventListener("scroll", function () {

        if (!scrollScheduled) {

            window.requestAnimationFrame(
                updateScrollProgress
            );

            scrollScheduled = true;

        }

    }, { passive: true });


    /* ==========================================
       3. SCROLL REVEAL SYSTEM
    ========================================== */

    const revealSelectors = [
        "#services-container > *",
        "#projects-container > *",
        "#quote .card",
        "#faq-container .accordion-item"
    ].join(",");

    let revealObserver = null;

    if ("IntersectionObserver" in window && !reducedMotion) {

        revealObserver = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("show");

                        // Animate only once.
                        revealObserver.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -45px 0px"
            }
        );

    }

    function setupScrollAnimations() {

        const elements = document.querySelectorAll(
            revealSelectors
        );

        elements.forEach(function (element, index) {

            if (element.dataset.nxRevealed === "true") {
                return;
            }

            element.dataset.nxRevealed = "true";

            element.classList.add("scroll-reveal");

            element.style.transitionDelay =
                Math.min(index % 4, 3) * 100 + "ms";

            if (reducedMotion || !revealObserver) {

                element.classList.add("show");

            } else {

                revealObserver.observe(element);

            }

        });

    }

    setupScrollAnimations();


    /* ==========================================
       4. WATCH DYNAMIC CONTENT
    ========================================== */

    const dynamicContainers = [
        document.getElementById("services-container"),
        document.getElementById("projects-container"),
        document.getElementById("faq-container")
    ].filter(Boolean);

    let mutationScheduled = false;

    const mutationObserver = new MutationObserver(
        function () {

            if (mutationScheduled) {
                return;
            }

            mutationScheduled = true;

            requestAnimationFrame(function () {

                setupScrollAnimations();

                mutationScheduled = false;

            });

        }
    );

    dynamicContainers.forEach(function (container) {

        mutationObserver.observe(container, {
            childList: true,
            subtree: true
        });

    });


    /* ==========================================
       5. HERO 3D MOUSE MOVEMENT
    ========================================== */

    const heroImageContainer = document.getElementById(
        "hero-image-container"
    );

    if (
        hero &&
        heroImageContainer &&
        finePointer &&
        !reducedMotion
    ) {

        hero.addEventListener("mousemove", function (event) {

            const rect = hero.getBoundingClientRect();

            const x = (
                (event.clientX - rect.left) / rect.width
            ) - 0.5;

            const y = (
                (event.clientY - rect.top) / rect.height
            ) - 0.5;

            const rotateX = -y * 12;

            const rotateY = x * 12;

            heroImageContainer.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-5px)
            `;

        });

        hero.addEventListener("mouseleave", function () {

            heroImageContainer.style.transform =
                "perspective(1000px) rotateX(0deg) rotateY(0deg)";

        });

    }


    /* ==========================================
       6. 3D SERVICE AND PROJECT CARDS
    ========================================== */

    if (finePointer && !reducedMotion) {

        function addTiltEffect(element) {

            if (element.dataset.nxTilt === "true") {
                return;
            }

            element.dataset.nxTilt = "true";

            element.addEventListener("pointermove", function (event) {

                const rect = element.getBoundingClientRect();

                const x = (
                    (event.clientX - rect.left) / rect.width
                ) - 0.5;

                const y = (
                    (event.clientY - rect.top) / rect.height
                ) - 0.5;

                element.style.setProperty(
                    "--nx-tilt-x",
                    (-y * 5) + "deg"
                );

                element.style.setProperty(
                    "--nx-tilt-y",
                    (x * 5) + "deg"
                );

            });

            element.addEventListener("pointerleave", function () {

                element.style.setProperty(
                    "--nx-tilt-x",
                    "0deg"
                );

                element.style.setProperty(
                    "--nx-tilt-y",
                    "0deg"
                );

            });

        }

        function setupTiltCards() {

            const cards = document.querySelectorAll(
                ".service-card, #projects-container .card"
            );

            cards.forEach(addTiltEffect);

        }

        setupTiltCards();

        const cardObserver = new MutationObserver(
            setupTiltCards
        );

        dynamicContainers.forEach(function (container) {

            cardObserver.observe(container, {
                childList: true,
                subtree: true
            });

        });

    }


    /* ==========================================
       7. CUSTOM CURSOR LIGHT
    ========================================== */

    if (finePointer && !reducedMotion) {

        const cursorGlow = document.createElement("div");

        cursorGlow.className = "nx-cursor-glow";

        cursorGlow.setAttribute("aria-hidden", "true");

        document.body.appendChild(cursorGlow);

        let cursorFrame = null;

        document.addEventListener("pointermove", function (event) {

            if (cursorFrame) {
                cancelAnimationFrame(cursorFrame);
            }

            cursorFrame = requestAnimationFrame(function () {

                cursorGlow.style.left = event.clientX + "px";

                cursorGlow.style.top = event.clientY + "px";

                cursorGlow.classList.add("active");

                cursorFrame = null;

            });

        }, { passive: true });

        document.addEventListener("pointerleave", function () {

            cursorGlow.classList.remove("active");

        });

    }


    /* ==========================================
       8. MAGNETIC HERO BUTTON
    ========================================== */

    const heroButton = document.getElementById("hero-button");

    if (
        heroButton &&
        finePointer &&
        !reducedMotion
    ) {

        heroButton.addEventListener("pointermove", function (event) {

            const rect = heroButton.getBoundingClientRect();

            const x = event.clientX - rect.left - rect.width / 2;

            const y = event.clientY - rect.top - rect.height / 2;

            heroButton.style.transform = `
                translate(${x * 0.10}px, ${y * 0.15}px)
            `;

        });

        heroButton.addEventListener("pointerleave", function () {

            heroButton.style.transform = "";

        });

    }


    /* ==========================================
       9. SMOOTH INTERNAL NAVIGATION
    ========================================== */

    document.querySelectorAll('a[href^="#"]').forEach(
        function (link) {

            link.addEventListener("click", function (event) {

                const targetId = link.getAttribute("href");

                if (!targetId || targetId === "#") {
                    return;
                }

                const target = document.querySelector(targetId);

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: reducedMotion ? "auto" : "smooth",
                    block: "start"
                });

            });

        }
    );


    /* ==========================================
       10. INITIALIZE AOS IF AVAILABLE
    ========================================== */

    if (typeof AOS !== "undefined") {

        AOS.refreshHard();

    }


    console.log(
        "Nexa Site Creative: Advanced motion system initialized."
    );

});
