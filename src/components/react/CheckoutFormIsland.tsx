import type { ComponentProps } from 'react';
import QueryProvider from '@/components/react/QueryProvider';
import CheckoutForm from '@/components/react/CheckoutForm';

type CheckoutFormProps = ComponentProps<typeof CheckoutForm>;

export default function CheckoutFormIsland(props: CheckoutFormProps) {
  return (
    <QueryProvider>
      <CheckoutForm {...props} />
    </QueryProvider>
  );
}
