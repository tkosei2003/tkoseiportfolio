'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import AboutText3D from './AboutText3D';

export default function AboutTypography() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 1.5]}
        shadows
        gl={{ alpha: true }}
      >
        <Suspense fallback={null}>
          <AboutText3D />
        </Suspense>
      </Canvas>
    </div>
  );
}
