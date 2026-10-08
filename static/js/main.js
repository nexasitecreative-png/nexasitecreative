document.addEventListener('DOMContentLoaded', function () {

    // AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 80
        });
    }

    // SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener('click', function (event) {

            const targetId = this.getAttribute('href');

            if (!targetId || targetId === '#') {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        });

    });

    // NAVBAR - CLOSE MOBILE MENU
    const navbar = document.getElementById('mainNavbar');

    if (navbar) {

        const navLinks =
            navbar.querySelectorAll('.nav-link, .btn');

        navLinks.forEach(function (link) {

            link.addEventListener('click', function () {

                if (window.innerWidth < 992) {

                    const collapse =
                        bootstrap.Collapse.getInstance(navbar);

                    if (collapse) {
                        collapse.hide();
                    }

                }

            });

        });

    }

});