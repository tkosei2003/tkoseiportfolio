# Hero セクション実装メモ

## 1. 目的

- PCヒーローで「Takaishi Kosei」の立体文字を粒子化し、ポインタ操作や微アニメーションに反応する“最初の印象”を作る。
- WebGL 表現を通して three.js/R3F、シェーダー、パフォーマンス最適化の学習トラックにする。

## 2. 使用スタック

- `@react-three/fiber`：Canvas とレンダーループ。
- `@react-three/drei`：`Text3D`, `Points`, `PointMaterial`, `OrbitControls`, `Html` ローダーなど。
- `three`：`FontLoader`, `TextGeometry`, `Vector3` 操作。
- `framer-motion-3d` or `react-spring`（任意）：セクション全体のフェードやズーム演出。
- `zustand`（後続）：ヒーローと他セクション間の状態共有。

## 3. 実装ステップ

### 3-1. フォント/テキストジオメトリ

1. Blender などで `.typeface.json` をエクスポートし `public/fonts/hero.typeface.json` へ配置。
2. Hero コンポーネントで `const font = useLoader(FontLoader, '/fonts/hero.typeface.json');`。
3. `const textGeometry = useMemo(() => { const geo = new TextGeometry('Takaishi\nKosei', { font, size: 1, height: 0.2, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.005 }); geo.center(); return geo; }, [font]);`
4. 代替案として `Text3D` を `visible={false}` で設置し `ref.current.geometry` を粒子生成に利用。

### 3-2. 粒子化

1. `const positions = useMemo(() => { const arr = textGeometry.attributes.position.array; const step = 3; // 間引き係数 return Float32Array.from({ length: arr.length / step }, (_, i) => arr[i * step]); }, [textGeometry]);`
2. `<Points positions={positions} stride={3}> <PointMaterial size={0.025} sizeAttenuation color="#f7f7f7" transparent depthWrite={false} /> </Points>`
3. 高度化：`shaderMaterial` を自作し、ノイズによる点の揺らぎ・カラーグラデーションを GLSL で制御。
4. 余裕があれば `instancedMesh` で三角形ビルボードを描き、よりリッチなパーティクルに差し替え。

### 3-3. アニメーション/インタラクション

1. `Canvas` の子コンポーネント `HeroPoints` 内で `useFrame(({ clock }) => …)` を使い、ShaderMaterial の `uTime` を更新して呼吸アニメーションを付ける。
2. ホバー反応：`HeroParticles` で `useThree` から `mouse`/`viewport` を受け取り、`pointermove` イベントで 3D 空間のホバー中心 (`hoverTarget`) を計算 → `HeroPoints` に props で渡す。
3. `HeroPoints` 内で `useUniforms` 的な関数を用意し、`hoverTarget` を `uniforms.uHoverCenter` に反映、オン/オフで `uniforms.uHoverStrength` を補間する。ホバーしていないときは `uHoverStrength` を `Math.max(current - delta * restoreSpeed, 0)` で減衰。
4. ShaderMaterial (GLSL) 側では `attribute vec3 initialPosition;` を追加し、ベース形状 → ノイズ → ホバー押し出しの順で `displaced` を決定。`uHoverStrength` が 0 になれば `initialPosition` に戻る実装にする。

## 4. パフォーマンスとフォールバック

- 粒子数は 20k 点以下を目標にし、`step` 間引きや `SimplifyModifier` で調整。
- `<Canvas dpr={[1, 1.5]} performance={{ min: 0.2 }}>` などで DPr/レンダリング負荷を制御。
- `Suspense fallback={<Html>Loading font...</Html>}` でフォントロード時のUXを確保。
- `navigator.connection?.saveData === true` or `prefers-reduced-motion` のときは `<Text>` の2D表現に差し替えるガードを設置。

## 5. 今後のタスク

1. ヒーローで使用するフォント選定と `.typeface.json` の出力。
2. `TextGeometry -> Float32Array` 変換ユーティリティを `lib/three/textToPoints.ts` として整理。
3. pointer 反応（リペル/アトラクション）アルゴリズムの選定。簡易版は頂点ごとの距離計算、将来的にはシェーダー化。
4. `prefers-reduced-motion` チェック用フックの実装（`useReducedMotion`）。
5. Lenis スクロール値との連携でセクション遷移時のアニメーションをどう同期するか検討。
