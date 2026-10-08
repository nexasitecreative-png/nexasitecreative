document.addEventListener("DOMContentLoaded", function () {

    console.log("Services carousel animation loaded");


    /* =========================================
       SERVICE CONTAINER
    ========================================= */

    const container =
        document.getElementById("services-container");


    if (!container) {

        console.log(
            "services-container not found"
        );

        return;
    }


    let isPaused = false;

    let lastTime = 0;

    const speed = 0.45;


    /* =========================================
       PREPARE SERVICE CARDS
    ========================================= */

    function prepareCards() {

        const cards =
            container.querySelectorAll(
                ".service-carousel-item"
            );


        if (!cards.length) {
            return;
        }


        cards.forEach(function (card) {

            card.classList.add(
                "service-carousel-card"
            );

        });


        updateCenterCard();

    }


    /* =========================================
       FIND CENTER CARD
    ========================================= */

    function updateCenterCard() {

        const cards =
            container.querySelectorAll(
                ".service-carousel-item"
            );


        if (!cards.length) {
            return;
        }


        const containerRect =
            container.getBoundingClientRect();


        const containerCenter =
            containerRect.left +
            (containerRect.width / 2);


        cards.forEach(function (card) {

            const cardRect =
                card.getBoundingClientRect();


            const cardCenter =
                cardRect.left +
                (cardRect.width / 2);


            const distance =
                Math.abs(
                    containerCenter -
                    cardCenter
                );


            /*
             * Remove previous states
             */

            card.classList.remove(
                "service-center",
                "service-near",
                "service-far"
            );


            /*
             * CENTER
             */

            if (distance < 120) {

                card.classList.add(
                    "service-center"
                );

            }


            /*
             * NEAR CENTER
             */

            else if (distance < 300) {

                card.classList.add(
                    "service-near"
                );

            }


            /*
             * FAR
             */

            else {

                card.classList.add(
                    "service-far"
                );

            }

        });

    }


    /* =========================================
       AUTO SCROLL
    ========================================= */

    function animateCarousel(timestamp) {

        if (!lastTime) {

            lastTime = timestamp;

        }


        const delta =
            timestamp - lastTime;


        if (!isPaused) {

            container.scrollLeft +=
                speed * (delta / 16);


            /*
             * Infinite scrolling
             */

            if (
                container.scrollLeft +
                container.clientWidth >=
                container.scrollWidth - 5
            ) {

                container.scrollLeft = 0;

            }

        }


        lastTime = timestamp;


        updateCenterCard();


        requestAnimationFrame(
            animateCarousel
        );

    }


    /* =========================================
       MOUSE HOVER
    ========================================= */

    container.addEventListener(
        "mouseenter",
        function () {

            isPaused = true;

        }
    );


    container.addEventListener(
        "mouseleave",
        function () {

            isPaused = false;

        }
    );


    /* =========================================
       TOUCH SUPPORT
    ========================================= */

    container.addEventListener(
        "touchstart",
        function () {

            isPaused = true;

        },
        {
            passive: true
        }
    );


    container.addEventListener(
        "touchend",
        function () {

            setTimeout(
                function () {

                    isPaused = false;

                },
                1000
            );

        },
        {
            passive: true
        }
    );


    /* =========================================
       RESIZE
    ========================================= */

    window.addEventListener(
        "resize",
        function () {

            updateCenterCard();

        }
    );


    /* =========================================
       WATCH DYNAMICALLY LOADED SERVICES
    ========================================= */

    const mutationObserver =
        new MutationObserver(
            function () {

                prepareCards();

            }
        );


    mutationObserver.observe(
        container,
        {
            childList: true
        }
    );


    /* =========================================
       INITIAL CHECK
    ========================================= */

    setTimeout(
        function () {

            prepareCards();

            requestAnimationFrame(
                animateCarousel
            );

        },
        500
    );

});