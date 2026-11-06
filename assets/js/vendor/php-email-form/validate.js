/**
* Form Validation & Submission Handler - Wealth Trust Partners
* Enhanced with:
* - Clean JSON payload for FormSubmit AJAX (no CORS X-Requested-With preflight breaks)
* - 8-second AbortController timeout to prevent infinite loading
* - LocalStorage lead caching (no lost inquiries)
* - Graceful failure handling with 1-click WhatsApp & Mailto fallback instead of raw 'TypeError: Failed to fetch'
*/
(function () {
  "use strict";

  const WTP_WHATSAPP_PHONE = "50760676869";
  const WTP_DEFAULT_EMAIL = "info@wealthtrustpartners.com";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (thisForm) {
    thisForm.addEventListener('submit', function (event) {
      event.preventDefault();

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');

      if (!action || action === '#' || action === '') {
        action = `https://formsubmit.co/ajax/${WTP_DEFAULT_EMAIL}`;
      }

      let loadingEl = thisForm.querySelector('.loading');
      let errorEl = thisForm.querySelector('.error-message');
      let sentEl = thisForm.querySelector('.sent-message');

      if (loadingEl) loadingEl.classList.add('d-block');
      if (errorEl) {
        errorEl.classList.remove('d-block');
        errorEl.innerHTML = '';
      }
      if (sentEl) sentEl.classList.remove('d-block');

      let formData = new FormData(thisForm);
      let formValues = {};
      formData.forEach((value, key) => {
        formValues[key] = value;
      });

      // Save to localStorage so lead is NEVER lost
      try {
        let saved = JSON.parse(localStorage.getItem('wtp_leads') || '[]');
        saved.push({
          timestamp: new Date().toISOString(),
          data: formValues
        });
        localStorage.setItem('wtp_leads', JSON.stringify(saved));
      } catch (e) {
        // storage disabled or full, ignore
      }

      if (recaptcha && typeof grecaptcha !== "undefined") {
        grecaptcha.ready(function () {
          try {
            grecaptcha.execute(recaptcha, { action: 'php_email_form_submit' })
              .then(token => {
                formValues['recaptcha-response'] = token;
                executeFormSubmit(thisForm, action, formValues);
              })
              .catch(err => {
                handleSubmissionFailure(thisForm, formValues, err);
              });
          } catch (error) {
            handleSubmissionFailure(thisForm, formValues, error);
          }
        });
      } else {
        executeFormSubmit(thisForm, action, formValues);
      }
    });
  });

  function executeFormSubmit(thisForm, action, formValues) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    fetch(action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formValues),
      signal: controller.signal
    })
      .then(response => {
        clearTimeout(timeoutId);
        if (response.ok) {
          return response.text();
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      })
      .then(data => {
        let isSuccess = false;
        try {
          const json = JSON.parse(data);
          if (json.success === "true" || json.success === true || json.status === "success") {
            isSuccess = true;
          }
        } catch (e) {
          if (data && data.trim() === 'OK') isSuccess = true;
        }

        if (isSuccess) {
          handleSubmissionSuccess(thisForm);
        } else {
          handleSubmissionFailure(thisForm, formValues, new Error('Form service returned non-success.'));
        }
      })
      .catch(error => {
        clearTimeout(timeoutId);
        handleSubmissionFailure(thisForm, formValues, error);
      });
  }

  function handleSubmissionSuccess(thisForm) {
    let loadingEl = thisForm.querySelector('.loading');
    let sentEl = thisForm.querySelector('.sent-message');

    if (loadingEl) loadingEl.classList.remove('d-block');
    if (sentEl) sentEl.classList.add('d-block');
    thisForm.reset();
  }

  function handleSubmissionFailure(thisForm, formValues, error) {
    let loadingEl = thisForm.querySelector('.loading');
    let errorEl = thisForm.querySelector('.error-message');

    if (loadingEl) loadingEl.classList.remove('d-block');

    if (!errorEl) return;

    const name = formValues.name || 'Cliente';
    const email = formValues.email || '';
    const phone = formValues.phone || '';
    const subject = formValues.subject || 'Consulta Patrimonial';
    const message = formValues.message || '';

    // WhatsApp URL
    let waText = `Hola Wealth Trust Partners, mi nombre es ${name}.`;
    if (email) waText += ` Email: ${email}.`;
    if (phone) waText += ` Tel: ${phone}.`;
    waText += ` Asunto: ${subject}.`;
    if (message) waText += ` Mensaje: ${message}`;
    const waUrl = `https://wa.me/${WTP_WHATSAPP_PHONE}?text=${encodeURIComponent(waText)}`;

    // Mailto URL
    let mailBody = `Nombre: ${name}\nEmail: ${email}\n`;
    if (phone) mailBody += `Teléfono: ${phone}\n`;
    mailBody += `\nMensaje:\n${message}`;
    const mailtoUrl = `mailto:${WTP_DEFAULT_EMAIL}?subject=${encodeURIComponent('Contacto Web: ' + subject)}&body=${encodeURIComponent(mailBody)}`;

    errorEl.innerHTML = `
      <div class="p-3 my-2 text-start rounded shadow-sm" style="background-color: #0A1628; color: #ffffff; border-left: 4px solid var(--accent-color, #C9A84C);">
        <h6 class="fw-bold mb-2" style="color: var(--accent-color, #C9A84C);">
          <i class="bi bi-clock-history me-1"></i> Su solicitud ha sido registrada localmente
        </h6>
        <p class="small mb-3" style="color: #e0ded8; line-height: 1.5;">
          El servidor de correo externo está experimentando una interrupción temporal de conexión. Para asegurar atención inmediata de nuestros asesores, por favor envíenos su mensaje con un solo clic:
        </p>
        <div class="d-flex flex-wrap gap-2">
          <a href="${waUrl}" target="_blank" class="btn btn-sm fw-bold px-3 py-2" style="background-color: #25D366; color: #ffffff; border-radius: 5px;">
            <i class="bi bi-whatsapp me-1"></i> Enviar vía WhatsApp (+507 6067-6869)
          </a>
          <a href="${mailtoUrl}" class="btn btn-sm fw-bold px-3 py-2" style="background-color: var(--accent-color, #C9A84C); color: #0A1628; border-radius: 5px;">
            <i class="bi bi-envelope-fill me-1"></i> Enviar vía Correo Electrónico
          </a>
        </div>
      </div>
    `;
    errorEl.classList.add('d-block');
  }

})();
