import React from 'react';
import { Toaster } from 'sonner';

const ToastProvider: React.FC = () => (
  <Toaster position="bottom-right" theme="dark" richColors closeButton />
);

export default React.memo(ToastProvider);
