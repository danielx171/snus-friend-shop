import { EMAIL_RE, parseJsonResponse } from '@/scripts/form-helpers';
import { tenant } from '@/config/tenant';

const CONTACT_FORM_SELECTOR = '[data-contact-form]';

let isBooted = false;

interface ContactFormOptions {
  idleText: string;
  submittingText: string;
  requiredMessage: string;
  invalidEmailMessage: string;
  successMessage: string;
  genericErrorMessage: string;
  networkErrorMessage: string;
  fallbackMessageTemplate: string;
}

interface ContactFormResponse {
  success?: boolean;
  message?: string;
}

const showStatus = (status: HTMLElement, text: string, isError: boolean): void => {
  status.textContent = text;
  status.className = `rounded-lg px-4 py-3 text-sm ${
    isError
      ? 'border border-destructive/20 bg-destructive/10 text-destructive'
      : 'border border-primary/20 bg-primary/10 text-primary'
  }`;
};

const hideStatus = (status: HTMLElement): void => {
  status.textContent = '';
  status.className = 'hidden rounded-lg px-4 py-3 text-sm';
};

const initContactForms = (options: ContactFormOptions): void => {
  const forms = document.querySelectorAll<HTMLFormElement>(CONTACT_FORM_SELECTOR);

  forms.forEach((form) => {
    if (form.dataset.contactInitialized === 'true') {
      return;
    }

    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const status = form.querySelector<HTMLElement>('[data-contact-status]');

    if (!button || !status) {
      return;
    }

    const functionUrl = form.dataset.fnUrl || '';
    const apiKey = form.dataset.apiKey || '';
    const supportEmail = form.dataset.supportEmail || tenant.supportEmail;
    form.dataset.contactInitialized = 'true';

    form.addEventListener('input', () => {
      hideStatus(status);
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const name = formData.get('name')?.toString().trim() || '';
      const email = formData.get('email')?.toString().trim() || '';
      const subject = formData.get('subject')?.toString() || '';
      const message = formData.get('message')?.toString().trim() || '';
      const website = formData.get('website')?.toString().trim() || '';

      if (!name || !email || !subject || !message) {
        showStatus(status, options.requiredMessage, true);
        return;
      }

      if (!EMAIL_RE.test(email)) {
        showStatus(status, options.invalidEmailMessage, true);
        return;
      }

      button.disabled = true;
      button.textContent = options.submittingText;
      hideStatus(status);

      if (!functionUrl) {
        const mailtoBody = `Name: ${name}\nSubject: ${subject}\n\n${message}`;
        const mailto = `mailto:${supportEmail}?subject=${encodeURIComponent(
          `${subject} — ${name}`,
        )}&body=${encodeURIComponent(mailtoBody)}`;

        window.location.href = mailto;
        window.setTimeout(() => {
          showStatus(
            status,
            options.fallbackMessageTemplate.replace('{email}', supportEmail),
            false,
          );
          button.disabled = false;
          button.textContent = options.idleText;
        }, 500);
        return;
      }

      try {
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { apikey: apiKey } : {}),
          },
          body: JSON.stringify({ name, email, subject, message, website }),
        });
        const result = await parseJsonResponse<ContactFormResponse>(response);

        if (result.ok && result.body.success) {
          showStatus(status, options.successMessage, false);
          form.reset();
          return;
        }

        if (result.status === 429) {
          showStatus(status, result.body.message || options.genericErrorMessage, true);
          return;
        }

        showStatus(status, result.body.message || options.genericErrorMessage, true);
      } catch {
        showStatus(status, options.networkErrorMessage, true);
      } finally {
        button.disabled = false;
        button.textContent = options.idleText;
      }
    });
  });
};

export const bootContactForms = (options: ContactFormOptions): void => {
  initContactForms(options);

  if (isBooted) {
    return;
  }

  document.addEventListener('astro:page-load', () => {
    initContactForms(options);
  });
  isBooted = true;
};
