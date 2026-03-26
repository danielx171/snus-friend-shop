import { atom } from 'nanostores';

export const $mobileMenuOpen = atom(false);

export function openMobileMenu() {
  $mobileMenuOpen.set(true);
}

export function closeMobileMenu() {
  $mobileMenuOpen.set(false);
}
