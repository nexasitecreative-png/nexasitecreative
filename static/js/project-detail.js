document.addEventListener("DOMContentLoaded", function () {

    loadProject();

});


async function loadProject() {

    

    const content = document.getElementById(
        "project-content"
    );

    const error = document.getElementById(
        "project-error"
    );


    if (!content || !error) {

        console.error(
            "Project detail elements are missing."
        );

        return;

    }


    // Get slug from URL

    const pathParts = window.location.pathname
        .split("/")
        .filter(Boolean);

    const slug = pathParts[pathParts.length - 1];


    if (!slug) {

        

        error.classList.remove("d-none");

        return;

    }


    try {

        const response = await fetch(
            `/service/projects/${slug}/`
        );


        if (!response.ok) {

            throw new Error(
                "Project not found"
            );

        }


        const project = await response.json();


        // Title

        const titleElement =
            document.getElementById(
                "project-title"
            );

        if (titleElement) {

            titleElement.textContent =
                project.title || "Project";

        }


        // Category

        const categoryElement =
            document.getElementById(
                "project-category"
            );

        if (categoryElement) {

            categoryElement.textContent =
                project.category || "Project";

        }


        // Short description

        const shortDescriptionElement =
            document.getElementById(
                "project-short-description"
            );

        if (shortDescriptionElement) {

            shortDescriptionElement.textContent =
                project.short_description || "";

        }


        // Full description

        const fullDescriptionElement =
            document.getElementById(
                "project-full-description"
            );

        if (fullDescriptionElement) {

            fullDescriptionElement.textContent =
                project.full_description || "";

        }


        // Technology

        const techStackElement =
            document.getElementById(
                "project-tech-stack"
            );

        if (techStackElement) {

            techStackElement.textContent =
                project.tech_stack ||
                "Not specified";

        }


        // Client

        const clientElement =
            document.getElementById(
                "project-client"
            );


        if (clientElement) {

            if (project.client_name) {

                clientElement.textContent =
                    `Client: ${project.client_name}`;

            } else {

                clientElement.style.display =
                    "none";

            }

        }


        // Thumbnail

        const thumbnail =
            document.getElementById(
                "project-thumbnail"
            );


        if (thumbnail) {

            if (project.thumbnail) {

                thumbnail.src =
                    project.thumbnail;

                thumbnail.alt =
                    project.title ||
                    "Project";

            } else {

                thumbnail.style.display =
                    "none";

            }

        }


        // Live website

        const liveUrl =
            document.getElementById(
                "project-live-url"
            );


        if (liveUrl) {

            if (project.live_url) {

                liveUrl.href =
                    project.live_url;

                liveUrl.target =
                    "_blank";

                liveUrl.rel =
                    "noopener noreferrer";

            } else {

                liveUrl.style.display =
                    "none";

            }

        }


        // Show content

        

        content.classList.remove("d-none");


    } catch (err) {

        console.error(
            "Project detail error:",
            err
        );


        

        content.classList.add("d-none");

        error.classList.remove("d-none");

    }

}