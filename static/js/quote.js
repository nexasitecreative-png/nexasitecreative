document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById(
        'quote-form'
    );

    if (!form) {
        return;
    }


    const serviceSelect = document.getElementById(
        'quote-service'
    );

    const successMessage = document.getElementById(
        'quote-success'
    );

    const errorMessage = document.getElementById(
        'quote-error'
    );

    const submitButton = document.getElementById(
        'quote-submit'
    );

    const submitText = document.getElementById(
        'quote-submit-text'
    );

    const submitSpinner = document.getElementById(
        'quote-submit-spinner'
    );

    const quoteEmail = document.getElementById(
        'quote-email'
    );

    const quotePhone = document.getElementById(
        'quote-phone'
    );

    const quoteOtp = document.getElementById(
        'quote-otp'
    );

    const otpSection = document.getElementById(
        'otp-section'
    );

    const verifyOtpButton = document.getElementById(
        'verify-otp'
    );

    const otpMessage = document.getElementById(
        'otp-message'
    );


    // --------------------------------
    // Email Verification State
    // --------------------------------

    let emailVerified = false;


    // --------------------------------
    // CSRF Token
    // --------------------------------

    function getCSRFToken() {

        const name = 'csrftoken=';
        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {

            const cookie = cookies[i].trim();

            if (cookie.startsWith(name)) {

                return decodeURIComponent(
                    cookie.substring(name.length)
                );
            }
        }

        return '';
    }


    // --------------------------------
    // Load Services
    // --------------------------------

    fetch('/service/serviceslist/')
        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    'Unable to load services.'
                );
            }

            return response.json();

        })

        .then(function (services) {

            services.forEach(function (service) {

                const option =
                    document.createElement('option');

                option.value = service.id;

                option.textContent = service.title;

                serviceSelect.appendChild(option);

            });

        })

        .catch(function (error) {

            console.error(error);

        });


    // --------------------------------
    // Send OTP
    // --------------------------------

    quoteEmail.addEventListener(
        'blur',
        function () {

            const email =
                quoteEmail.value.trim();

            if (
                !email ||
                !quoteEmail.checkValidity()
            ) {

                return;
            }


            // Reset previous verification
            emailVerified = false;

            submitButton.disabled = true;

            submitText.textContent =
                'Verify Email First';


            otpMessage.textContent =
                'Sending verification code...';

            otpMessage.className =
                'small text-muted';


            fetch(
                '/service/quote/send-otp/',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json',

                        'X-CSRFToken':
                            getCSRFToken()
                    },

                    body: JSON.stringify({
                        email: email
                    })
                }
            )

            .then(function (response) {

                return response.json()
                    .then(function (result) {

                        return {
                            ok: response.ok,
                            data: result
                        };

                    });

            })

            .then(function (result) {

                if (!result.ok) {

                    throw new Error(
                        formatErrors(
                            result.data
                        )
                    );
                }


                otpSection.classList.remove(
                    'd-none'
                );


                quoteOtp.value = '';

                quoteOtp.disabled = false;

                verifyOtpButton.disabled = false;

                verifyOtpButton.textContent =
                    'Verify';


                otpMessage.textContent =
                    'Verification code sent to your email.';

                otpMessage.className =
                    'small text-success';

            })

            .catch(function (error) {

                console.error(error);

                otpMessage.textContent =
                    error.message ||
                    'Unable to send verification code.';

                otpMessage.className =
                    'small text-danger';

            });

        }
    );


    // --------------------------------
    // Reset Verification
    // If Email Changes
    // --------------------------------

    quoteEmail.addEventListener(
        'input',
        function () {

            emailVerified = false;

            submitButton.disabled = true;

            submitText.textContent =
                'Verify Email First';

            otpSection.classList.add(
                'd-none'
            );

            otpMessage.textContent = '';

            quoteOtp.value = '';

        }
    );


    // --------------------------------
    // Allow Only Numbers in Phone
    // --------------------------------

    quotePhone.addEventListener(
        'input',
        function () {

            quotePhone.value =
                quotePhone.value
                    .replace(/\D/g, '')
                    .slice(0, 10);

        }
    );


    // --------------------------------
    // Allow Only Numbers in OTP
    // --------------------------------

    quoteOtp.addEventListener(
        'input',
        function () {

            quoteOtp.value =
                quoteOtp.value
                    .replace(/\D/g, '')
                    .slice(0, 6);

        }
    );


    // --------------------------------
    // Verify OTP
    // --------------------------------

    verifyOtpButton.addEventListener(
        'click',
        function () {

            const email =
                quoteEmail.value.trim();

            const otp =
                quoteOtp.value.trim();


            if (!email) {

                otpMessage.textContent =
                    'Please enter your email address first.';

                otpMessage.className =
                    'small text-danger';

                return;
            }


            if (!/^\d{6}$/.test(otp)) {

                otpMessage.textContent =
                    'Please enter a valid 6-digit OTP.';

                otpMessage.className =
                    'small text-danger';

                return;
            }


            verifyOtpButton.disabled = true;

            verifyOtpButton.textContent =
                'Verifying...';


            fetch(
                '/service/quote/verify-otp/',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json',

                        'X-CSRFToken':
                            getCSRFToken()
                    },

                    body: JSON.stringify({

                        email: email,

                        otp: otp

                    })
                }
            )

            .then(function (response) {

                return response.json()
                    .then(function (result) {

                        return {
                            ok: response.ok,
                            data: result
                        };

                    });

            })

            .then(function (result) {

                if (!result.ok) {

                    throw new Error(
                        formatErrors(
                            result.data
                        )
                    );
                }


                // Email is verified
                emailVerified = true;


                otpMessage.textContent =
                    'Email verified successfully ✓';

                otpMessage.className =
                    'small text-success fw-bold';


                quoteOtp.disabled = true;

                verifyOtpButton.disabled = true;

                verifyOtpButton.textContent =
                    'Verified ✓';


                submitButton.disabled = false;

                submitText.textContent =
                    'Send Quote Request';

            })

            .catch(function (error) {

                console.error(error);

                emailVerified = false;

                otpMessage.textContent =
                    error.message ||
                    'Invalid verification code.';

                otpMessage.className =
                    'small text-danger';


                verifyOtpButton.disabled = false;

                verifyOtpButton.textContent =
                    'Verify';

            });

        }
    );


    // --------------------------------
    // Submit Quote
    // --------------------------------

    form.addEventListener(
        'submit',
        function (event) {

            event.preventDefault();


            // Extra frontend protection
            if (!emailVerified) {

                errorMessage.textContent =
                    'Please verify your email before submitting the quote.';

                errorMessage.classList.remove(
                    'd-none'
                );

                return;
            }


            // Validate phone
            const phone =
                quotePhone.value.trim();

            if (!/^\d{10}$/.test(phone)) {

                errorMessage.textContent =
                    'Phone number must be exactly 10 digits.';

                errorMessage.classList.remove(
                    'd-none'
                );

                quotePhone.focus();

                return;
            }


            successMessage.classList.add(
                'd-none'
            );

            errorMessage.classList.add(
                'd-none'
            );


            const data = {

                name: document.getElementById(
                    'quote-name'
                ).value.trim(),

                email: document.getElementById(
                    'quote-email'
                ).value.trim(),

                phone: phone,

                company: document.getElementById(
                    'quote-company'
                ).value.trim(),

                service: serviceSelect.value || null,

                message: document.getElementById(
                    'quote-message'
                ).value.trim()

            };


            // Loading state
            submitButton.disabled = true;

            submitText.textContent =
                'Sending...';

            submitSpinner.classList.remove(
                'd-none'
            );


            fetch(
                '/service/quote/',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json',

                        'X-CSRFToken':
                            getCSRFToken()
                    },

                    body: JSON.stringify(data)
                }
            )

            .then(function (response) {

                return response.json()
                    .then(function (result) {

                        return {
                            ok: response.ok,
                            data: result
                        };

                    });

            })

            .then(function (result) {

                if (!result.ok) {

                    throw new Error(
                        formatErrors(
                            result.data
                        )
                    );
                }


                successMessage.textContent =
                    result.data.message ||
                    'Quote request submitted successfully.';

                successMessage.classList.remove(
                    'd-none'
                );


                // Reset form
                form.reset();


                // Reset email verification
                emailVerified = false;

                otpSection.classList.add(
                    'd-none'
                );

                otpMessage.textContent = '';

                quoteOtp.value = '';

                quoteOtp.disabled = false;

                verifyOtpButton.disabled = false;

                verifyOtpButton.textContent =
                    'Verify';


                submitButton.disabled = true;

                submitText.textContent =
                    'Verify Email First';


                successMessage.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

            })

            .catch(function (error) {

                console.error(error);

                errorMessage.textContent =
                    error.message ||
                    'Something went wrong. Please try again.';

                errorMessage.classList.remove(
                    'd-none'
                );

            })

            .finally(function () {

                submitSpinner.classList.add(
                    'd-none'
                );


                // Only enable submit if email
                // is still verified
                if (emailVerified) {

                    submitButton.disabled = false;

                    submitText.textContent =
                        'Send Quote Request';

                }

            });

        }
    );


    // --------------------------------
    // Format API Errors
    // --------------------------------

    function formatErrors(errors) {

        if (!errors) {

            return 'Please check the form and try again.';
        }


        const messages = [];


        Object.keys(errors).forEach(
            function (field) {

                const fieldErrors =
                    errors[field];


                if (Array.isArray(fieldErrors)) {

                    fieldErrors.forEach(
                        function (message) {

                            messages.push(
                                message
                            );

                        }
                    );

                }

                else if (
                    typeof fieldErrors === 'string'
                ) {

                    messages.push(
                        fieldErrors
                    );

                }

            }
        );


        if (messages.length > 0) {

            return messages.join(' ');

        }


        return 'Please check the form and try again.';
    }

});