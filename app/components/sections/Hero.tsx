'use client';

import HeroParticles from '@components/canvas/HeroParticles';

export default function Hero() {
  return (
    <section className="relative h-screen w-full">
      <HeroParticles />
      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center text-xs tracking-[0.5rem] text-white/60 uppercase">
        Scroll
      </div>
    </section>
  );
}
