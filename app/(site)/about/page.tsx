'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import About from '@components/sections/About';

export default function AboutPage() {
  const router = useRouter();
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if (e.deltaY < -50) router.push('/');
    };
    window.addEventListener('wheel', handler, { passive: true });
    return () => window.removeEventListener('wheel', handler);
  }, [router]);

  return <About />;
}
