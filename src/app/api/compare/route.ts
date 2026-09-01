import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, success, unauthorized, badRequest } from '@/lib/auth-helpers';
import { mapProduct } from '@/lib/mappers/product.mapper';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return unauthorized();

  try {
    const items = await prisma.compareItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            category: true,
            supplier: true,
            images: { orderBy: { order: 'asc' } },
            specifications: true,
            certifications: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return success(items.map((item) => mapProduct(item.product)));
  } catch (error) {
    console.error('Compare error:', error);
    return badRequest('Failed to fetch compare list');
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return unauthorized();

  try {
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return badRequest('Product ID is required');
    }

    const count = await prisma.compareItem.count({ where: { userId: user.id } });
    if (count >= 4) {
      return badRequest('Maximum 4 products can be compared at once');
    }

    const existing = await prisma.compareItem.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    });

    if (!existing) {
      await prisma.compareItem.create({
        data: { userId: user.id, productId },
      });
    }

    return await GET(request);
  } catch (error) {
    console.error('Compare add error:', error);
    return badRequest('Failed to add to compare');
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (productId) {
      await prisma.compareItem.delete({
        where: { userId_productId: { userId: user.id, productId } },
      });
    } else {
      await prisma.compareItem.deleteMany({ where: { userId: user.id } });
    }

    return await GET(request);
  } catch (error) {
    console.error('Compare delete error:', error);
    return badRequest('Failed to remove from compare');
  }
}
