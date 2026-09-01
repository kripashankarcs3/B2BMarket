import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, success, unauthorized, badRequest } from '@/lib/auth-helpers';
import { mapOrder, mapOrderCreated } from '@/lib/mappers/order.mapper';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return unauthorized();

  try {
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { order: 'asc' }, take: 1 },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const mapped = orders.map(mapOrder);

    return success(mapped);
  } catch (error) {
    console.error('Orders list error:', error);
    return badRequest('Failed to fetch orders');
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return unauthorized();

  try {
    const body = await request.json();
    const { items, shippingAddressId, notes } = body;

    if (!items?.length) {
      return badRequest('Order must contain at least one item');
    }

    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { supplier: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    let subtotal = 0;
    const orderItems = items.map((item: any) => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      const total = product.price * item.quantity;
      subtotal += total;
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        unit: product.unit,
        total,
      };
    });

    const gstRate = products[0]?.gstRate || 18;
    const taxAmount = subtotal * (gstRate / 100);
    const gstAmount = taxAmount;
    const shippingCost = subtotal > 5000 ? 0 : 499;
    const total = subtotal + shippingCost + taxAmount;

    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: 'PENDING',
        items: { create: orderItems },
        subtotal,
        shippingCost,
        taxAmount,
        gstAmount,
        currency: 'INR',
        total,
        supplierId: products[0].supplierId,
        supplierName: products[0].supplier.companyName,
        shippingAddressId: shippingAddressId || null,
        notes: notes || null,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { order: 'asc' }, take: 1 },
              },
            },
          },
        },
      },
    });

    await prisma.cartItem.deleteMany({ where: { userId: user.id } });

    return success(mapOrderCreated(order), 201);
  } catch (error) {
    console.error('Order create error:', error);
    return badRequest('Failed to create order');
  }
}
