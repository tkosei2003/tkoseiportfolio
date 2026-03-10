'use client';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import About from '@components/sections/About';
import { consumeAboutEntryDirection } from '@lib/aboutTransition';

const DOWN_WHEEL_THRESHOLD = 10;
const UP_WHEEL_THRESHOLD = -10;
const SWIPE_THRESHOLD = 50;
const TYPO_ENTRY_OFFSET = 32;
const TYPO_EXIT_OFFSET = 56;

type ExitDirection = 'up' | 'down';

export default function AboutPage() {
  const router = useRouter();
  const aboutRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);
  const inputReadyRef = useRef(false);
  const entryDirectionRef = useRef<ExitDirection | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const getCardElement = () =>
    aboutRef.current?.querySelector<HTMLElement>('[data-about-card]') ?? null;
  const getTypographyElement = () =>
    aboutRef.current?.querySelector<HTMLElement>('[data-about-typography]') ?? null;

  useLayoutEffect(() => {
    const card = getCardElement();
    const typography = getTypographyElement();
    if (!card) return undefined;

    inputReadyRef.current = false;
    const entryDirection =
      entryDirectionRef.current ?? (consumeAboutEntryDirection() === 'from-top' ? 'up' : 'down');
    entryDirectionRef.current = entryDirection;
    const travelDistance = Math.max(window.innerHeight * 0.95, 480);
    const startY = entryDirection === 'up' ? -travelDistance : travelDistance;

    const ctx = gsap.context(() => {
      gsap.set(card, {
        y: startY,
      });
      if (typography) {
        gsap.set(typography, {
          y: entryDirection === 'up' ? -TYPO_ENTRY_OFFSET : TYPO_ENTRY_OFFSET,
          autoAlpha: 0,
          filter: 'blur(6px)',
        });
      }
      const tl = gsap.timeline({
        onComplete: () => {
          inputReadyRef.current = true;
        },
      });
      if (typography) {
        tl.to(typography, {
          y: 0,
          autoAlpha: 0.8,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
      tl.to(
        card,
        {
          y: 0,
          duration: 0.95,
          ease: 'power4.out',
          overwrite: 'auto',
        },
        0.08,
      );
    }, aboutRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    router.prefetch('/');
    router.prefetch('/timeline');
  }, [router]);

  useEffect(() => {
    const navigateWithCardExit = (destination: '/' | '/timeline', direction: ExitDirection) => {
      if (lockRef.current || !inputReadyRef.current) return;
      lockRef.current = true;

      const card = getCardElement();
      const typography = getTypographyElement();
      if (!card) {
        router.replace(destination);
        return;
      }

      const travelDistance = Math.max(window.innerHeight * 0.95, 480);
      const tl = gsap.timeline({
        onComplete: () => {
          router.replace(destination);
        },
      });
      if (typography) {
        tl.to(
          typography,
          {
            y: direction === 'up' ? -TYPO_EXIT_OFFSET : TYPO_EXIT_OFFSET,
            autoAlpha: 0,
            filter: 'blur(6px)',
            duration: 0.45,
            ease: 'power2.inOut',
            overwrite: 'auto',
          },
          0,
        );
      }
      tl.to(
        card,
        {
          y: direction === 'up' ? -travelDistance : travelDistance,
          duration: 0.65,
          ease: 'power3.inOut',
          overwrite: 'auto',
          onInterrupt: () => {
            lockRef.current = false;
          },
        },
        0,
      );
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY >= DOWN_WHEEL_THRESHOLD) {
        navigateWithCardExit('/timeline', 'up');
        return;
      }
      if (e.deltaY <= UP_WHEEL_THRESHOLD) {
        navigateWithCardExit('/', 'down');
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const startY = touchStartYRef.current;
      const endY = e.changedTouches[0]?.clientY;
      touchStartYRef.current = null;

      if (startY == null || endY == null) return;

      const swipeDelta = endY - startY;
      if (swipeDelta <= -SWIPE_THRESHOLD) {
        navigateWithCardExit('/timeline', 'up');
        return;
      }
      if (swipeDelta >= SWIPE_THRESHOLD) {
        navigateWithCardExit('/', 'down');
      }
    };

    const resetTouch = () => {
      touchStartYRef.current = null;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', resetTouch, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', resetTouch);
    };
  }, [router]);

  return (
    <main ref={aboutRef} className="min-h-screen min-w-screen bg-zinc-950">
      <About />
    </main>
  );
}
