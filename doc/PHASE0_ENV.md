# Phase 0 – 環境整備メモ

## 実施内容

- `create-next-app` (Next.js 16, TypeScript, Tailwind, App Router) で初期化。
- `@react-three/fiber`, `@react-three/drei`, `three`, `leva`, `framer-motion`, `lenis` を導入。
- コード規約: ESLint(Core Web Vitals設定) + Prettier( tailwind プラグイン )。
- Gitフック: Husky + lint-staged で `pre-commit` に `eslint --fix` と `prettier --write` を実行。
- スクリプト: `dev`(Turbopack), `build`, `start`, `lint`, `typecheck`, `format` を追加。

## 使い方

```bash
npm install       # 依存関係の取得 (初回)
npm run dev       # 開発サーバー (localhost:3000)
npm run lint      # ESLint (警告でも失敗)
npm run typecheck # tsconfig による型チェック
npm run format    # Prettier で全体整形
```

## 今後のTODO

- R3F Canvas用のベースコンポーネント (`components/canvas/Scene.tsx`) の雛形作成。
- Lenis / Framer Motion / zustand などのProvider設計。
- Huskyの`core.hooksPath`設定が必要な場合は `git config core.hooksPath .husky` を各自の環境で再実行。
- Tailwind v4のデザイントークン(色/タイポ等)とテーマ変数の定義。
