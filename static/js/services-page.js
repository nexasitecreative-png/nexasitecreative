document.addEventListener('DOMContentLoaded', function () {

    const container = document.getElementById(
        'services-page-container'
    );

    const noResults = document.getElementById(
        'services-no-results'
    );

    if (!container) {
        return;
    }

    fetch('/service/serviceslist/')
        .then(function (response) {

            if (!response.ok) {
                throw new Error('Failed to load services.');
            }

            return response.json();
        })

        .then(function (data) {

            const services = Array.isArray(data)
                ? data
                : (data.results || []);

            container.innerHTML = '';

            if (services.length === 0) {

                if (noResults) {
                    noResults.classList.remove('d-none');
                }

                return;
            }

            if (noResults) {
                noResults.classList.add('d-none');
            }

            services.forEach(function (service, index) {

                const column =
                    document.createElement('div');

                column.className =
                    'col-12 col-sm-6 col-lg-3';

                column.setAttribute(
                    'data-aos',
                    'fade-up'
                );

                column.setAttribute(
                    'data-aos-delay',
                    String((index % 3) * 100)
                );

                let imageHTML = '';

                if (service.image) {

                    imageHTML = `
                        <div class="service-card-image">
                            <img
                                src="${escapeHtml(service.image)}"
                                alt="${escapeHtml(service.title || 'Service')}"
                                loading="lazy"
                            >
                        </div>
                    `;

                } else {

                    imageHTML = `
                        <div class="service-card-icon d-flex align-items-center justify-content-center">
                            <i class="bi ${escapeHtml(
                                service.icon || 'bi-code-slash'
                            )}"></i>
                        </div>
                    `;
                }

                column.innerHTML = `
                    <div class="card service-card h-100 border-0 shadow-sm">

                        ${imageHTML}

                        <div class="card-body p-4">

                            <h4 class="service-card-title fw-bold">
                                ${escapeHtml(service.title || '')}
                            </h4>

                            <p class="text-muted">
                                ${escapeHtml(
                                    service.short_description || ''
                                )}
                            </p>

                            <a
                                href="/services/${encodeURIComponent(service.slug)}/"
                                class="btn btn-outline-primary service-view-button"
                            >
                                View Service
                                <i class="bi bi-arrow-right ms-2"></i>
                            </a>

                        </div>

                    </div>
                `;

                container.appendChild(column);

            });

            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }

        })

        .catch(function (error) {

            console.error(
                'Services page error:',
                error
            );

            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-muted">
                        Services are currently unavailable.
                    </p>
                </div>
            `;

        });


    function escapeHtml(value) {

        const div =
            document.createElement('div');

        div.textContent = value;

        return div.innerHTML;
    }

});