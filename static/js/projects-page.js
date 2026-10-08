document.addEventListener("DOMContentLoaded", function () {

    loadProjects();

});


async function loadProjects() {

    const container =
        document.getElementById(
            "projects-page-container"
        );


    if (!container) {
        return;
    }


    try {

        const response =
            await fetch("/service/projectslist/");


        if (!response.ok) {

            throw new Error(
                "Failed to load projects."
            );

        }


        const data =
            await response.json();


        const projects =
            Array.isArray(data)
                ? data
                : (data.results || []);


        container.innerHTML = "";


        if (projects.length === 0) {

            container.innerHTML = `
                <div class="col-12 text-center py-5">

                    <p class="text-muted">
                        No projects available at the moment.
                    </p>

                </div>
            `;

            return;
        }


        projects.forEach(function (project) {

            let imageHTML = "";


            if (project.thumbnail) {

                imageHTML = `
                    <div class="project-card-image">

                        <img
                            src="${project.thumbnail}"
                            alt="${project.title || 'Project'}"
                        >

                    </div>
                `;

            } else {

                imageHTML = `
                    <div
                        class="project-card-image
                        project-card-placeholder
                        d-flex
                        align-items-center
                        justify-content-center"
                    >

                        <i class="bi bi-folder2-open"></i>

                    </div>
                `;

            }


            const projectCard = `

                <div class="col-md-6 col-lg-4">

                    <div
                        class="card project-card
                        h-100 border-0 shadow-sm"
                    >

                        ${imageHTML}


                        <div class="card-body p-4">

                            ${
                                project.category
                                ? `
                                    <span
                                        class="badge
                                        bg-primary mb-2"
                                    >
                                        ${project.category}
                                    </span>
                                `
                                : ""
                            }


                            <h4
                                class="project-card-title
                                fw-bold"
                            >
                                ${project.title || ""}
                            </h4>


                            <p class="text-muted">

                                ${project.short_description || ""}

                            </p>


                            <a
                                href="/projects/${project.slug}/"
                                class="btn btn-outline-primary
                                project-view-button"
                            >

                                View Project

                                <i
                                    class="bi bi-arrow-right ms-2"
                                ></i>

                            </a>

                        </div>

                    </div>

                </div>

            `;


            container.innerHTML += projectCard;

        });


    } catch (error) {

        console.error(
            "Projects page error:",
            error
        );


        container.innerHTML = `

            <div class="col-12 text-center py-5">

                <p class="text-muted">
                    Projects are currently unavailable.
                </p>

            </div>

        `;

    }

}