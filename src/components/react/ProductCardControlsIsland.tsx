import CardAddToCart from '@/components/react/CardAddToCart';
import CompareToggleButton from '@/components/react/CompareToggleButton';
import WishlistHeartButton from '@/components/react/WishlistHeartButton';

interface ProductCardControlsProps {
  slug: string;
  name: string;
  brand: string;
  imageUrl: string;
  prices: Record<string, number>;
  stock: number;
  nicotineContent: number;
  strengthKey: string;
  flavorKey: string;
  ratings: number;
  badgeKeys: string[];
}

export default function ProductCardControlsIsland(props: ProductCardControlsProps) {
  return (
    <>
      <div className="absolute top-2.5 right-2.5 z-10">
        <WishlistHeartButton slug={props.slug} name={props.name} />
      </div>

      <div className="pt-1">
        <CompareToggleButton slug={props.slug} name={props.name} />
      </div>

      <CardAddToCart
        slug={props.slug}
        name={props.name}
        brand={props.brand}
        imageUrl={props.imageUrl}
        prices={props.prices}
        stock={props.stock}
        nicotineContent={props.nicotineContent}
        strengthKey={props.strengthKey}
        flavorKey={props.flavorKey}
        ratings={props.ratings}
        badgeKeys={props.badgeKeys}
      />
    </>
  );
}
