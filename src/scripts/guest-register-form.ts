import { parseJsonResponse } from '@/scripts/form-helpers';

const GUEST_REGISTER_SELECTOR = '[data-guest-register-form]';

let isBooted = false;

interface GuestRegisterOptions {
  passwordTooShortMessage: string;
  submittingText: string;
  idleText: string;
  successMessage: string;
  genericErrorMessage: string;
  networkErrorMessage: string;
}

interface GuestRegisterResponseBody {
  success?: boolean;
  message?: string;
  data?: {
    success?: boolean;
    message?: string;
  } | null;
  error?: {
    message?: string;
  } | null;
}

const initGuestRegisterForms = (options: GuestRegisterOptions): void => {
  const forms = document.querySelectorAll<HTMLFormElement>(GUEST_REGISTER_SELECTOR);

  forms.forEach((form) => {
    if (form.dataset.guestRegisterInitialized === 'true') {
      return;
    }

    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const passwordInput = form.querySelector<HTMLInputElement>('#guest-password');
    const errorElement = form.querySelector<HTMLElement>('#guest-register-error');
    const successElement = form.querySelector<HTMLElement>('#guest-register-success');
    const emailInput = form.querySelector<HTMLInputElement>('[name="email"]');
    const orderIdInput = form.querySelector<HTMLInputElement>('[name="orderId"]');

    if (!button || !passwordInput || !errorElement || !successElement || !emailInput || !orderIdInput) {
      return;
    }

    form.dataset.guestRegisterInitialized = 'true';

    const getResponseMessage = (body: GuestRegisterResponseBody): string | null => {
      if (typeof body.message === 'string' && body.message.length > 0) {
        return body.message;
      }

      if (typeof body.data?.message === 'string' && body.data.message.length > 0) {
        return body.data.message;
      }

      if (typeof body.error?.message === 'string' && body.error.message.length > 0) {
        return body.error.message;
      }

      return null;
    };

    const showError = (message: string): void => {
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
    };

    const hideError = (): void => {
      errorElement.textContent = '';
      errorElement.classList.add('hidden');
    };

    form.addEventListener('input', () => {
      hideError();
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const password = passwordInput.value;
      if (!password || password.length < 8) {
        showError(options.passwordTooShortMessage);
        return;
      }

      button.disabled = true;
      button.textContent = options.submittingText;
      hideError();

      try {
        const response = await fetch('/_actions/auth.guestToAccount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            email: emailInput.value,
            password,
            orderId: orderIdInput.value,
          }),
        });
        const result = await parseJsonResponse<GuestRegisterResponseBody>(response);

        if (result.ok && (result.body.success || result.body.data?.success)) {
          passwordInput.disabled = true;
          button.style.display = 'none';
          successElement.textContent = getResponseMessage(result.body) || options.successMessage;
          successElement.classList.remove('hidden');
          return;
        }

        showError(getResponseMessage(result.body) || options.genericErrorMessage);
      } catch {
        showError(options.networkErrorMessage);
      } finally {
        if (button.style.display !== 'none') {
          button.disabled = false;
          button.textContent = options.idleText;
        }
      }
    });
  });
};

export const bootGuestRegisterForms = (options: GuestRegisterOptions): void => {
  initGuestRegisterForms(options);

  if (isBooted) {
    return;
  }

  document.addEventListener('astro:page-load', () => {
    initGuestRegisterForms(options);
  });
  isBooted = true;
};
