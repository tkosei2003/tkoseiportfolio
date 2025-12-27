'use client';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import About from '@components/sections/About';

export default function AboutPage() {
  const router = useRouter();
  const aboutRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);

  useLayoutEffect(() => {
    if (!aboutRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(aboutRef.current, { opacity: 0, yPercent: 10 });
      const tween = gsap.to(aboutRef.current, {
        opacity: 1,
        yPercent: 0,
        duration: 1.5,
        ease: 'power3.in',
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if (lockRef.current || e.deltaY >= -10) return;
      lockRef.current = true;
      gsap.to(aboutRef.current, {
        yPercent: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.inOut',
        onComplete: () => {
          gsap.set(aboutRef.current, { autoAlpha: 0 });
          router.push('/');
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
    <main ref={aboutRef} className="min-h-screen w-full">
      <About />
    </main>
  );
}
