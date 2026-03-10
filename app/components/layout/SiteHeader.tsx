'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { setAboutEntryDirection } from '@lib/aboutTransition';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/timeline', label: 'Timeline' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const handleAboutLinkClick = () => {
    setAboutEntryDirection(pathname === '/timeline' ? 'from-top' : 'from-bottom');
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <Link
          href="/"
          replace
          className="pointer-events-auto rounded-full border border-white/25 bg-black/60 px-4 py-2 text-xs tracking-[0.28em] uppercase backdrop-blur-md"
        >
          Kosei Port
        </Link>
        <nav className="pointer-events-auto">
          <ul className="flex items-center gap-1 rounded-full border border-white/25 bg-black/60 p-1 backdrop-blur-md">
            {navItems.map((item) => {
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
    </header>
  );
}
