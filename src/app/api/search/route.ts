import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, badRequest } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    if (!q || q.length < 2) {
      return success([]);
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { tags: { hasSome: [q] } },
          { shortDescription: { contains: q, mode: 'insensitive' } },
        ],
      },
      include: {
        category: true,
        supplier: true,
        images: { orderBy: { order: 'asc' }, take: 1 },
      },
      take: 10,
    });

    const mapped = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      minOrder: p.minOrder,
      images: p.images.map((img) => img.url),
      category: p.category,
      supplier: { id: p.supplier.id, name: p.supplier.companyName },
      moq: p.minOrder,
      unit: p.unit,
    }));

    return success(mapped);
  } catch (error) {
    console.error('Search error:', error);
    return badRequest('Search failed');
  }
}
