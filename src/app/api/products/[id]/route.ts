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
    console.log('🔍 [API /api/products/[id]] id from params:', JSON.stringify(id), 'type:', typeof id);

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

    console.log('🔍 [API /api/products/[id]] findUnique result:', product?.id ?? 'NULL', 'isActive:', product?.isActive);

    if (!product || !product.isActive) {
      console.log('🔍 [API /api/products/[id]] NOT FOUND for id:', id);
      return notFound('Product not found');
    }

    const mapped = mapProduct(product);

    return success(mapped);
  } catch (error) {
    console.error('Product detail error:', error);
    return badRequest('Failed to fetch product');
  }
}
