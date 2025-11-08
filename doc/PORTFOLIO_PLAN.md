# 3Dポートフォリオ計画メモ

## 0. 全体像

- **目的**: Next.js + three.js/R3Fでインタラクティブな3Dヒーロー、ストーリーテリング型スクロール、レスポンシブUIを備えたポートフォリオを構築し、開発力を底上げする。
- **成功指標**: デスクトップLCP 2.5秒以下、Core Web Vitals合格、主要デバイスでのレスポンシブ対応、ヒーロー3D・プロジェクトギャラリー・問い合わせフォームなどのUX要素を定量的に確認できる状態。

## 1. 構成と技術スタック

- Next.js 14 App Router（TypeScript・ESLint・Prettier・モジュールエイリアス込み）。
- UI: Tailwind CSS（もしくはCSS Modules）＋ Framer Motion、Lenisによるスムーススクロール。
- 3D: `@react-three/fiber`、`@react-three/drei`、必要に応じて `three-stdlib`、パラメータ調整用に `leva`。
- データ: プロジェクト情報は MDX/JSON。問い合わせは Server Actions もしくは API Routes + メール送信ライブラリ。
- テスト: クリティカルフローは Playwright、コンポーネントは Jest + React Testing Library。

## 2. 調査・準備タスク

1. 目指すビジュアルのリファレンス収集（スクショ＋モーションのメモ）。
2. R3F（pmndrs examples等）を重点的に研究
   - シーン構造（Canvasのネスト、Suspense境界）
   - アセット読込（GLTF、テクスチャ、Draco圧縮）
   - スクロール連動アニメーション（`useScroll` / `ScrollControls`）
3. Discover three.js や Three.js Journeyでカメラ・ライティング・マテリアルの基礎を掘り下げる。
4. 類似ポートフォリオをDevTools / Lighthouseで計測し、性能目標の基準を把握。

## 3. セクション別要件

| セクション      | UX意図                                    | 技術メモ                                                  |
| --------------- | ----------------------------------------- | --------------------------------------------------------- |
| Hero            | ポインタ反応するロゴ/粒子で第一印象を作る | ビューポート全体Canvas、カスタムシェーダ or InstancedMesh |
| About           | 自己紹介＋数値ハイライト                  | 標準React構成、軽めのモーション                           |
| Timeline/Skills | スクロールで順次表示、スキル強調          | Framer Motionのスタッガー、3Dオービット演出も検討         |
| Projects        | 3D/動画と連動したカード表示               | MDX駆動、必要に応じGLTFプレビュー                         |
| Contact         | フォーム＋SNS、3Dキャラ演出               | Server Action送信、公開時はreCAPTCHA等                    |

## 4. 実装フェーズ

### Phase 0 – 環境整備

- `create-next-app@latest --ts`で初期化し、ESLint/Prettier/lint-stagedを設定。
- Tailwindなどスタイル基盤を導入し、開発サーバー起動を確認。
- 3D関連パッケージ（`@react-three/fiber`, `@react-three/drei`, `three`, `leva`, `framer-motion`, `lenis`）を導入。

### Phase 1 – デザインとコンテンツ

- 各セクションのワイヤーフレーム（Figma/Excalidraw）とインタラクション注釈を作成。
- カラーパレット・タイポグラフィ・3Dシーンのムードボードを決定。
- プロジェクト/タイムライン用の JSON/MDX スキーマを定義。

### Phase 2 – レイアウト & ルーティング

- App Router構造（`app/(site)/page.tsx` など）と共通レイアウトを実装。
- テーマ、Lenisスクロール、モーション設定などのグローバルProviderを用意。
- プレースホルダーを配置し、レスポンシブ挙動を検証。

### Phase 3 – 3D基盤

- R3F Canvasをまとめる `components/canvas/Scene.tsx` を作成し、Suspense境界でラップ。
- 再利用フック（`useSceneStore`, `useWindowSize`, `useFrameLoop` 等）を用意。
- ヒーローシーンのプロトタイプ：カメラ・ライト・仮ジオメトリ・ポインタ反応を実装。

### Phase 4 – コンテンツ & インタラクション

- プレースホルダーを実データ（JSON/MDX）に置き換え。
- Framer Motionでスクロール/リビール演出を追加し、Lenisスクロールを`useScroll`でR3Fに同期。
- プロジェクトカードを作り、ホバー演出や詳細リンクを実装。

### Phase 5 – 高度3D & 仕上げ

- Blender→GLTF/GLB→`gltfjsx`という流れでモデルを導入し、マテリアル/シェーダを調整。
- ノイズ変位やグラデ背景、パーティクル等のシェーダ表現を追加。
- Levaでデバッグ用パネルを用意し、本番ビルドでは非表示にする。

### Phase 6 – フォーム & バックエンド

- Next.js Server ActionsまたはAPI Route + nodemailer/resendで問い合わせフォームを実装。
- Vercel AnalyticsやEdge Functionで訪問ログを記録。

### Phase 7 – パフォーマンス & QA

- 3Dアセット最適化（Draco圧縮、テクスチャ縮小、`renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio))`）。
- dreiの`Html`と`useProgress`でサスペンス用ローダーを実装。
- Lighthouse / WebPageTestで計測し、改善サイクルを回す。
- Playwrightでナビゲーション/フォームのスモークテスト、Jestでユーティリティロジックを検証。

## 5. アセットパイプライン

1. Blenderでモデリング → スケール/原点を調整 → GLB(Draco)でエクスポート。
2. `npx gltfjsx model.glb -o src/components/models/Model.tsx`でJSX化。
3. `<Suspense fallback={<CanvasLoader />}>`で読み込み、生成されたコンポーネント内でマテリアル制御。
4. テクスチャは `public/textures` 配下に格納し、基本は2K未満に抑える。

## 6. インタラクション設計

- スクロール連動ストーリー: `ScrollControls`＋ref経由でカメラ位置を更新。
- ポインタ/タッチ反応: `useCursor`, `useThree`で座標をシーン空間へマッピング。
- マイクロインタラクション: ボタンやカードをFramer Motionで統一感あるeasingに揃え、3Dモーションと同期。

## 7. デプロイ & モニタリング

- 各PRでVercelプレビューを発行し、必要な環境変数（メールAPI・アナリティクス）を設定。
- GitHub Actionsで `npm run lint`, `npm run test`, `npm run build` を自動化。
- デプロイ後はVercel Analyticsを監視し、必要ならSentryでランタイムエラーを捕捉。

## 8. 継続的な学習

- 週1でシェーダー作成やR3Fパターンの深掘り時間を確保。
- 実験結果を `CHANGELOG.md` に記録し、学びを言語化。
- パフォーマンス改善やシェーダースニペットをドキュメント化し、再利用しやすくする。
