import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, success, unauthorized, badRequest } from '@/lib/auth-helpers';
import { mapReview } from '@/lib/mappers/review.mapper';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return badRequest('Product ID is required');
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const mapped = reviews.map(mapReview);

    return success(mapped);
  } catch (error) {
    console.error('Reviews error:', error);
    return badRequest('Failed to fetch reviews');
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return unauthorized();

  try {
    const body = await request.json();
    const { productId, rating, title, comment } = body;

    if (!productId || !rating || !comment) {
      return badRequest('Product ID, rating, and comment are required');
    }

    if (rating < 1 || rating > 5) {
      return badRequest('Rating must be between 1 and 5');
    }

    const existing = await prisma.review.findUnique({
      where: { productId_userId: { productId, userId: user.id } },
    });

    if (existing) {
      return badRequest('You have already reviewed this product');
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: user.id,
        rating,
        title: title || null,
        comment,
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    const allReviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length,
      },
    });

    return success(mapReview(review), 201);
  } catch (error) {
    console.error('Review create error:', error);
    return badRequest('Failed to submit review');
  }
}
