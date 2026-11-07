'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Pause, Play } from 'lucide-react';
import { Container } from '@/components/ui';

const INTERVAL_MS = 5000;
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export interface HeroImage {
  src: string;
  alt: string;
}

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/**
 * Photo panel on the right of the hero, cross-fading between images. It dissolves into the page
 * background through a CSS mask. Rotation stops when the viewer pauses it, hovers or focuses the
 * controls, scrolls it off screen, or prefers reduced motion.
 */
export function HeroSlider({ images }: { images: HeroImage[] }) {
  const [index, setIndex] = useState(0);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia(REDUCED_MOTION).matches, () => false);
  const [choice, setChoice] = useState<boolean | null>(null);
  const playing = choice ?? !reducedMotion;
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const count = images.length;

  const go = useCallback((next: number) => setIndex((next + count) % count), [count]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || held || !visible || count < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % count);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [playing, held, visible, count]);

  if (count === 0) return null;

  return (
    <div
      ref={rootRef}
      className="relative h-60 sm:h-72 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[50%] xl:w-[56%]"
    >
      <div className="hero-fade absolute inset-0" aria-hidden>
        {images.map((image, i) => (
          <img
            key={image.src}
            src={image.src}
            alt=""
            loading={i === 0 ? 'eager' : 'lazy'}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out motion-reduce:transition-none ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
      <span className="sr-only" aria-live={playing ? 'off' : 'polite'}>{images[index].alt}</span>

      {count > 1 && (
        <div
          className="absolute inset-x-0 bottom-16 z-10 lg:bottom-20"
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={() => setHeld(false)}
        >
          <Container className="flex justify-end">
            <div className="flex items-center gap-0.5" role="group" aria-label="Slideshow controls">
              <button
                type="button"
                onClick={() => setChoice(!playing)}
                aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
                className="flex h-8 w-8 items-center justify-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
              >
                {playing ? <Pause size={14} aria-hidden /> : <Play size={14} aria-hidden />}
              </button>
              {images.map((image, i) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show photo ${i + 1}: ${image.alt}`}
                  aria-current={i === index}
                  className="group flex h-8 w-6 items-center justify-center"
                >
                  <span
                    className={`block h-1 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.4)] transition-all ${
                      i === index ? 'w-6 bg-white' : 'w-3 bg-white/60 group-hover:bg-white'
                    }`}
                  />
                </button>
              ))}
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}
