export default function About() {
  return (
    <section className="relative mx-auto flex min-h-screen max-w-5xl items-center px-6 py-24">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
        {/* 名刺カード */}
        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.6)] backdrop-blur">
          <p className="text-xs tracking-[0.3rem] text-white/60 uppercase">About</p>
          <h2 className="mt-4 text-2xl font-semibold text-white">Takaishi Kosei</h2>
          <p className="mt-3 text-sm leading-7 text-white/70">
            兵庫県出身。エンジニア志望。大阪公立大学にて情報工学を勉強中。
          </p>
          {/* <h2 className="mt-6 text-xl font-medium text-white">Skills</h2>
                    <h2 className="mt-4 text-sm font-medium text-white/80">研究</h2>
                    <ul className="mt-2 flex flex-wrap gap-2">
                        {['Python'].map((skill) => (
                            <li
                                key={skill}
                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80"
                            >
                                {skill}
                            </li>
                        ))}
                    </ul>
                    <h2 className="mt-4 text-sm font-medium text-white/80">インターンシップ</h2>
                    <ul className="mt-2 flex flex-wrap gap-2">
                        {['Python', 'Dart', 'Flutter', 'JavaScript', 'HTML'].map((skill) => (
                            <li
                                key={skill}
                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80"
                            >
                                {skill}
                            </li>
                        ))}
                    </ul>
                    <h2 className="mt-4 text-sm font-medium text-white/80">個人開発＆趣味</h2>
                    <ul className="mt-2 flex flex-wrap gap-2">
                        {['TypeScript', 'React', 'Next.js', 'Three.js', 'Blender'].map((skill) => (
                            <li
                                key={skill}
                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80"
                            >
                                {skill}
                            </li>
                        ))}
                    </ul> */}
        </div>
        {/* 背景オブジェクトや縦見出しは後で追加 */}
      </div>
    </section>
  );
}
