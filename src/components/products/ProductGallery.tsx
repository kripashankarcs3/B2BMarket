'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  const next = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-square rounded-[20px] bg-apple-gray-50 overflow-hidden cursor-crosshair group"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={imgError[activeIndex] ? `https://placehold.co/800x800/e8e8ed/86868b?text=${productName[0]}` : images[activeIndex]}
            alt={`${productName} - Image ${activeIndex + 1}`}
            className={cn('w-full h-full object-cover apple-transition', isZoomed && 'scale-150')}
            style={isZoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onError={() => setImgError((prev) => ({ ...prev, [activeIndex]: true }))}
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 apple-transition hover:bg-white"
            >
              <ChevronLeft size={18} className="text-apple-gray-600" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 apple-transition hover:bg-white"
            >
              <ChevronRight size={18} className="text-apple-gray-600" />
            </button>
          </>
        )}

        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 apple-transition hover:bg-white">
          <Maximize2 size={14} className="text-apple-gray-600" />
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'w-1.5 h-1.5 rounded-full apple-transition',
                i === activeIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/70'
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              'w-16 h-16 sm:w-20 sm:h-20 rounded-[12px] overflow-hidden border-2 apple-transition shrink-0',
              i === activeIndex ? 'border-apple-blue' : 'border-transparent hover:border-apple-gray-200'
            )}
          >
            <img
              src={imgError[i] ? `https://placehold.co/200x200/e8e8ed/86868b?text=${i + 1}` : img}
              alt=""
              className="w-full h-full object-cover"
              onError={() => setImgError((prev) => ({ ...prev, [i]: true }))}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
