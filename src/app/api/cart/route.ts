import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, success, unauthorized, badRequest } from '@/lib/auth-helpers';
import { mapProduct } from '@/lib/mappers/product.mapper';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return unauthorized();

  try {
    const items = await prisma.cartItem.findMany({
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

    const mapped = items.map((item) => ({
      product: mapProduct(item.product),
      quantity: item.quantity,
    }));

    return success(mapped);
  } catch (error) {
    console.error('Cart list error:', error);
    return badRequest('Failed to fetch cart');
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return unauthorized();

  try {
    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || !quantity) {
      return badRequest('Product ID and quantity are required');
    }

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { userId: user.id, productId, quantity },
      });
    }

    return await GET(request);
  } catch (error) {
    console.error('Cart add error:', error);
    return badRequest('Failed to add to cart');
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const body = await request.json();

    if (!productId || !body.quantity) {
      return badRequest('Product ID and quantity are required');
    }

    await prisma.cartItem.update({
      where: { userId_productId: { userId: user.id, productId } },
      data: { quantity: Math.max(1, body.quantity) },
    });

    return await GET(request);
  } catch (error) {
    console.error('Cart update error:', error);
    return badRequest('Failed to update cart');
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (productId) {
      await prisma.cartItem.delete({
        where: { userId_productId: { userId: user.id, productId } },
      });
    } else {
      await prisma.cartItem.deleteMany({ where: { userId: user.id } });
    }

    return await GET(request);
  } catch (error) {
    console.error('Cart delete error:', error);
    return badRequest('Failed to remove from cart');
  }
}


