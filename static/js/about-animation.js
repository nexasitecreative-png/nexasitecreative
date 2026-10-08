document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       SCROLL REVEAL
    ========================================== */

    const elements = document.querySelectorAll(`
        .about-mission-section,
        .about-why-section,
        .about-values-section,
        .about-large-card,
        .about-value-card,
        .about-benefit,
        .about-final-cta
    `);


    elements.forEach((element) => {
        element.classList.add("about-reveal");
    });


    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("active");

                observer.unobserve(entry.target);

            });

        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -80px 0px"
        }
    );


    elements.forEach((element) => {
        observer.observe(element);
    });



    /* ==========================================
       MOUSE GLOW
    ========================================== */

    const glow = document.createElement("div");

    glow.className = "about-cursor-glow";

    document.body.appendChild(glow);


    let mouseX = 0;
    let mouseY = 0;

    let glowX = 0;
    let glowY = 0;


    document.addEventListener("mousemove", (event) => {

        mouseX = event.clientX;
        mouseY = event.clientY;

        glow.style.opacity = "1";

    });


    function animateGlow() {

        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;

        glow.style.left = `${glowX}px`;
        glow.style.top = `${glowY}px`;

        requestAnimationFrame(animateGlow);

    }

    animateGlow();



    /* ==========================================
       HERO IMAGE 3D MOUSE EFFECT
    ========================================== */

    const image =
        document.querySelector("#about-image-container");


    if (image) {

        image.addEventListener("mousemove", (event) => {

            const rect =
                image.getBoundingClientRect();


            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;


            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;


            const rotateX =
                ((y - centerY) / centerY) * -6;

            const rotateY =
                ((x - centerX) / centerX) * 6;


            image.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale(1.02)
            `;

        });


        image.addEventListener("mouseleave", () => {

            image.style.transform = `
                perspective(1000px)
                rotateX(0deg)
                rotateY(0deg)
                scale(1)
            `;

        });

    }



    /* ==========================================
       SCROLL PROGRESS
    ========================================== */

    const progress =
        document.createElement("div");

    progress.className =
        "about-scroll-progress";

    document.body.appendChild(progress);


    window.addEventListener(
        "scroll",
        () => {

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
                `${percentage}%`;

        },
        { passive: true }
    );



    /* ==========================================
       PARALLAX ORBS
    ========================================== */

    const orbOne =
        document.querySelector(".about-orb-one");

    const orbTwo =
        document.querySelector(".about-orb-two");


    window.addEventListener(
        "scroll",
        () => {

            const scroll =
                window.scrollY;


            if (orbOne) {

                orbOne.style.transform =
                    `translateY(${scroll * 0.10}px)`;

            }


            if (orbTwo) {

                orbTwo.style.transform =
                    `translateY(${scroll * -0.07}px)`;

            }

        },
        { passive: true }
    );

});