document.addEventListener("DOMContentLoaded", function () {

    const navbar = document.querySelector(".custom-navbar");

    if (!navbar) {
        return;
    }


    function updateNavbar() {

        if (window.scrollY > 30) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    }


    window.addEventListener(
        "scroll",
        updateNavbar,
        { passive: true }
    );


    updateNavbar();


    /*
    =========================================
    ACTIVE NAVIGATION LINK
    =========================================
    */

    const currentPath =
        window.location.pathname.replace(/\/$/, "") || "/";

    const navLinks =
        navbar.querySelectorAll(".nav-link");


    navLinks.forEach(function (link) {

        const linkPath =
            new URL(link.href, window.location.origin)
                .pathname
                .replace(/\/$/, "") || "/";


        if (linkPath === currentPath) {

            link.classList.add("active");

        }

    });

});