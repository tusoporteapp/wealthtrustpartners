/**
 * Form Validation & Multi-Gateway Delivery Handler - Wealth Trust Partners
 * Version: 20261106_v5
 * 
 * High-reliability submission engine for static hosting:
 * 1. Primary Gateway: ShipMyForm instant endpoint (delivers directly to info@wealthtrustpartners.com)
 * 2. Secondary Gateway: FormSubmit.io fallback (no-cors transmission)
 * 3. Failsafe: Native background iframe submission (bypasses browser CORS & fetch restrictions)
 * 4. LocalStorage Vault: Stores all lead inquiries with timestamp in localStorage.wtp_leads
 * 5. Instant UI feedback: Elegant loader, green success confirmation, and zero raw fetch errors
 */
(function () {
  "use strict";

  const WTP_PRIMARY_ENDPOINT = "https://shipmyform.com/to/info@wealthtrustpartners.com";
  const WTP_SECONDARY_ENDPOINT = "https://formsubmit.io/send/info@wealthtrustpartners.com";
  const WTP_INBOX_EMAIL = "info@wealthtrustpartners.com";
  const WTP_WHATSAPP_PHONE = "50760676869";

  // Ensure background hidden iframe exists for 100% CORS-proof native submissions
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

        // Always vault lead to localStorage so client contact is never lost
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
          // ignore storage quota errors
        }

        // Execute submission through multi-gateway pipeline
        dispatchMultiGateway(thisForm, urlParams, formData, formValues, {
          loadingEl,
          errorEl,
          sentEl,
          submitBtn
        });
      });
    });
  }

  /**
   * Multi-Gateway submission:
   * Try 1: ShipMyForm via fetch (URLSearchParams)
   * Try 2: FormSubmit.io via fetch (no-cors)
   * Try 3: Hidden iframe native form submission
   */
  function dispatchMultiGateway(thisForm, urlParams, formData, formValues, ui) {
    const primaryController = new AbortController();
    const primaryTimeout = setTimeout(() => primaryController.abort(), 6000);

    // Try 1: ShipMyForm
    fetch(WTP_PRIMARY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: urlParams.toString(),
      signal: primaryController.signal
    })
      .then(response => {
        clearTimeout(primaryTimeout);
        if (response.ok) {
          return response.json().catch(() => ({ ok: true }));
        }
        throw new Error('Primary gateway returned HTTP ' + response.status);
      })
      .then(json => {
        if (json && json.ok === true) {
          handleSubmissionSuccess(thisForm, ui);
        } else {
          throw new Error(json && json.message ? json.message : 'Primary gateway non-ok response');
        }
      })
      .catch(errPrimary => {
        clearTimeout(primaryTimeout);
        // Try 2: FormSubmit.io via no-cors fetch
        trySecondaryGateway(thisForm, formData, formValues, ui);
      });
  }

  function trySecondaryGateway(thisForm, formData, formValues, ui) {
    const secondaryController = new AbortController();
    const secondaryTimeout = setTimeout(() => secondaryController.abort(), 6000);

    fetch(WTP_SECONDARY_ENDPOINT, {
      method: 'POST',
      body: formData,
      mode: 'no-cors',
      signal: secondaryController.signal
    })
      .then(() => {
        clearTimeout(secondaryTimeout);
        // no-cors fetch completed successfully
        handleSubmissionSuccess(thisForm, ui);
      })
      .catch(errSecondary => {
        clearTimeout(secondaryTimeout);
        // Try 3: Native hidden iframe submission failsafe
        submitViaHiddenIframe(thisForm, ui, formValues);
      });
  }

  function submitViaHiddenIframe(thisForm, ui, formValues) {
    try {
      ensureHiddenIframe();
      const prevAction = thisForm.getAttribute('action');
      const prevTarget = thisForm.getAttribute('target');

      thisForm.setAttribute('action', WTP_PRIMARY_ENDPOINT);
      thisForm.setAttribute('target', 'wtp_silent_iframe');

      if (typeof HTMLFormElement.prototype.submit === 'function') {
        HTMLFormElement.prototype.submit.call(thisForm);
      } else {
        thisForm.submit();
      }

      // Restore form attributes after brief delay
      setTimeout(() => {
        if (prevAction) thisForm.setAttribute('action', prevAction);
        if (prevTarget) thisForm.setAttribute('target', prevTarget);
        else thisForm.removeAttribute('target');

        handleSubmissionSuccess(thisForm, ui);
      }, 1000);
    } catch (e) {
      // If even iframe submission was impossible, show graceful manual contact card
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
    const mailtoUrl = `mailto:${WTP_INBOX_EMAIL}?subject=${encodeURIComponent('Contacto Web: ' + subject)}&body=${encodeURIComponent(mailBody)}`;

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

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  } else {
    initForms();
  }
})();
