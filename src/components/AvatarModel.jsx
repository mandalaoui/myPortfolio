import React, { useRef, useEffect, useState, Suspense } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const modelFiles = [
  'boy-waving.glb',
  'boy-gangnam-style.glb',
  'boy-hip-hop-dance2.glb',
  'boy-robot-dance.glb',
  'boy-hip-hop-dance.glb',
  'boy-breakdance.glb',
];

function AvatarModelInternal({ modelPath, onFinishLoad }) {
  const group = useRef();
  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, group);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const targetRotation = useRef(new THREE.Euler());

  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;
    Object.values(actions).forEach((a) => a?.stop?.());
    const first = actions[Object.keys(actions)[0]];
    first?.reset().fadeIn(0.3).play();
    onFinishLoad?.();
  }, [actions, onFinishLoad]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.current.set(x, y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (!group.current) return;
    const maxTilt = 0.4;
    const targetX = -mouse.current.y * maxTilt;
    const targetY = mouse.current.x * maxTilt;
    targetRotation.current.set(targetX, targetY, 0);
    group.current.rotation.x += (targetRotation.current.x - group.current.rotation.x) * 0.05;
    group.current.rotation.y += (targetRotation.current.y - group.current.rotation.y) * 0.05;
  });

  useFrame(() => {
    if (!group.current) return;
    const s = group.current.scale;
    const t = 0.02;
    s.x += (4 - s.x) * t;
    s.y += (4 - s.y) * t;
    s.z += (4 - s.z) * t;
  });

  return (
    <group ref={group} scale={[-0.1, 0, 0]}>
      <primitive object={scene} position={[0, -1.5, 0]} />
    </group>
  );
}

export default function AvatarModel() {
  const [modelName, setModelName] = useState(null);

  const loadRandomModel = () => {
    const idx = Math.floor(Math.random() * modelFiles.length);
    setModelName(modelFiles[idx]);
  };

  useEffect(() => {
    loadRandomModel();
  }, []);

  const modelPath = modelName ? `/models/${modelName}` : null;

  return (
    <>
      {modelPath && (
        <Suspense fallback={null}>
          <AvatarModelInternal
            modelPath={modelPath}
          />
        </Suspense>
      )}
    </>
  );
}
