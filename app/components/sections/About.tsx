'use client';

import { useEffect, useRef, useState } from 'react';
import AboutTypography from '@canvas/AboutTypography';

export default function About() {
  const [shadow, setShadow] = useState({ x: 40, y: 40 });
  const targetRef = useRef({ x: 40, y: 40 });
  const currentRef = useRef({ x: 40, y: 40 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
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
  }, []);

  const primaryShadowX = Math.round(shadow.x * 0.65);
  const primaryShadowY = Math.round(shadow.y * 0.65);
  const accentShadowX = Math.round(shadow.x * 0.22);
  const accentShadowY = Math.round(shadow.y * 0.22);
  const cardShadow = `${primaryShadowX}px ${primaryShadowY}px 56px rgba(0,0,0,0.62), ${accentShadowX}px ${accentShadowY}px 26px rgba(56,189,248,0.24), 0 0 0 1px rgba(255,255,255,0.16)`;

  return (
    <section className="relative z-0 mx-auto flex min-h-screen min-w-screen items-center justify-center overflow-hidden bg-zinc-950 px-6 py-24">
      {/* <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.12),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.1),transparent_42%),linear-gradient(180deg,rgba(3,7,18,0.45),rgba(3,7,18,0.82))]" /> */}
      {/* 名刺カード */}
      <div data-about-card className="relative z-20 w-full max-w-lg">
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
                <p className="text-[clamp(10px,3cqw,20px)] tracking-wide text-zinc-600">
                  大阪公立大学 工学部 情報工学科 4年
                </p>

                {/* 名前行 */}
                <div className="mt-[2%] flex items-end gap-[2%]">
                  <h2 className="text-[clamp(20px,6cqw,32px)] font-semibold tracking-wide">
                    高石 康世
                  </h2>
                  <span className="mb-[1.5%] text-[clamp(10px,3cqw,20px)] tracking-[0.2em] text-zinc-600 uppercase">
                    takaishi kosei
                  </span>
                </div>

                {/* 太いライン */}
                <div className="-ms-[9.7%] mt-[3%] h-[2px] w-full bg-zinc-900" />

                {/* 情報 */}
                <div className="absolute bottom-[10%] text-[clamp(10px,3cqw,20px)] leading-relaxed text-zinc-700">
                  <p>兵庫県出身。</p>
                  <p>大阪公立大学で情報学を専攻。</p>
                  <p>専門は画像処理。</p>
                  <p>アルバイトでアプリケーション開発をしている。</p>
                  <p>趣味は3Dモデリング。</p>
                </div>

                {/* 右下ロゴ */}
                <div className="absolute right-[8%] bottom-[8%] text-right">
                  <div className="text-[clamp(26px,4.5cqw,36px)] leading-none font-bold tracking-[-0.1rem]">
                    M.T
                  </div>
                  <p className="mt-[2%] text-[clamp(8px,1.3cqw,12px)] tracking-[0.2em] text-zinc-700 uppercase">
                    MEISHI
                    <br />
                    TEKINA
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
