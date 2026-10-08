document.addEventListener("DOMContentLoaded", function () {

    loadProjects();

});


async function loadProjects() {

    const projectsContainer =
        document.getElementById("projects-container");


    if (!projectsContainer) {
        return;
    }


    try {

        const response =
            await fetch("/service/projectslist/");


        if (!response.ok) {

            throw new Error(
                "Failed to load projects"
            );

        }


        const data =
            await response.json();


        const projects =
            Array.isArray(data)
                ? data
                : (data.results || []);


        projectsContainer.innerHTML = "";


        if (projects.length === 0) {

            projectsContainer.innerHTML = `
                <div class="col-12">

                    <div class="alert alert-info text-center">
                        No projects available at the moment.
                    </div>

                </div>
            `;

            return;
        }


        projects.forEach(function (project) {

            let imageHTML = "";


            if (project.thumbnail) {

                imageHTML = `
                    <img
                        src="${project.thumbnail}"
                        alt="${project.title || 'Project'}"
                        class="card-img-top project-image"
                    >
                `;

            } else {

                imageHTML = `
                    <div class="project-placeholder">
                        Project
                    </div>
                `;

            }


            projectsContainer.innerHTML += `

                <div class="col-md-6 col-lg-4">

                    <div class="card project-card h-100">

                        ${imageHTML}


                        <div class="card-body">

                            <span class="badge bg-primary mb-3">
                                ${project.category || "Project"}
                            </span>


                            <h3 class="card-title h5 fw-bold">
                                ${project.title || ""}
                            </h3>


                            <p class="card-text text-muted">
                                ${project.short_description || ""}
                            </p>


                            <a
                                href="/projects/${project.slug}/"
                                class="btn btn-outline-primary"
                            >
                                View Project
                            </a>

                        </div>

                    </div>

                </div>

            `;

        });


    } catch (error) {

        console.error(
            "Error loading projects:",
            error
        );


        projectsContainer.innerHTML = `

            <div class="col-12">

                <div class="alert alert-danger text-center">
                    Unable to load projects.
                </div>

            </div>

        `;

    }

}