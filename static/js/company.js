document.addEventListener('DOMContentLoaded', function () {

    fetch('/service/company/')

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    'Failed to load company information.'
                );

            }

            return response.json();

        })

        .then(function (data) {

            setText(
                'company-name',
                data.company_name
            );


            setText(
                'footer-company-name',
                data.company_name
            );


            setText(
                'footer-description',
                data.description
            );


            setContactText(
                'footer-email',
                'bi-envelope',
                data.email
            );


            setContactText(
                'footer-phone',
                'bi-telephone',
                data.phone
            );


            setContactText(
                'footer-address',
                'bi-geo-alt',
                data.address
            );


            setText(
                'footer-copyright',
                data.copyright_text
            );

        })

        .catch(function (error) {

            console.error(
                'Company information error:',
                error
            );

        });


    function setText(id, value) {

        const element = document.getElementById(id);

        if (!element) {
            return;
        }

        if (!value) {
            return;
        }

        element.textContent = value;

    }


    function setContactText(id, iconClass, value) {

        const element = document.getElementById(id);

        if (!element) {
            return;
        }

        if (!value) {
            return;
        }

        element.innerHTML = `
            <i class="bi ${iconClass} me-2"></i>
            ${escapeHtml(value)}
        `;

    }


    function escapeHtml(value) {

        const div = document.createElement('div');

        div.textContent = value;

        return div.innerHTML;

    }

});