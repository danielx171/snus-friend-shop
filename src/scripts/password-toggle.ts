/**
 * Toggle a password input between text and password visibility.
 * Swaps open/closed eye icon elements in sync with the input type.
 */
export function makeToggle(btnId: string, inputId: string, openId: string, closedId: string): void {
  const btn = document.getElementById(btnId);
  const input = document.getElementById(inputId) as HTMLInputElement | null;
  const open = document.getElementById(openId);
  const closed = document.getElementById(closedId);
  if (!btn || !input || !open || !closed) return;
  btn.addEventListener('click', () => {
    const isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';
    open.classList.toggle('hidden', !isText);
    closed.classList.toggle('hidden', isText);
  });
}
