import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, notFound, badRequest } from '@/lib/auth-helpers';
import { mapProduct } from '@/lib/mappers/product.mapper';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: { include: { certifications: true } },
        images: { orderBy: { order: 'asc' } },
        specifications: true,
        certifications: true,
        bulkPrices: { orderBy: { minQty: 'asc' } },
      },
    });

    if (!product || !product.isActive) {
      return notFound('Product not found');
    }

    const mapped = mapProduct(product);

    return success(mapped);
  } catch (error) {
    console.error('Product detail error:', error);
    return badRequest('Failed to fetch product');
  }
}
