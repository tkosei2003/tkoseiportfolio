'use client';
import type { ReactNode } from 'react';
import SiteHeader from '@components/layout/SiteHeader';
import '../globals.css';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      {children}
    </div>
  );
}
