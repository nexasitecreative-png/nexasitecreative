document.addEventListener('DOMContentLoaded', function () {

    const faqContainer =
        document.getElementById('faq-container');

    const faqError =
        document.getElementById('faq-error');


    if (!faqContainer) {
        return;
    }


    fetch('/service/faqs/')
        .then(function (response) {

            if (!response.ok) {
                throw new Error('Failed to load FAQs.');
            }

            return response.json();

        })
        .then(function (data) {

            const faqs = Array.isArray(data)
                ? data
                : (data.results || []);


            faqContainer.innerHTML = '';


            if (faqs.length === 0) {

                faqContainer.innerHTML = `
                    <div class="text-center py-4">
                        <p class="text-muted mb-0">
                            No frequently asked questions available.
                        </p>
                    </div>
                `;

                return;
            }


            faqs.forEach(function (faq, index) {

                const item =
                    document.createElement('div');


                item.className =
                    'accordion-item border-0 shadow-sm mb-3';


                const headingId =
                    'faq-heading-' + index;


                const collapseId =
                    'faq-collapse-' + index;


                const firstItem =
                    index === 0;


                item.innerHTML = `

                    <h2
                        class="accordion-header"
                        id="${headingId}"
                    >

                        <button
                            class="accordion-button fw-semibold
                            ${firstItem ? '' : 'collapsed'}"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#${collapseId}"
                            aria-expanded="${firstItem ? 'true' : 'false'}"
                            aria-controls="${collapseId}"
                        >

                            ${escapeHtml(
                                faq.question || ''
                            )}

                        </button>

                    </h2>


                    <div
                        id="${collapseId}"
                        class="accordion-collapse collapse
                        ${firstItem ? 'show' : ''}"
                        aria-labelledby="${headingId}"
                        data-bs-parent="#faq-container"
                    >

                        <div class="accordion-body text-muted">

                            ${formatAnswer(
                                faq.answer || ''
                            )}

                        </div>

                    </div>

                `;


                faqContainer.appendChild(item);

            });


        })
        .catch(function (error) {

            console.error(
                'FAQ error:',
                error
            );


            faqContainer.innerHTML = `
                <div class="text-center py-4">
                    <p class="text-muted mb-0">
                        Frequently asked questions
                        are currently unavailable.
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


    function formatAnswer(value) {

        return escapeHtml(value)
            .replace(/\r\n/g, '<br>')
            .replace(/\n/g, '<br>');

    }

});