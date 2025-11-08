# This Is Start Of My Portfolio

Next.js 16 (App Router) + React Three Fiber を軸にした3Dポートフォリオ。詳細な開発方針は `doc/PORTFOLIO_PLAN.md`・ビジュアル仕様は `doc/VISUAL_PLAN.md` を参照。

## スクリプト

```bash
npm run dev        # Turbopackで開発サーバー起動 (http://localhost:3000)
npm run build      # 本番ビルド
npm run start      # ビルド済みアプリを起動
npm run lint       # ESLint (警告もエラー扱い)
npm run typecheck  # TypeScript型チェック
npm run format     # Prettierで全体整形
```

コミット前は lint-staged により `eslint --fix` と `prettier --write` が自動実行されます。

## ドキュメント

- `doc/PORTFOLIO_PLAN.md`: 全体計画
- `doc/VISUAL_PLAN.md`: ビジュアル仕様 (PC)
- `doc/PHASE0_ENV.md`: 環境構築メモ

## 参考リンク

- [Next.js Docs](https://nextjs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
