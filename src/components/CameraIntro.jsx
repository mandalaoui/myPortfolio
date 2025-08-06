// components/CameraIntro.jsx
import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function CameraIntro({ onFinish }) {
  const { camera } = useThree();
  const startZ = 80;
  const endZ = 15;
  const duration = 3;
  const elapsed = useRef(0);
  const finished = useRef(false);

  useEffect(() => {
    camera.position.set(0, 0, startZ);
  }, [camera]);

  useFrame((_, delta) => {
    if (finished.current) return;

    if (elapsed.current >= duration) {
      if (onFinish) onFinish();
      finished.current = true;
      return;
    }

    elapsed.current += delta;
    const t = Math.min(elapsed.current / duration, 1);
    const z = THREE.MathUtils.lerp(startZ, endZ, t);
    camera.position.z = z;
  });

  return null;
}
