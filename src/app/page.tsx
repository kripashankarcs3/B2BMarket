import { Hero, Categories, FeaturedProducts, FeaturedSuppliers, TrustIndicators, StatsSection, CTASection } from '@/components/landing';

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <FeaturedSuppliers />
      <StatsSection />
      <TrustIndicators />
      <CTASection />
    </>
  );
}
