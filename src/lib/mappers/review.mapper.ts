export function mapReview(r: any) {
  return {
    id: r.id,
    productId: r.productId,
    userId: r.userId,
    userName: r.user?.name,
    userAvatar: r.user?.avatar || '',
    rating: r.rating,
    title: r.title || '',
    comment: r.comment,
    date: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
    helpful: r.helpful,
    images: r.images || [],
  };
}
