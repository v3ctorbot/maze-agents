"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EXIT_GLOW_COLOR } from "@/lib/utils/constants";

interface Props {
  position: [number, number, number];
}

export default function ExitMarker({ position }: Props) {
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (torusRef.current) {
      torusRef.current.rotation.z += 0.008;
      torusRef.current.rotation.x += 0.004;
    }
  });

  return (
    <group position={position}>
      <mesh ref={torusRef}>
        <torusGeometry args={[1.2, 0.12, 8, 32]} />
        <meshStandardMaterial
          color={EXIT_GLOW_COLOR}
          emissive={EXIT_GLOW_COLOR}
          emissiveIntensity={2.0}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[1.0, 32]} />
        <meshStandardMaterial
          color={EXIT_GLOW_COLOR}
          emissive={EXIT_GLOW_COLOR}
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
      <pointLight color={EXIT_GLOW_COLOR} intensity={4} distance={8} decay={2} />
    </group>
  );
}
