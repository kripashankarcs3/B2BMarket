import { ProductCard } from '@/components/products/ProductCard';
import { Container, SectionHeader } from '@/components/ui';
import type { Product } from '@/types';

export function TopProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="border-y border-ink-200 bg-white py-14 sm:py-16">
      <Container>
        <SectionHeader
          title="Top-rated products"
          description="In stock now, from suppliers with the best buyer reviews."
          action={{ label: 'Browse all products', href: '/products' }}
          className="mb-6"
        />
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
