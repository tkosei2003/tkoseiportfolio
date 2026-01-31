'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

const TEXT_WIDTH_FACTOR = 3.7;
const MARGIN = 0.05;

export default function AboutText3D() {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const { viewport, size } = useThree();

  const isMobile = size.width < 768;
  const isPortrait = viewport.height > viewport.width;

  const availableSpace = isPortrait
    ? viewport.height * (1 - MARGIN * 2)
    : viewport.width * (1 - MARGIN * 2);
  const textSize = availableSpace / TEXT_WIDTH_FACTOR;

  const textPosition: [number, number, number] = isPortrait
    ? [-viewport.width * 0.25, 0, 0]
    : [0, viewport.height * 0.15, 0];

  const textRotation: [number, number, number] = isPortrait ? [0, 0, Math.PI / 2] : [0, 0, 0];

  const viewportKey = `${Math.round(viewport.width * 10)}-${Math.round(viewport.height * 10)}-${isPortrait}`;

  useFrame(({ pointer }) => {
    if (isMobile || !lightRef.current) return;

    const moveRangeX = viewport.width * 0.4;
    const moveRangeY = viewport.height * 0.4;

    mousePos.current.x = THREE.MathUtils.lerp(mousePos.current.x, pointer.x * moveRangeX, 0.08);
    mousePos.current.y = THREE.MathUtils.lerp(mousePos.current.y, pointer.y * moveRangeY, 0.08);

    lightRef.current.position.x = mousePos.current.x;
    lightRef.current.position.y = mousePos.current.y + viewport.height * 0.3;
  });

  return (
    <>
      <ambientLight intensity={0.6} />

      <directionalLight
        ref={lightRef}
        position={[0, viewport.height * 0.3, 5]}
        intensity={isMobile ? 1.2 : 1.8}
        castShadow
        shadow-mapSize={isMobile ? [1024, 1024] : [2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-camera-left={-viewport.width}
        shadow-camera-right={viewport.width}
        shadow-camera-top={viewport.height}
        shadow-camera-bottom={-viewport.height}
        shadow-bias={-0.001}
      />

      <mesh position={[0, 0, -0.2]} receiveShadow>
        <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
        <shadowMaterial opacity={1} color={'#9d9b9b'} />
      </mesh>

      <Center key={viewportKey} position={textPosition} rotation={textRotation}>
        <Text3D
          font="/fonts/Hero.json"
          size={textSize}
          height={0.4}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.01}
          bevelSegments={3}
          castShadow
        >
          ABOUT
          <meshStandardMaterial color="#ffffff" roughness={0.8} metalness={0.05} />
        </Text3D>
      </Center>
    </>
  );
}
