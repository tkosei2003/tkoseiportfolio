export default function About() {
  const blocks = [
    { label: '研究', items: ['Python'] },
    { label: 'インターン', items: ['Python', 'Flutter', 'Dart', 'JS'] },
    { label: '個人開発', items: ['Next.js', 'Three.js', 'Blender'] },
  ];
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
            className="h-full w-full bg-white text-zinc-900 shadow-[40px_40px_40px_rgba(0,0,0,0.35)]"
            style={{
              backgroundImage: "url('/paper_nc.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
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
      {/* 背景タイポ */}
      <div className="pointer-events-none absolute top-0 left-0 -z-10 text-[clamp(120px,33vw,650px)] leading-none font-black tracking-[-0.07em] text-black">
        <span
          className="inline-block -translate-x-[3%] -translate-y-[15%]"
          style={{
            textShadow: '-2px -2px 3px rgba(0,0,0,0.35), -2px -2px 3px rgba(0,0,0,0.35)',
          }}
        >
          ABOUT
        </span>
      </div>
    </section>
  );
}
