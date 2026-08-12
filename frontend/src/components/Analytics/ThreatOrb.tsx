import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

interface ThreatOrbProps {
  isPhishing: boolean;
}

function OrbMesh({ color }: { color: string }) {
  const core = useRef<Mesh>(null);
  const ring = useRef<Mesh>(null);
  const halo = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (core.current) core.current.rotation.y += delta * 0.32;
    if (ring.current) {
      ring.current.rotation.x += delta * 0.12;
      ring.current.rotation.z += delta * 0.08;
    }
    if (halo.current) halo.current.rotation.y -= delta * 0.18;
  });

  return (
    <>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.7}
          wireframe
          roughness={0.25}
          metalness={0.55}
        />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2.5, 0.25, 0]}>
        <torusGeometry args={[1.28, 0.018, 12, 72]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>
      <mesh ref={halo} rotation={[0.4, 0.2, 0.6]}>
        <torusGeometry args={[1.48, 0.01, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.28} />
      </mesh>
      <pointLight color={color} intensity={5.5} distance={7} />
      <ambientLight intensity={0.22} />
    </>
  );
}

export default function ThreatOrb({ isPhishing }: ThreatOrbProps) {
  const [paused, setPaused] = useState(false);
  const color = isPhishing ? '#F43F5E' : '#10B981';

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 3.15], fov: 38 }}
      frameloop={paused ? 'never' : 'always'}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <OrbMesh color={color} />
    </Canvas>
  );
}
