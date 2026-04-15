import { EMAIL_RE, parseJsonResponse } from '@/scripts/form-helpers';

const LOGIN_ROOT_SELECTOR = '[data-login-page]';

let isBooted = false;

interface LoginMessages {
  missingEmailMessage: string;
  missingPasswordMessage: string;
  invalidCredentialsMessage: string;
  networkErrorMessage: string;
  submittingText: string;
  successText: string;
  idleText: string;
}

interface MagicLinkMessages {
  missingEmailMessage: string;
  networkErrorMessage: string;
  genericErrorMessage: string;
  submittingText: string;
  successButtonText: string;
  idleText: string;
}

interface LoginFormOptions {
  login: LoginMessages;
  magicLink: MagicLinkMessages;
}

interface LoginResponseBody {
  redirect?: string;
  error?: string;
}

interface MagicLinkResponseBody {
  data?: {
    success?: boolean;
    message?: string;
  } | null;
  error?: {
    message?: string;
  } | null;
}

const initLoginForms = (options: LoginFormOptions): void => {
  const roots = document.querySelectorAll<HTMLElement>(LOGIN_ROOT_SELECTOR);

  roots.forEach((root) => {
    if (root.dataset.loginInitialized === 'true') {
      return;
    }

    const emailInput = document.getElementById('email') as HTMLInputElement | null;
    const passwordInput = document.getElementById('password') as HTMLInputElement | null;
    const loginButton = document.getElementById('login-btn') as HTMLButtonElement | null;
    const loginSpinner = document.getElementById('login-spinner');
    const loginButtonText = document.getElementById('login-btn-text');
    const errorBox = document.getElementById('login-error');
    const errorText = document.getElementById('login-error-text');
    const magicButton = document.getElementById('magic-link-btn') as HTMLButtonElement | null;
    const magicButtonText = document.getElementById('magic-btn-text');
    const magicMessage = document.getElementById('magic-link-msg');
    const togglePasswordButton = document.getElementById('toggle-password');
    const eyeOpen = document.getElementById('eye-open');
    const eyeClosed = document.getElementById('eye-closed');

    if (
      !emailInput ||
      !passwordInput ||
      !loginButton ||
      !loginSpinner ||
      !loginButtonText ||
      !errorBox ||
      !errorText ||
      !magicButton ||
      !magicButtonText ||
      !magicMessage ||
      !togglePasswordButton ||
      !eyeOpen ||
      !eyeClosed
    ) {
      return;
    }

    root.dataset.loginInitialized = 'true';

    const redirect = new URLSearchParams(window.location.search).get('redirect') || '/account';

    const showError = (message: string): void => {
      errorText.textContent = message;
      errorBox.classList.remove('hidden');
    };

    const hideError = (): void => {
      errorBox.classList.add('hidden');
    };

    const showMagicMessage = (message: string, isError: boolean): void => {
      magicMessage.textContent = message;
      magicMessage.className = `mt-3 rounded-lg p-3 text-center text-sm ${
        isError
          ? 'border border-destructive/30 bg-destructive/5 text-destructive'
          : 'border border-primary/30 bg-primary/5 text-foreground'
      }`;
    };

    const hideMagicMessage = (): void => {
      magicMessage.className = 'mt-3 hidden';
      magicMessage.textContent = '';
    };

    const setLoginLoading = (isLoading: boolean, text: string): void => {
      loginButton.disabled = isLoading;
      loginSpinner.classList.toggle('hidden', !isLoading);
      loginButtonText.textContent = text;
    };

    const setMagicLoading = (isLoading: boolean, text: string): void => {
      magicButton.disabled = isLoading;
      magicButtonText.textContent = text;
    };

    const doLogin = async (): Promise<void> => {
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      let shouldResetButton = true;

      if (!email) {
        showError(options.login.missingEmailMessage);
        emailInput.focus();
        return;
      }

      if (!password) {
        showError(options.login.missingPasswordMessage);
        passwordInput.focus();
        return;
      }

      setLoginLoading(true, options.login.submittingText);
      hideError();

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ email, password, redirect }),
        });
        const result = await parseJsonResponse<LoginResponseBody>(response);

        if (result.ok && result.body.redirect) {
          shouldResetButton = false;
          loginButtonText.textContent = options.login.successText;
          window.location.replace(result.body.redirect);
          return;
        }

        showError(result.body.error || options.login.invalidCredentialsMessage);
      } catch {
        showError(options.login.networkErrorMessage);
      } finally {
        if (shouldResetButton) {
          setLoginLoading(false, options.login.idleText);
        }
      }
    };

    const sendMagicLink = async (): Promise<void> => {
      const email = emailInput.value.trim();

      if (!EMAIL_RE.test(email)) {
        showError(options.magicLink.missingEmailMessage);
        emailInput.focus();
        return;
      }

      setMagicLoading(true, options.magicLink.submittingText);
      hideError();
      hideMagicMessage();

      try {
        const response = await fetch('/_actions/auth.sendMagicLink', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({ email }),
        });
        const result = await parseJsonResponse<MagicLinkResponseBody>(response);

        if (result.ok && result.body.data?.success) {
          showMagicMessage(
            result.body.data.message || 'Check your inbox — link sent!',
            false,
          );
          setMagicLoading(true, options.magicLink.successButtonText);
          return;
        }

        const message = result.body.error?.message || options.magicLink.genericErrorMessage;
        showMagicMessage(message, true);
        setMagicLoading(false, options.magicLink.idleText);
      } catch {
        showMagicMessage(options.magicLink.networkErrorMessage, true);
        setMagicLoading(false, options.magicLink.idleText);
      }
    };

    togglePasswordButton.addEventListener('click', () => {
      const isVisible = passwordInput.type === 'text';
      passwordInput.type = isVisible ? 'password' : 'text';
      eyeOpen.classList.toggle('hidden', !isVisible);
      eyeClosed.classList.toggle('hidden', isVisible);
    });

    passwordInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        void doLogin();
      }
    });

    emailInput.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') {
        return;
      }

      if (passwordInput.value.length > 0) {
        void doLogin();
        return;
      }

      passwordInput.focus();
    });

    emailInput.addEventListener('input', () => {
      hideError();
      hideMagicMessage();
      if (!magicButton.disabled || magicButtonText.textContent !== options.magicLink.successButtonText) {
        return;
      }

      setMagicLoading(false, options.magicLink.idleText);
    });

    loginButton.addEventListener('click', () => {
      void doLogin();
    });

    magicButton.addEventListener('click', () => {
      void sendMagicLink();
    });
  });
};

export const bootLoginForms = (options: LoginFormOptions): void => {
  initLoginForms(options);

  if (isBooted) {
    return;
  }

  document.addEventListener('astro:page-load', () => {
    initLoginForms(options);
  });
  isBooted = true;
};
