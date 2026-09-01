import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, badRequest } from '@/lib/auth-helpers';
import { mapProduct } from '@/lib/mappers/product.mapper';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize')) || 24));
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const categories = searchParams.get('categories') || '';
    const minPrice = Number(searchParams.get('minPrice')) || undefined;
    const maxPrice = Number(searchParams.get('maxPrice')) || undefined;
    const minRating = Number(searchParams.get('minRating')) || undefined;
    const supplierId = searchParams.get('supplierId') || '';
    const featured = searchParams.get('featured') === 'true';
    const relatedTo = searchParams.get('relatedTo') || '';
    const sortBy = searchParams.get('sortBy') || 'recommended';

    const prismaWhere: Record<string, unknown> = { isActive: true };

    if (search) {
      prismaWhere.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      prismaWhere.categoryId = category;
    }

    if (categories) {
      prismaWhere.categoryId = { in: categories.split(',') };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (minPrice !== undefined) priceFilter.gte = minPrice;
      if (maxPrice !== undefined) priceFilter.lte = maxPrice;
      prismaWhere.price = priceFilter;
    }

    if (minRating) {
      prismaWhere.rating = { gte: minRating };
    }

    if (supplierId) {
      prismaWhere.supplierId = supplierId;
    }

    if (featured) {
      prismaWhere.featured = true;
    }

    if (relatedTo) {
      prismaWhere.id = { not: relatedTo };
    }

    let orderBy: Record<string, string>[] = [];
    switch (sortBy) {
      case 'price_asc':
        orderBy = [{ price: 'asc' }];
        break;
      case 'price_desc':
        orderBy = [{ price: 'desc' }];
        break;
      case 'rating':
        orderBy = [{ rating: 'desc' }];
        break;
      case 'newest':
        orderBy = [{ createdAt: 'desc' }];
        break;
      default:
        orderBy = [{ featured: 'desc' }, { rating: 'desc' }];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: prismaWhere as any,
        include: {
          category: true,
          supplier: true,
          images: { orderBy: { order: 'asc' } },
          specifications: true,
          certifications: true,
          bulkPrices: { orderBy: { minQty: 'asc' } },
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where: prismaWhere as any }),
    ]);

    const mapped = products.map(mapProduct);

    return success({
      products: mapped,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Products list error:', error);
    return badRequest('Failed to fetch products');
  }
}
