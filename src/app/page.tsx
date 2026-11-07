import { Hero, FeatureBar, CategoryTiles, TopProducts, WhyUs, ClusterStrip, HowItWorks, FeaturedSuppliers, CTASection } from '@/components/landing';
import { getLandingData } from '@/lib/landing';

// Counts and listings change slowly; rebuild the page at most every 5 minutes.
export const revalidate = 300;

export default async function Home() {
  const data = await getLandingData();

  return (
    <>
      <Hero />
      <FeatureBar verifiedSuppliers={data.stats.verifiedSuppliers} />
      <CategoryTiles categories={data.categories} />
      <TopProducts products={data.topProducts} />
      <WhyUs />
      <HowItWorks />
      <ClusterStrip clusters={data.clusters} />
      <FeaturedSuppliers suppliers={data.suppliers} />
      <CTASection />
    </>
  );
}
