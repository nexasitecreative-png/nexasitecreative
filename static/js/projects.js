
document.addEventListener("DOMContentLoaded", function () {
    loadProjects();
});

async function loadProjects() {

    const container = document.getElementById("projects-container");

    if (!container) return;

    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-3 text-muted">Discovering our latest work...</p>
        </div>
    `;

    try {

        const response = await fetch("/service/projectslist/");

        if (!response.ok) {
            throw new Error("Failed to load projects");
        }

        const data = await response.json();

        const projects = Array.isArray(data)
            ? data
            : (data.results || []);

        container.innerHTML = "";

        if (!projects.length) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="nx-project-empty">
                        <i class="bi bi-folder2-open"></i>
                        <h4>No projects yet</h4>
                        <p>Our latest work will appear here soon.</p>
                    </div>
                </div>
            `;
            return;
        }

        // Build project gallery
        projects.forEach(function (project, index) {

            const column = document.createElement("div");

            column.className = "col-md-6 col-lg-4 nx-project-column";

            column.dataset.category = project.category || "Project";
            column.dataset.index = index;

            const image = project.thumbnail || "";

            const safeImage = escapeProjectHTML(image);
            const safeTitle = escapeProjectHTML(project.title || "Untitled Project");
            const safeCategory = escapeProjectHTML(project.category || "Project");
            const safeDescription = escapeProjectHTML(
                project.short_description || "Discover our creative work."
            );

            const detailURL = "/projects/" +
                encodeURIComponent(project.slug || "") + "/";

            const imageContent = image
                ? `
                    <img
                        src="${safeImage}"
                        alt="${safeTitle}"
                        class="nx-project-image"
                        loading="lazy"
                    >
                `
                : `
                    <div class="nx-project-placeholder">
                        <i class="bi bi-window-stack"></i>
                    </div>
                `;

            column.innerHTML = `
                <article class="nx-project-card">

                    <div class="nx-project-visual">

                        ${imageContent}

                        <div class="nx-project-overlay">

                            <span class="nx-project-preview-label">
                                <i class="bi bi-eye"></i>
                                EXPLORE PROJECT
                            </span>

                            <button
                                type="button"
                                class="nx-project-preview"
                                aria-label="Preview ${safeTitle}"
                                data-preview-index="${index}"
                            >
                                <i class="bi bi-arrow-up-right"></i>
                            </button>

                        </div>

                        <span class="nx-project-number">
                            ${String(index + 1).padStart(2, "0")}
                        </span>

                    </div>

                    <div class="nx-project-content">

                        <div class="nx-project-meta">

                            <span class="nx-project-category">
                                ${safeCategory}
                            </span>

                            <span class="nx-project-arrow">
                                <i class="bi bi-arrow-up-right"></i>
                            </span>

                        </div>

                        <h3>${safeTitle}</h3>

                        <p>${safeDescription}</p>

                        <div class="nx-project-actions">

                            <button
                                type="button"
                                class="nx-project-text-button"
                                data-preview-index="${index}"
                            >
                                Quick Preview
                                <i class="bi bi-arrow-right"></i>
                            </button>

                            <a href="${detailURL}" class="nx-project-detail">
                                View Details
                            </a>

                        </div>

                    </div>

                </article>
            `;

            container.appendChild(column);

        });

        // Create filters
        createProjectFilters(projects, container);

        // Create preview modal
        createProjectModal();

        // Setup event interactions
        setupProjectInteractions(projects, container);

        // Refresh existing animation systems
        if (typeof AOS !== "undefined") {
            AOS.refresh();
        }

        console.log("Nexa portfolio loaded:", projects.length);

    } catch (error) {

        console.error("Project loading error:", error);

        container.innerHTML = `
            <div class="col-12">
                <div class="nx-project-empty">
                    <i class="bi bi-exclamation-circle"></i>
                    <h4>Unable to load projects</h4>
                    <p>Please try again later.</p>
                </div>
            </div>
        `;

    }

}


/* =====================================================
   HTML ESCAPING
===================================================== */

function escapeProjectHTML(value) {

    const element = document.createElement("div");

    element.textContent = String(value);

    return element.innerHTML;

}


/* =====================================================
   PROJECT CATEGORY FILTERS
===================================================== */

function createProjectFilters(projects, container) {

    const existing = document.getElementById("nx-project-filters");

    if (existing) existing.remove();

    const categories = [
        ...new Set(
            projects.map(function (project) {
                return project.category || "Project";
            })
        )
    ];

    const filterSection = document.createElement("div");

    filterSection.id = "nx-project-filters";

    filterSection.className = "nx-project-filter-wrapper";

    filterSection.innerHTML = `
        <div class="nx-project-filters" role="group"
             aria-label="Filter projects">

            <button
                class="nx-filter-btn active"
                type="button"
                data-filter="all"
                aria-pressed="true"
            >
                All Projects
            </button>

            ${categories.map(function (category) {

                const safeCategory = escapeProjectHTML(category);

                return `
                    <button
                        class="nx-filter-btn"
                        type="button"
                        data-filter="${safeCategory}"
                        aria-pressed="false"
                    >
                        ${safeCategory}
                    </button>
                `;

            }).join("")}

        </div>

        <div class="nx-project-count">
            <span>${projects.length}</span> Creative Projects
        </div>
    `;

    container.parentNode.insertBefore(filterSection, container);

    filterSection.querySelectorAll(".nx-filter-btn").forEach(
        function (button) {

            button.addEventListener("click", function () {

                const selected = button.dataset.filter;

                filterSection.querySelectorAll(".nx-filter-btn")
                    .forEach(function (item) {

                        const active = item === button;

                        item.classList.toggle("active", active);

                        item.setAttribute(
                            "aria-pressed",
                            String(active)
                        );

                    });

                container.querySelectorAll(".nx-project-column")
                    .forEach(function (column) {

                        const matches =
                            selected === "all" ||
                            column.dataset.category === selected;

                        column.classList.toggle(
                            "nx-project-hidden",
                            !matches
                        );

                    });

            });

        }
    );

}


