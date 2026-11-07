import { prisma } from '@/lib/prisma';
import { mapProduct } from '@/lib/mappers/product.mapper';
import { mapSupplier } from '@/lib/mappers/supplier.mapper';
import type { Product, Supplier } from '@/types';

/** India's best-known manufacturing clusters and what they are known for. */
const CLUSTERS: { city: string; specialty: string }[] = [
  { city: 'Tiruppur', specialty: 'Knitwear and garments' },
  { city: 'Surat', specialty: 'Synthetic fabrics and sarees' },
  { city: 'Moradabad', specialty: 'Brassware and metal crafts' },
  { city: 'Ludhiana', specialty: 'Hosiery and cycle parts' },
  { city: 'Rajkot', specialty: 'Engineering and auto parts' },
  { city: 'Jaipur', specialty: 'Handicrafts and jewellery' },
  { city: 'Chennai', specialty: 'Automotive components' },
  { city: 'Ahmedabad', specialty: 'Chemicals and textiles' },
];

/** Hand-picked cover photo per top-level category, so cards stay consistent when top-rated products change. */
const CATEGORY_PHOTOS: Record<string, string> = {
  apparel: '/products/cotton-handloom-saree/1.jpg',
  electronics: '/products/crompton-led-strip-5m/1.jpg',
  construction: '/products/jsw-tmt-fe-500d-12mm/1.jpg',
  'leather-textiles': '/products/cotton-shirting-fabric-44/1.jpg',
  'food-beverages': '/products/mdh-turmeric-powder-500g/1.jpg',
  'home-kitchen': '/products/milton-steel-tiffin-3-tier/1.jpg',
  'medical-healthcare': '/products/dr-morepen-glucometer/1.jpg',
  automotive: '/products/bosch-car-battery-12v-35ah/1.jpg',
};

export interface Cluster {
  city: string;
  state: string;
  specialty: string;
  suppliers: number;
  products: number;
}

/** A category with its live product count. */
export interface CategoryLink {
  slug: string;
  name: string;
  products: number;
}

/** A top-level category, with the photo of its best-rated product for category cards. */
export interface RootCategory extends CategoryLink {
  image?: string;
}

export interface LandingData {
  stats: { products: number; verifiedSuppliers: number; cities: number };
  clusters: Cluster[];
  categories: RootCategory[];
  /** Best-rated products overall, one per distinct product name. */
  topProducts: Product[];
  suppliers: Supplier[];
}

/** Keeps the first product of each name, so one item listed by many suppliers shows once. */
function uniqueByName(products: Product[]): Product[] {
  const seen = new Set<string>();
  return products.filter((p) => !seen.has(p.name) && seen.add(p.name));
}

export async function getLandingData(): Promise<LandingData> {
  const [products, verifiedSuppliers, cityRows, categoryRows, counts, pool, topSuppliers] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.supplier.count({ where: { isVerified: true } }),
    prisma.supplier.groupBy({
      by: ['city', 'state'],
      _count: { _all: true },
      _sum: { productCount: true },
    }),
    prisma.category.findMany({ select: { id: true, slug: true, name: true, parentId: true } }),
    prisma.product.groupBy({
      by: ['categoryId'],
      where: { isActive: true },
      _count: { _all: true },
    }),
    prisma.product.findMany({
      where: { isActive: true, inStock: true, images: { some: {} } },
      include: {
        category: true,
        supplier: true,
        images: { orderBy: { order: 'asc' }, take: 1 },
      },
      orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
      take: 400,
    }),
    prisma.supplier.findMany({
      where: { isVerified: true, isPremium: true },
      include: { certifications: true },
      orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
      take: 6,
    }),
  ]);

  const byCity = new Map(cityRows.map((row) => [row.city, row]));
  const clusters = CLUSTERS.flatMap(({ city, specialty }) => {
    const row = byCity.get(city);
    if (!row) return [];
    return [{ city, state: row.state, specialty, suppliers: row._count._all, products: row._sum.productCount ?? 0 }];
  });

  // Real product counts per category; the stored Category.productCount can drift from the catalogue.
  const countById = new Map(counts.map((c) => [c.categoryId, c]));
  const roots = categoryRows.filter((c) => !c.parentId);
  const childrenOf = (id: string) => categoryRows.filter((c) => c.parentId === id);
  const countOf = (id: string) => countById.get(id)?._count._all ?? 0;

  const items = uniqueByName(pool.map(mapProduct) as Product[]);
  const rootIdOf = new Map(categoryRows.map((c) => [c.id, c.parentId ?? c.id]));

  const categories: RootCategory[] = roots
    .map((root) => ({
      slug: root.slug,
      name: root.name,
      products: countOf(root.id) + childrenOf(root.id).reduce((sum, c) => sum + countOf(c.id), 0),
      image: CATEGORY_PHOTOS[root.slug] ?? items.find((p) => rootIdOf.get(p.categoryId) === root.id)?.images[0],
    }))
    .sort((a, b) => b.products - a.products || a.name.localeCompare(b.name));

  return {
    stats: { products, verifiedSuppliers, cities: new Set(cityRows.map((r) => r.city)).size },
    clusters,
    categories,
    topProducts: items.slice(0, 8),
    suppliers: topSuppliers.map(mapSupplier) as Supplier[],
  };
}
