'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { setAboutEntryDirection } from '@lib/aboutTransition';
import { siteBrandLabel, siteNavItems } from '@data/siteHeader';

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuPath, setMobileMenuPath] = useState<string | null>(null);
  const isMobileMenuOpen = mobileMenuPath === pathname;

  const handleAboutLinkClick = () => {
    setAboutEntryDirection(pathname === '/timeline' ? 'from-top' : 'from-bottom');
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <Link
          href="/"
          replace
          className="pointer-events-auto inline-flex h-10 items-center rounded-full border border-white/25 bg-black/60 px-4 text-xs tracking-[0.28em] uppercase backdrop-blur-md"
        >
          {siteBrandLabel}
        </Link>
        <button
          type="button"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="site-mobile-nav"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setMobileMenuPath((prev) => (prev === pathname ? null : pathname))}
          className={`pointer-events-auto relative inline-flex h-10 w-12 items-center justify-center rounded-full border text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 active:scale-[0.97] sm:hidden ${
            isMobileMenuOpen
              ? 'border-white/45 bg-white/[0.14]'
              : 'border-white/30 bg-white/[0.06] hover:bg-white/[0.12]'
          }`}
        >
          <span className="sr-only">Menu</span>
          <span className="relative h-3.5 w-5">
            <span
              className={`absolute left-0 h-[1.5px] w-5 rounded-full bg-white transition-all duration-300 ${
                isMobileMenuOpen ? 'translate-y-[6px] rotate-45' : 'translate-y-0'
              }`}
            />
            <span
              className={`absolute top-[6px] left-0 h-[1.5px] w-5 rounded-full bg-white transition-all duration-300 ${
                isMobileMenuOpen ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
              }`}
            />
            <span
              className={`absolute top-[12px] left-0 h-[1.5px] w-5 rounded-full bg-white transition-all duration-300 ${
                isMobileMenuOpen ? 'translate-y-[-6px] -rotate-45' : 'translate-y-0'
              }`}
            />
          </span>
        </button>
        <nav className="pointer-events-auto hidden sm:block">
          <ul className="flex items-center gap-1 rounded-full border border-white/25 bg-black/60 p-1 backdrop-blur-md">
            {siteNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    replace
                    onClick={item.href === '/about' ? handleAboutLinkClick : undefined}
                    className={`block rounded-full px-4 py-2 text-xs tracking-[0.22em] uppercase transition ${
                      isActive
                        ? 'bg-white text-zinc-900'
                        : 'text-white/75 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div
        className={`px-4 pb-3 transition-[opacity,transform] duration-300 sm:hidden ${
          isMobileMenuOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <nav
          id="site-mobile-nav"
          className="mx-auto w-full max-w-6xl rounded-2xl border border-white/25 bg-[linear-gradient(180deg,rgba(24,24,24,0.92),rgba(8,8,8,0.88))] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
        >
          <ul className="flex flex-col gap-1">
            {siteNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={`mobile-${item.href}`}>
                  <Link
                    href={item.href}
                    replace
                    onClick={() => {
                      if (item.href === '/about') {
                        handleAboutLinkClick();
                      }
                      setMobileMenuPath(null);
                    }}
                    className={`block rounded-xl px-4 py-3 text-xs tracking-[0.22em] uppercase transition ${
                      isActive
                        ? 'bg-white text-zinc-900'
                        : 'text-white/80 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
