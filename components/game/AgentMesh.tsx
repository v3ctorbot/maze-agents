"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  primaryColor: string;
  emissiveColor: string;
  accentColor: string;
  position: [number, number, number];
  rotation?: number;
  isMoving?: boolean;
}

export default function AgentMesh({
  primaryColor,
  emissiveColor,
  accentColor,
  position,
  rotation = 0,
  isMoving = false,
}: Props) {
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const antennaGlowRef = useRef<THREE.Mesh>(null);
  const clock = useRef(0);

  useFrame((_, delta) => {
    clock.current += delta;
    const t = clock.current;

    if (leftLegRef.current && rightLegRef.current) {
      const swing = isMoving ? Math.sin(t * 6) * 0.3 : 0;
      leftLegRef.current.rotation.x = swing;
      rightLegRef.current.rotation.x = -swing;
    }

    if (antennaGlowRef.current) {
      const mat = antennaGlowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.6 + Math.sin(t * 2) * 0.4;
    }
  });

  const matProps = { roughness: 0.3, metalness: 0.7 };

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Torso */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[0.6, 0.7, 0.38]} />
        <meshStandardMaterial
          color={primaryColor}
          emissive={emissiveColor}
          emissiveIntensity={0.25}
          {...matProps}
        />
      </mesh>

      {/* Chest accent stripe */}
      <mesh position={[0, 0.85, 0.2]}>
        <boxGeometry args={[0.28, 0.14, 0.02]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[0.46, 0.4, 0.36]} />
        <meshStandardMaterial
          color={primaryColor}
          emissive={emissiveColor}
          emissiveIntensity={0.35}
          {...matProps}
        />
      </mesh>

      {/* Left eye */}
      <mesh position={[-0.1, 1.52, 0.19]}>
        <sphereGeometry args={[0.065, 8, 8]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#CCDDFF"
          emissiveIntensity={1.0}
          roughness={0}
          metalness={0}
        />
      </mesh>

      {/* Right eye */}
      <mesh position={[0.1, 1.52, 0.19]}>
        <sphereGeometry args={[0.065, 8, 8]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#CCDDFF"
          emissiveIntensity={1.0}
          roughness={0}
          metalness={0}
        />
      </mesh>

      {/* Antenna stem */}
      <mesh position={[0, 1.85, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.28, 6]} />
        <meshStandardMaterial color={accentColor} roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Antenna glow tip */}
      <mesh ref={antennaGlowRef} position={[0, 2.0, 0]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1.0}
          roughness={0}
          metalness={0}
        />
      </mesh>

      {/* Left leg */}
      <mesh ref={leftLegRef} position={[-0.15, 0.28, 0]} castShadow>
        <boxGeometry args={[0.17, 0.52, 0.18]} />
        <meshStandardMaterial
          color={primaryColor}
          emissive={emissiveColor}
          emissiveIntensity={0.1}
          {...matProps}
        />
      </mesh>

      {/* Right leg */}
      <mesh ref={rightLegRef} position={[0.15, 0.28, 0]} castShadow>
        <boxGeometry args={[0.17, 0.52, 0.18]} />
        <meshStandardMaterial
          color={primaryColor}
          emissive={emissiveColor}
          emissiveIntensity={0.1}
          {...matProps}
        />
      </mesh>

      {/* Left foot */}
      <mesh position={[-0.15, 0.02, 0.04]}>
        <boxGeometry args={[0.18, 0.08, 0.26]} />
        <meshStandardMaterial color={primaryColor} {...matProps} />
      </mesh>

      {/* Right foot */}
      <mesh position={[0.15, 0.02, 0.04]}>
        <boxGeometry args={[0.18, 0.08, 0.26]} />
        <meshStandardMaterial color={primaryColor} {...matProps} />
      </mesh>

      {/* Agent glow light */}
      <pointLight color={primaryColor} intensity={0.6} distance={3} decay={2} />
    </group>
  );
}
