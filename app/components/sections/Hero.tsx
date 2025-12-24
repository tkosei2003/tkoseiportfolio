'use client';
import HeroParticles from '@components/canvas/HeroParticles';

export default function Hero() {
  return (
    <section className="relative h-screen w-full">
      <HeroParticles />
      <div className="pointer-events-none absolute inset-x-0 bottom-20 flex justify-center text-xs tracking-[0.5rem] text-white/60 uppercase">
        Scroll
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-15 flex justify-center">
        <div className="arrow">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </section>
  );
}
