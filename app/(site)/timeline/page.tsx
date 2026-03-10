'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { setAboutEntryDirection } from '@lib/aboutTransition';

const UP_WHEEL_THRESHOLD = -10;
const SWIPE_THRESHOLD = 50;

export default function TimelinePage() {
  const router = useRouter();
  const timelineRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!timelineRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        timelineRef.current,
        { autoAlpha: 0, y: 32, filter: 'blur(6px)' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power3.out',
        },
      );
    }, timelineRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    router.prefetch('/about');
  }, [router]);

  useEffect(() => {
    const navigateToAbout = () => {
      if (lockRef.current || !timelineRef.current) return;
      lockRef.current = true;
      gsap.to(timelineRef.current, {
        autoAlpha: 0,
        y: 56,
        filter: 'blur(6px)',
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => {
          setAboutEntryDirection('from-top');
          router.replace('/about');
        },
        onInterrupt: () => {
          lockRef.current = false;
        },
      });
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY <= UP_WHEEL_THRESHOLD) {
        navigateToAbout();
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
      if (swipeDelta >= SWIPE_THRESHOLD) {
        navigateToAbout();
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
    <main ref={timelineRef} className="min-h-screen w-full bg-zinc-950 text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-8 py-24">
        <p className="text-xs tracking-[0.36em] text-white/55 uppercase">Next Section</p>
        <h1 className="mt-4 text-5xl tracking-tight sm:text-7xl">Timeline</h1>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
          Timelineセクションの実装はこれから追加予定です。上方向のスクロールまたは下スワイプでAboutへ戻れます。
        </p>
      </section>
    </main>
  );
}
