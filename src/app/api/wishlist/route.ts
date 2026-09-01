import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, success, unauthorized, badRequest } from '@/lib/auth-helpers';
import { mapProduct } from '@/lib/mappers/product.mapper';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return unauthorized();

  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            category: true,
            supplier: true,
            images: { orderBy: { order: 'asc' }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return success(items.map((item) => mapProduct(item.product)));
  } catch (error) {
    console.error('Wishlist error:', error);
    return badRequest('Failed to fetch wishlist');
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

    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    });

    if (!existing) {
      await prisma.wishlistItem.create({
        data: { userId: user.id, productId },
      });
    }

    return await GET(request);
  } catch (error) {
    console.error('Wishlist add error:', error);
    return badRequest('Failed to add to wishlist');
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (productId) {
      await prisma.wishlistItem.delete({
        where: { userId_productId: { userId: user.id, productId } },
      });
    } else {
      await prisma.wishlistItem.deleteMany({ where: { userId: user.id } });
    }

    return await GET(request);
  } catch (error) {
    console.error('Wishlist delete error:', error);
    return badRequest('Failed to remove from wishlist');
  }
}
