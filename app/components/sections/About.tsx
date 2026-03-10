'use client';

import { useEffect, useRef, useState } from 'react';
import AboutTypography from '@canvas/AboutTypography';
import { aboutCardData } from '@data/aboutCard';

export default function About() {
  const [isMobile, setIsMobile] = useState(false);
  const [shadow, setShadow] = useState({ x: 40, y: 40 });
  const targetRef = useRef({ x: 40, y: 40 });
  const currentRef = useRef({ x: 40, y: 40 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const normalizedX = (e.clientX - centerX) / centerX;
      const normalizedY = (e.clientY - centerY) / centerY;

      targetRef.current = {
        x: -normalizedX * 40 + 20,
        y: -normalizedY * 30 + 40,
      };
    };

    const animate = () => {
      // Smooth lerp
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.08;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.08;

      setShadow({
        x: Math.round(currentRef.current.x),
        y: Math.round(currentRef.current.y),
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  const effectiveShadow = isMobile ? { x: 24, y: 28 } : shadow;
  const primaryShadowX = Math.round(effectiveShadow.x * 0.65);
  const primaryShadowY = Math.round(effectiveShadow.y * 0.65);
  const accentShadowX = Math.round(effectiveShadow.x * 0.22);
  const accentShadowY = Math.round(effectiveShadow.y * 0.22);
  const cardShadow = isMobile
    ? `${primaryShadowX}px ${primaryShadowY}px 34px rgba(0,0,0,0.58), ${accentShadowX}px ${accentShadowY}px 16px rgba(56,189,248,0.16), 0 0 0 1px rgba(255,255,255,0.14)`
    : `${primaryShadowX}px ${primaryShadowY}px 56px rgba(0,0,0,0.62), ${accentShadowX}px ${accentShadowY}px 26px rgba(56,189,248,0.24), 0 0 0 1px rgba(255,255,255,0.16)`;

  return (
    <section className="relative z-0 mx-auto flex min-h-screen min-w-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 py-16 sm:px-6 sm:py-24">
      {/* <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.12),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.1),transparent_42%),linear-gradient(180deg,rgba(3,7,18,0.45),rgba(3,7,18,0.82))]" /> */}
      {/* 名刺カード */}
      <div data-about-card className="relative z-20 w-[min(92vw,560px)] sm:w-full sm:max-w-lg">
        <div className="aspect-[85/55]">
          <div
            className="h-full w-full bg-zinc-100 text-zinc-900"
            style={{
              background:
                'linear-gradient(145deg, rgba(248,250,252,0.98) 0%, rgba(228,232,238,0.96) 100%)',
              boxShadow: cardShadow,
            }}
          >
            <div className="h-[99.8%] w-[99.8%] border border-zinc-300/60 bg-zinc-50 text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
              <div className="[container-type:inline-size] relative h-full w-full p-[8%]">
                {/* 所属 */}
                <p className="text-[clamp(9px,2.9cqw,17px)] tracking-wide text-zinc-600 max-[390px]:text-[clamp(7px,2.35cqw,13px)] max-[390px]:tracking-normal sm:text-[clamp(10px,3cqw,20px)]">
                  {aboutCardData.affiliation}
                </p>

                {/* 名前行 */}
                <div className="mt-[2%] flex flex-wrap items-end gap-x-[2%] gap-y-[0.8%] sm:flex-nowrap">
                  <h2 className="text-[clamp(18px,5.7cqw,30px)] font-semibold tracking-wide max-[390px]:text-[clamp(14px,4.5cqw,22px)] sm:text-[clamp(20px,6cqw,32px)]">
                    {aboutCardData.name}
                  </h2>
                  <span className="w-full text-[clamp(9px,2.5cqw,15px)] tracking-[0.18em] text-zinc-600 uppercase max-[390px]:text-[clamp(7px,2.05cqw,11px)] max-[390px]:tracking-[0.1em] sm:mb-[1.5%] sm:w-auto sm:text-[clamp(10px,3cqw,20px)] sm:tracking-[0.2em]">
                    {aboutCardData.nameRomanized}
                  </span>
                </div>

                {/* 太いライン */}
                <div className="-ms-[9.7%] mt-[3%] h-[2px] w-full bg-zinc-900" />

                {/* 情報 */}
                <div className="absolute bottom-[10%] max-w-[68%] text-[clamp(9px,2.8cqw,16px)] leading-[1.36] text-zinc-700 max-[390px]:bottom-[8%] max-[390px]:max-w-[66%] max-[390px]:text-[clamp(7px,2.2cqw,11px)] max-[390px]:leading-[1.24] sm:text-[clamp(10px,3cqw,20px)]">
                  {aboutCardData.bioLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>

                {/* 右下ロゴ */}
                <div className="absolute right-[8%] bottom-[8%] text-right">
                  <div className="text-[clamp(22px,4.2cqw,33px)] leading-none font-bold tracking-[-0.08rem] max-[390px]:text-[clamp(16px,3.5cqw,23px)] sm:text-[clamp(26px,4.5cqw,36px)]">
                    {aboutCardData.logoMark}
                  </div>
                  <p className="mt-[2%] text-[clamp(7px,1.2cqw,10px)] tracking-[0.18em] text-zinc-700 uppercase max-[390px]:text-[clamp(6px,0.95cqw,8px)] max-[390px]:tracking-[0.12em] sm:text-[clamp(8px,1.3cqw,12px)] sm:tracking-[0.2em]">
                    {aboutCardData.logoLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 3D背景タイポ */}
      <AboutTypography />
    </section>
  );
}
