'use client';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import Hero from '@components/sections/Hero';

export default function HomePage() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);
  useLayoutEffect(() => {
    if (!heroRef.current) return undefined;
    gsap.set(heroRef.current, { opacity: 0, yPercent: -5 });
    const tween = gsap.to(heroRef.current, {
      opacity: 1,
      yPercent: 0,
      duration: 2.0,
      ease: 'power3.out',
    });
  }, []);
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if (lockRef.current || e.deltaY <= 10) return;
      lockRef.current = true;
      gsap.to(heroRef.current, {
        yPercent: -50,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.inOut',
        onComplete: () => {
          gsap.set(heroRef.current, { autoAlpha: 0 });
          router.push('/about');
        },
        onInterrupt: () => {
          lockRef.current = false;
        },
      });
    };
    window.addEventListener('wheel', handler, { passive: true });
    return () => window.removeEventListener('wheel', handler);
  }, [router]);

  return (
    <main ref={heroRef} className="min-h-screen w-full">
      <Hero />
    </main>
  );
}
