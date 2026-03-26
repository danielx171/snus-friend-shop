import { toast } from 'sonner';

export function showToast(
  message: string,
  type: 'success' | 'error' | 'info' = 'info',
) {
  toast[type](message);
}

export function cartToast(productName: string) {
  toast.success(`${productName} added to cart`);
}

export { toast };