/* =====================================================
   FULL SCREEN PROJECT PREVIEW
===================================================== */

function createProjectModal() {

    if (document.getElementById("nx-project-modal")) return;

    const modal = document.createElement("div");

    modal.id = "nx-project-modal";

    modal.className = "nx-project-modal";

    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = `

        <div class="nx-modal-backdrop"></div>

        <div
            class="nx-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nx-modal-title"
        >

            <button
                type="button"
                class="nx-modal-close"
                aria-label="Close preview"
            >
                <i class="bi bi-x-lg"></i>
            </button>

            <div class="nx-modal-image-wrapper">

                <img
                    id="nx-modal-image"
                    src=""
                    alt=""
                >

                <div
                    id="nx-modal-placeholder"
                    class="nx-modal-placeholder"
                >
                    <i class="bi bi-window-stack"></i>
                </div>

            </div>

            <div class="nx-modal-details">

                <span id="nx-modal-category"></span>

                <h2 id="nx-modal-title"></h2>

                <p id="nx-modal-description"></p>

                <div class="nx-modal-actions">

                    <a
                        id="nx-modal-detail-link"
                        href="#"
                        class="btn btn-primary"
                    >
                        View Full Project
                        <i class="bi bi-arrow-up-right ms-2"></i>
                    </a>

                    <a
                        id="nx-modal-live-link"
                        href="#"
                        class="btn btn-outline-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                        hidden
                    >
                        Visit Website
                        <i class="bi bi-box-arrow-up-right ms-2"></i>
                    </a>

                </div>

            </div>

        </div>

    `;

    document.body.appendChild(modal);

}


/* =====================================================
   MODAL DATA AND INTERACTIONS
===================================================== */

function setupProjectInteractions(projects, container) {

    const modal = document.getElementById("nx-project-modal");

    if (!modal) return;

    const modalImage = document.getElementById("nx-modal-image");

    const modalPlaceholder = document.getElementById(
        "nx-modal-placeholder"
    );

    const closeButton = modal.querySelector(".nx-modal-close");

    const backdrop = modal.querySelector(".nx-modal-backdrop");

    let lastFocusedElement = null;

    let activeIndex = -1;

    function openProject(index) {

        const project = projects[index];

        if (!project) return;

        activeIndex = index;

        lastFocusedElement = document.activeElement;

        document.getElementById("nx-modal-category").textContent =
            project.category || "Project";

        document.getElementById("nx-modal-title").textContent =
            project.title || "Untitled Project";

        document.getElementById("nx-modal-description").textContent =
            project.short_description || "Discover our creative work.";

        const image = project.thumbnail || "";

        modalImage.alt = project.title || "Project preview";

        modalImage.onload = function () {
            modalPlaceholder.hidden = true;
            modalImage.hidden = false;
        };

        modalImage.onerror = function () {
            modalImage.hidden = true;
            modalPlaceholder.hidden = false;
        };

        if (image) {

            modalImage.hidden = false;

            modalPlaceholder.hidden = true;

            modalImage.src = image;

        } else {

            modalImage.hidden = true;

            modalPlaceholder.hidden = false;

        }

        document.getElementById("nx-modal-detail-link").href =
            "/projects/" + encodeURIComponent(project.slug || "") + "/";

        // Optional live URL, if supplied by your API.
        const liveURL = project.live_url ||
            project.website_url ||
            project.demo_url ||
            "";

        const liveLink = document.getElementById("nx-modal-live-link");

        let validLiveURL = "";

        try {

            const parsedURL = new URL(liveURL, window.location.origin);

            if (
                parsedURL.protocol === "https:" ||
                parsedURL.protocol === "http:"
            ) {
                validLiveURL = parsedURL.href;
            }

        } catch (error) {
            validLiveURL = "";
        }

        liveLink.hidden = !validLiveURL;

        if (validLiveURL) {
            liveLink.href = validLiveURL;
        } else {
            liveLink.removeAttribute("href");
        }

        modal.classList.add("active");

        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("nx-modal-open");

        closeButton.focus();

    }

    function closeProject() {

        modal.classList.remove("active");

        modal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("nx-modal-open");

        if (lastFocusedElement && lastFocusedElement.isConnected) {
            lastFocusedElement.focus();
        }

        activeIndex = -1;

    }

    container.addEventListener("click", function (event) {

        const previewButton = event.target.closest(
            "[data-preview-index]"
        );

        if (!previewButton) return;

        const index = Number(previewButton.dataset.previewIndex);

        openProject(index);

    });

    closeButton.addEventListener("click", closeProject);

    backdrop.addEventListener("click", closeProject);

    document.addEventListener("keydown", function (event) {

        if (!modal.classList.contains("active")) return;

        if (event.key === "Escape") {

            closeProject();

        }

        // Keep keyboard focus inside the open dialog.
        if (event.key === "Tab") {

            const focusable = [
                ...modal.querySelectorAll(
                    'button:not([disabled]), a[href]:not([hidden])'
                )
            ].filter(function (element) {
                return element.getClientRects().length > 0;
            });

            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {

                event.preventDefault();
                last.focus();

            } else if (
                !event.shiftKey &&
                document.activeElement === last
            ) {

                event.preventDefault();
                first.focus();

            }

        }

    });

}
