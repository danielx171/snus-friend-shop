const WAITLIST_FORM_SELECTOR = '[data-waitlist-form]';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let isBooted = false;

const getButtonText = (button: HTMLButtonElement | HTMLInputElement): string =>
  button instanceof HTMLInputElement ? button.value : button.textContent || '';

const setButtonText = (button: HTMLButtonElement | HTMLInputElement, text: string): void => {
  if (button instanceof HTMLInputElement) {
    button.value = text;
    return;
  }

  button.textContent = text;
};

const parseJsonResponse = async (response: Response): Promise<{ ok: boolean; data: Record<string, unknown> }> => {
  const text = await response.text();
  let data: Record<string, unknown> = {};

  try {
    data = text ? JSON.parse(text) as Record<string, unknown> : {};
  } catch {
    data = {};
  }

  return { ok: response.ok, data };
};

const clearMessage = (
  input: HTMLInputElement,
  message: HTMLElement,
  baseMessageClass: string,
): void => {
  message.textContent = '';
  message.className = `${baseMessageClass} hidden`;
  message.removeAttribute('role');
  message.setAttribute('aria-live', 'polite');
  input.removeAttribute('aria-invalid');
};

const showMessage = (
  input: HTMLInputElement,
  message: HTMLElement,
  baseMessageClass: string,
  text: string,
  isError: boolean,
): void => {
  message.textContent = text;
  message.className = `${baseMessageClass} ${isError ? 'text-destructive' : 'text-success'}`;
  message.setAttribute('role', isError ? 'alert' : 'status');
  message.setAttribute('aria-live', isError ? 'assertive' : 'polite');

  if (isError) {
    input.setAttribute('aria-invalid', 'true');
  } else {
    input.removeAttribute('aria-invalid');
  }
};

const initWaitlistForms = (): void => {
  const forms = document.querySelectorAll<HTMLFormElement>(WAITLIST_FORM_SELECTOR);

  forms.forEach((form) => {
    if (form.dataset.waitlistInitialized === 'true') {
      return;
    }

    const input = form.querySelector<HTMLInputElement>('input[type="email"]');
    const button = form.querySelector<HTMLButtonElement | HTMLInputElement>('button[type="submit"], input[type="submit"]');
    const message = form.querySelector<HTMLElement>('[data-waitlist-message]');
    const functionBase = form.dataset.functionBase || '';
    const source = form.dataset.waitlistSource || 'newsletter';
    const submittingText = form.dataset.submittingText || 'Submitting...';
    const successMessage = form.dataset.successMessage || "You're in! Check your inbox.";
    const baseMessageClass = form.dataset.messageClass || 'mt-2 text-xs';

    if (!input || !button || !message) {
      return;
    }

    const defaultButtonText = getButtonText(button);
    form.dataset.waitlistInitialized = 'true';

    input.addEventListener('input', () => {
      clearMessage(input, message, baseMessageClass);
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = input.value.trim();

      if (!EMAIL_RE.test(email)) {
        showMessage(input, message, baseMessageClass, 'Please enter a valid email.', true);
        return;
      }

      if (!functionBase) {
        showMessage(input, message, baseMessageClass, 'Service unavailable.', true);
        return;
      }

      button.disabled = true;
      setButtonText(button, submittingText);

      try {
        const response = await fetch(`${functionBase}/functions/v1/save-waitlist-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, source }),
        });
        const result = await parseJsonResponse(response);

        if (result.ok) {
          showMessage(input, message, baseMessageClass, successMessage, false);
          input.value = '';
          return;
        }

        const error =
          typeof result.data.error === 'string'
            ? result.data.error
            : 'Something went wrong.';
        showMessage(input, message, baseMessageClass, error, true);
      } catch {
        showMessage(input, message, baseMessageClass, 'Network error — try again.', true);
      } finally {
        button.disabled = false;
        setButtonText(button, defaultButtonText);
      }
    });
  });
};

export const bootWaitlistForms = (): void => {
  initWaitlistForms();

  if (isBooted) {
    return;
  }

  document.addEventListener('astro:page-load', initWaitlistForms);
  isBooted = true;
};
