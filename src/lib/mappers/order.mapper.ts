export function mapOrder(order: any) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    items: order.items?.map((item: any) => ({
      product: item.product
        ? {
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            images: item.product.images?.map((img: any) => img.url) || [],
            price: item.product.price,
            moq: item.product.minOrder,
            unit: item.product.unit,
          }
        : undefined,
      quantity: item.quantity,
    })) || [],
    status: order.status.toLowerCase(),
    total: order.total,
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    taxAmount: order.taxAmount,
    createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
    supplierName: order.supplierName,
    supplierId: order.supplierId,
    tracking: order.trackingNumber,
  };
}

export function mapOrderCreated(order: any) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status.toLowerCase(),
    total: order.total,
    createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
  };
}
