'use client';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Hero from '@components/sections/Hero';

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    let locked = false;
    const handler = (e: WheelEvent) => {
      if (locked || e.deltaY <= 50) return;
      locked = true;
      router.push('/about');
      setTimeout(() => {
        locked = false;
      }, 800); // 遷移完了まで無視
    };
    window.addEventListener('wheel', handler, { passive: true });
    return () => window.removeEventListener('wheel', handler);
  }, [router]);
  return (
    <motion.main
      key="home"
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -120 }}
      transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-h-screen w-full"
    >
      <Hero />
    </motion.main>
  );
}
