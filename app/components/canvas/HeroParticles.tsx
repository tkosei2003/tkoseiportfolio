'use client';

import { Canvas, useLoader, useFrame, ThreeEvent } from '@react-three/fiber';
import { Suspense, useRef, useMemo } from 'react';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import * as THREE from 'three';
import { heroVertexShader, heroFragmentShader } from '@shaders/hero';

export default function HeroParticles() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 1.5]} className="h-full w-full">
      <color attach="background" args={['#050505']} />
      <Suspense fallback={null}>
        <HeroPoints />
      </Suspense>
    </Canvas>
  );
}

function HeroPoints() {
  const hoverTarget = useRef(new THREE.Vector3());
  const hovering = useRef(false);
  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    hoverTarget.current.copy(event.point);
  };
  const handlePointerOver = () => {
    hovering.current = true;
  };
  const handlePointerOut = () => {
    hovering.current = false;
  };
  // テキストジオメトリを作成
  const font = useLoader(FontLoader, '/fonts/Hero.json');
  const geometry = useMemo(() => {
    const geo = new TextGeometry('Sample\nCode', {
      font,
      size: 1,
      depth: 0.1, // 厚みを0.1にする
      bevelEnabled: false,
    });
    geo.center();
    return geo;
  }, [font]);
  // ジオメトリから面積に基づいてサンプリングした頂点位置を取得
  const sampledPositions = useMemo(() => {
    const nonIndexed = geometry.toNonIndexed();
    const pos = nonIndexed.attributes.position.array;
    const triangleCount = pos.length / 9;
    const areas: number[] = new Array(triangleCount);
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    const ab = new THREE.Vector3();
    const ac = new THREE.Vector3();

    let totalArea = 0;
    for (let i = 0; i < triangleCount; i++) {
      const base = i * 9;
      a.set(pos[base], pos[base + 1], pos[base + 2]);
      b.set(pos[base + 3], pos[base + 4], pos[base + 5]);
      c.set(pos[base + 6], pos[base + 7], pos[base + 8]);
      ab.copy(b).sub(a);
      ac.copy(c).sub(a);
      const area = ab.clone().cross(ac).length() * 0.5;
      areas[i] = area;
      totalArea += area;
    }
    // 総面積に基づいて各三角形からサンプリングする点の数を決定
    const targetPointCount = 10000;
    const samples: number[] = [];
    const tempA = new THREE.Vector3();
    const tempB = new THREE.Vector3();
    const tempC = new THREE.Vector3();
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    // 各三角形から面積比に応じた数の点をサンプリング
    for (let i = 0; i < triangleCount; i++) {
      const base = i * 9;
      tempA.set(pos[base], pos[base + 1], pos[base + 2]);
      tempB.set(pos[base + 3], pos[base + 4], pos[base + 5]);
      tempC.set(pos[base + 6], pos[base + 7], pos[base + 8]);

      const sampleCount = Math.max(1, Math.round((areas[i] / totalArea) * targetPointCount));
      for (let j = 0; j < sampleCount; j++) {
        const seed = i * 10000 + j * 17;
        const r1 = pseudoRandom(seed);
        const r2 = pseudoRandom(seed + 1);
        const sqrtR1 = Math.sqrt(r1);

        const sample = new THREE.Vector3()
          .copy(tempA)
          .add(
            tempB
              .clone()
              .sub(tempA)
              .multiplyScalar(1 - sqrtR1),
          )
          .add(
            tempC
              .clone()
              .sub(tempA)
              .multiplyScalar(r2 * sqrtR1),
          );

        samples.push(sample.x, sample.y, sample.z);
      }
    }

    return Float32Array.from(samples);
  }, [geometry]);
  // パーティクル用のシェーダーマテリアルを作成
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHoverCenter: { value: new THREE.Vector3() },
      uHoverStrength: { value: 0 },
      uHoverRadius: { value: 0.5 },
    }),
    [],
  );
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material) return;

    material.uniforms.uTime.value += delta;
    material.uniforms.uHoverCenter.value.lerp(hoverTarget.current, 0.15);
    material.uniforms.uHoverStrength.value = THREE.MathUtils.lerp(
      material.uniforms.uHoverStrength.value,
      hovering.current ? 1 : 0,
      0.15,
    );
    material.uniforms.uHoverRadius.value = THREE.MathUtils.lerp(
      material.uniforms.uHoverRadius.value,
      0.4,
      0.1,
    );
  });

  return (
    <points
      onPointerMove={handlePointerMove}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={sampledPositions}
          itemSize={3}
          count={sampledPositions.length / 3}
          args={[sampledPositions, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        attach="material"
        vertexShader={heroVertexShader}
        fragmentShader={heroFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
