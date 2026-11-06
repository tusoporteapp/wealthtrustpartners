/**
 * Form Validation & Multi-Gateway Delivery Handler - Wealth Trust Partners
 * Version: 20261106_v6
 * 
 * Direct notification delivery to:
 * - info@wealthtrustpartners.com (forwarded via Cloudflare Email Routing to Gmail)
 * - wealthtrustpartners@gmail.com (direct CC notification)
 * - ShipMyForm dashboard backup
 */
(function () {
  "use strict";

  const WTP_EMAIL_ENDPOINT = "https://formsubmit.io/send/info@wealthtrustpartners.com";
  const WTP_DASHBOARD_ENDPOINT = "https://shipmyform.com/to/info@wealthtrustpartners.com";
  const WTP_GMAIL_DESTINATION = "wealthtrustpartners@gmail.com";
  const WTP_INBOX_EMAIL = "info@wealthtrustpartners.com";
  const WTP_WHATSAPP_PHONE = "50760676869";

  function ensureHiddenIframe() {
    let iframe = document.getElementById('wtp_silent_iframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'wtp_silent_iframe';
      iframe.name = 'wtp_silent_iframe';
      iframe.setAttribute('style', 'display:none;position:absolute;width:0;height:0;border:0;opacity:0;pointer-events:none;');
      iframe.setAttribute('aria-hidden', 'true');
      document.body.appendChild(iframe);
    }
    return iframe;
  }

  function initForms() {
    let forms = document.querySelectorAll('.php-email-form');

    forms.forEach(function (thisForm) {
      if (thisForm.dataset.wtpInitialized === "true") return;
      thisForm.dataset.wtpInitialized = "true";

      thisForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Native HTML5 validation
        if (typeof thisForm.checkValidity === 'function' && !thisForm.checkValidity()) {
          if (typeof thisForm.reportValidity === 'function') {
            thisForm.reportValidity();
          }
          return;
        }

        let loadingEl = thisForm.querySelector('.loading');
        let errorEl = thisForm.querySelector('.error-message');
        let sentEl = thisForm.querySelector('.sent-message');
        let submitBtn = thisForm.querySelector('button[type="submit"]');

        if (loadingEl) loadingEl.classList.add('d-block');
        if (errorEl) {
          errorEl.classList.remove('d-block');
          errorEl.innerHTML = '';
          errorEl.style.background = 'transparent';
        }
        if (sentEl) sentEl.classList.remove('d-block');
        if (submitBtn) submitBtn.disabled = true;

        // Collect form data
        let formData = new FormData(thisForm);
        let formValues = {};
        let urlParams = new URLSearchParams();

        formData.forEach((value, key) => {
          formValues[key] = value;
          urlParams.append(key, value);
        });

        // Ensure CC to wealthtrustpartners@gmail.com is always attached
        if (!formValues['_cc']) {
          formData.append('_cc', WTP_GMAIL_DESTINATION);
          urlParams.append('_cc', WTP_GMAIL_DESTINATION);
          formValues['_cc'] = WTP_GMAIL_DESTINATION;
        }

        // Vault lead in localStorage so contact is never lost
        try {
          let saved = JSON.parse(localStorage.getItem('wtp_leads') || '[]');
          saved.push({
            timestamp: new Date().toISOString(),
            formId: thisForm.getAttribute('id') || 'unnamed_form',
            page: window.location.pathname,
            data: formValues
          });
          localStorage.setItem('wtp_leads', JSON.stringify(saved));
        } catch (e) {
          // ignore quota limits
        }

        // If Web3Forms access_key is configured, use direct high-deliverability API
        if (formValues['access_key'] && formValues['access_key'] !== 'YOUR_ACCESS_KEY_HERE') {
          fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(formValues)
          })
            .then(res => res.json())
            .then(data => {
              if (data && data.success) {
                handleSubmissionSuccess(thisForm, { loadingEl, errorEl, sentEl, submitBtn });
              } else {
                throw new Error(data && data.message ? data.message : 'Web3Forms error');
              }
            })
            .catch(() => {
              dispatchNotification(thisForm, formData, urlParams, formValues, { loadingEl, errorEl, sentEl, submitBtn });
            });
          return;
        }

        // Dual dispatch:
        // 1. Send to FormSubmit.io for real SMTP email delivery to Cloudflare & Gmail
        // 2. Send to ShipMyForm for dashboard analytics
        dispatchNotification(thisForm, formData, urlParams, formValues, {
          loadingEl,
          errorEl,
          sentEl,
          submitBtn
        });
      });
    });
  }

  function dispatchNotification(thisForm, formData, urlParams, formValues, ui) {
    // Background ping to ShipMyForm dashboard
    try {
      fetch(WTP_DASHBOARD_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: urlParams.toString(),
        mode: 'no-cors'
      }).catch(() => {});
    } catch (e) {}

    // Primary Email Gateway: FormSubmit.io with CC to Gmail
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    fetch(WTP_EMAIL_ENDPOINT, {
      method: 'POST',
      body: formData,
      mode: 'no-cors',
      signal: controller.signal
    })
      .then(() => {
        clearTimeout(timeout);
        handleSubmissionSuccess(thisForm, ui);
      })
      .catch(() => {
        clearTimeout(timeout);
        // Failsafe: Background silent iframe submission
        submitViaHiddenIframe(thisForm, ui, formValues);
      });
  }

  function submitViaHiddenIframe(thisForm, ui, formValues) {
    try {
      ensureHiddenIframe();
      const prevAction = thisForm.getAttribute('action');
      const prevTarget = thisForm.getAttribute('target');

      thisForm.setAttribute('action', WTP_EMAIL_ENDPOINT);
      thisForm.setAttribute('target', 'wtp_silent_iframe');

      if (typeof HTMLFormElement.prototype.submit === 'function') {
        HTMLFormElement.prototype.submit.call(thisForm);
      } else {
        thisForm.submit();
      }

      setTimeout(() => {
        if (prevAction) thisForm.setAttribute('action', prevAction);
        if (prevTarget) thisForm.setAttribute('target', prevTarget);
        else thisForm.removeAttribute('target');

        handleSubmissionSuccess(thisForm, ui);
      }, 1000);
    } catch (e) {
      handleSubmissionFailure(thisForm, formValues, ui);
    }
  }

  function handleSubmissionSuccess(thisForm, ui) {
    if (ui.loadingEl) ui.loadingEl.classList.remove('d-block');
    if (ui.errorEl) {
      ui.errorEl.classList.remove('d-block');
      ui.errorEl.innerHTML = '';
    }
    if (ui.sentEl) ui.sentEl.classList.add('d-block');
    if (ui.submitBtn) ui.submitBtn.disabled = false;

    thisForm.reset();
  }

  function handleSubmissionFailure(thisForm, formValues, ui) {
    if (ui.loadingEl) ui.loadingEl.classList.remove('d-block');
    if (ui.submitBtn) ui.submitBtn.disabled = false;

    if (!ui.errorEl) return;

    const name = formValues.name || 'Cliente';
    const email = formValues.email || '';
    const phone = formValues.phone || '';
    const subject = formValues.subject || 'Consulta Patrimonial';
    const message = formValues.message || '';

    // WhatsApp URL
    let waText = `Hola Wealth Trust Partners, mi nombre es ${name}.`;
    if (email) waText += ` Email: ${email}.`;
    if (phone) waText += ` Tel: ${phone}.`;
    if (subject) waText += ` Asunto: ${subject}.`;
    if (message) waText += ` Mensaje: ${message}`;
    const waUrl = `https://wa.me/${WTP_WHATSAPP_PHONE}?text=${encodeURIComponent(waText)}`;

    // Mailto URL
    let mailBody = `Nombre: ${name}\nEmail: ${email}\n`;
    if (phone) mailBody += `Teléfono: ${phone}\n`;
    mailBody += `\nMensaje:\n${message}`;
    const mailtoUrl = `mailto:${WTP_INBOX_EMAIL}?cc=${WTP_GMAIL_DESTINATION}&subject=${encodeURIComponent('Contacto Web: ' + subject)}&body=${encodeURIComponent(mailBody)}`;

    ui.errorEl.style.background = 'transparent';
    ui.errorEl.style.padding = '0';
    ui.errorEl.innerHTML = `
      <div class="p-3 my-2 text-start rounded shadow-sm" style="background-color: #0A1628; color: #ffffff; border-left: 4px solid var(--accent-color, #C9A84C);">
        <h6 class="fw-bold mb-2" style="color: var(--accent-color, #C9A84C);">
          <i class="bi bi-shield-check me-1"></i> Su solicitud ha sido guardada
        </h6>
        <p class="small mb-3" style="color: #e0ded8; line-height: 1.5;">
          Para garantizar una respuesta inmediata de nuestro equipo patrimonial, puede transmitirla directamente por su canal preferido:
        </p>
        <div class="d-flex flex-wrap gap-2">
          <a href="${waUrl}" target="_blank" class="btn btn-sm fw-bold px-3 py-2" style="background-color: #25D366; color: #ffffff; border-radius: 5px; text-decoration: none;">
            <i class="bi bi-whatsapp me-1"></i> Enviar por WhatsApp (+507 6067-6869)
          </a>
          <a href="${mailtoUrl}" class="btn btn-sm fw-bold px-3 py-2" style="background-color: var(--accent-color, #C9A84C); color: #0A1628; border-radius: 5px; text-decoration: none;">
            <i class="bi bi-envelope-fill me-1"></i> Enviar por Correo Electrónico
          </a>
        </div>
      </div>
    `;
    ui.errorEl.classList.add('d-block');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  } else {
    initForms();
  }
})();
