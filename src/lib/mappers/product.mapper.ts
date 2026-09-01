import { mapSupplier } from './supplier.mapper';

export function mapProduct(p: any) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    shortDescription: p.shortDescription,
    price: p.price,
    minOrder: p.minOrder,
    images: p.images?.map((img: any) => img.url) || [],
    category: p.category,
    categoryId: p.categoryId,
    supplier: p.supplier ? mapSupplier(p.supplier) : undefined,
    supplierId: p.supplierId,
    rating: p.rating,
    reviewCount: p.reviewCount,
    specifications: p.specifications || [],
    moq: p.minOrder,
    tags: p.tags || [],
    featured: p.featured ?? false,
    inStock: p.inStock ?? true,
    stockCount: p.stockCount ?? 0,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    unit: p.unit,
    certifications: p.certifications?.map((c: any) => c.name) || [],
  };
}
