import { Product } from '../redux/productsSlice';
import ProductCard from './ProductCard';
import EmptyState from './EmptyState';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon='🔍'
        title='No products found'
        description='Try adjusting your search or filter criteria'
      />
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
