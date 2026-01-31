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

  const cardShadow = `${shadow.x}px ${shadow.y}px 40px rgba(0,0,0,0.35)`;

  return (
    <section
      className="relative -z-10 mx-auto flex min-h-screen min-w-screen items-center justify-center px-6 py-24"
      style={{
        backgroundImage: "url('/paper_nc.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-white/40" />
      {/* 名刺カード */}
      <div className="w-full max-w-lg">
        <div className="aspect-[85/55]">
          <div
            className="h-full w-full bg-white text-zinc-900"
            style={{
              backgroundImage: "url('/paper_nc.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              boxShadow: cardShadow,
            }}
          >
            <div
              className="h-[99.8%] w-[99.8%] bg-white text-zinc-900 shadow-[1px_1px_1px_rgba(0,0,0,0.8)]"
              style={{
                backgroundImage: "url('/paper_bg.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
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
