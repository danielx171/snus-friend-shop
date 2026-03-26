import React from 'react';
import QueryProvider from './QueryProvider';
import ErrorBoundaryWrapper from './ErrorBoundaryWrapper';
import { ProductReviews } from '@/components/product/ProductReviews';

interface Props {
  productId: string;
}

export default function ProductReviewsIsland({ productId }: Props) {
  return (
    <ErrorBoundaryWrapper componentName="ProductReviews">
      <QueryProvider>
        <ProductReviews productId={productId} />
      </QueryProvider>
    </ErrorBoundaryWrapper>
  );
}
