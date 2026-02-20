"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  targetA: THREE.Vector3;
  targetB: THREE.Vector3;
}

export default function CameraRig({ targetA, targetB }: Props) {
  const { camera } = useThree();
  const lookAt = useRef(new THREE.Vector3());
  const camPos = useRef(new THREE.Vector3(30, 28, 30));

  useFrame(() => {
    lookAt.current.lerpVectors(targetA, targetB, 0.5);
    camPos.current.set(
      lookAt.current.x + 20,
      lookAt.current.y + 22,
      lookAt.current.z + 20
    );
    camera.position.lerp(camPos.current, 0.04);
    camera.lookAt(lookAt.current);
  });

  return null;
}
