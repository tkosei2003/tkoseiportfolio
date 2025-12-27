'use client';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import '../globals.css';

export default function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className="min-h-screen bg-black text-white"
        initial={false}
        animate={false}
        //exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 2.0, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
