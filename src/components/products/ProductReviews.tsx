'use client';

import { useState } from 'react';
import { Star, ThumbsUp, ChevronDown } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { cn, formatDate } from '@/lib/utils';
import { reviews } from '@/lib/data';
import type { Review } from '@/types';

interface ProductReviewsProps {
  productId: string;
  rating: number;
  reviewCount: number;
}

export function ProductReviews({ productId, rating, reviewCount }: ProductReviewsProps) {
  const [showAll, setShowAll] = useState(false);
  const productReviews = reviews.filter((r) => r.productId === productId);
  const displayed = showAll ? productReviews : productReviews.slice(0, 3);

  const ratingDistribution = [0, 0, 0, 0, 0];
  productReviews.forEach((r) => { ratingDistribution[r.rating - 1]++; });

  return (
    <div>
      <h3 className="text-base font-semibold text-apple-gray-900 mb-6">
        Customer Reviews ({reviewCount})
      </h3>

      <div className="flex items-start gap-8 mb-8 p-5 bg-apple-gray-50 rounded-[16px]">
        <div className="text-center">
          <p className="text-4xl font-bold text-apple-gray-900">{rating}</p>
          <div className="flex items-center gap-0.5 mt-1 justify-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className={i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'fill-apple-gray-200 text-apple-gray-200'} />
            ))}
          </div>
          <p className="text-xs text-apple-gray-400 mt-1">{reviewCount} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="text-apple-gray-500 w-3">{star}</span>
              <div className="flex-1 h-2 rounded-full bg-apple-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-400 apple-transition"
                  style={{ width: `${(ratingDistribution[star - 1] / Math.max(productReviews.length, 1)) * 100}%` }}
                />
              </div>
              <span className="text-apple-gray-400 w-6 text-right">{ratingDistribution[star - 1]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {displayed.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {productReviews.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-2 mt-6 text-sm font-medium text-apple-blue hover:text-apple-blue-dark apple-transition"
        >
          {showAll ? 'Show Less' : `View All ${productReviews.length} Reviews`}
          <ChevronDown size={16} className={cn('apple-transition', showAll && 'rotate-180')} />
        </button>
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted, setVoted] = useState(false);

  return (
    <div className="p-5 border border-apple-gray-100 rounded-[16px]">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-apple-gray-100 overflow-hidden shrink-0">
          {review.userAvatar ? (
            <img src={review.userAvatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-medium text-apple-gray-500">
              {review.userName[0]}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-apple-gray-900">{review.userName}</p>
            <span className="text-xs text-apple-gray-400">{formatDate(review.date)}</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-apple-gray-100 text-apple-gray-100'} />
            ))}
          </div>
        </div>
      </div>
      <h4 className="text-sm font-medium text-apple-gray-900 mb-1">{review.title}</h4>
      <p className="text-sm text-apple-gray-500 leading-relaxed mb-3">{review.comment}</p>
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-3">
          {review.images.map((img, i) => (
            <img key={i} src={img} alt="" className="w-16 h-16 rounded-[10px] object-cover" />
          ))}
        </div>
      )}
      <button
        onClick={() => { if (!voted) { setHelpful(helpful + 1); setVoted(true); } }}
        className={cn(
          'flex items-center gap-1.5 text-xs apple-transition',
          voted ? 'text-apple-blue' : 'text-apple-gray-400 hover:text-apple-gray-600'
        )}
      >
        <ThumbsUp size={13} />
        Helpful ({helpful})
      </button>
    </div>
  );
}
