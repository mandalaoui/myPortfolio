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
  const targetScale = 4;

  // הפעלת אנימציה בעת טעינת המודל
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;
    // עצירה בטוחה של כל האנימציות והפעלת הראשונה
    Object.values(actions).forEach((action) => action?.stop?.());
    const firstAction = actions[Object.keys(actions)[0]];
    firstAction?.reset().fadeIn(0.3).play();
    onFinishLoad?.();
  }, [actions, onFinishLoad]);

  // תזוזת עכבר
  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouse.current.set(x, y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // רוטציה לפי עכבר
  useFrame(() => {
    if (!group.current) return;
    const maxTilt = 0.4;
    const targetX = -mouse.current.y * maxTilt;
    const targetY = mouse.current.x * maxTilt;
    targetRotation.current.set(targetX, targetY, 0);
    group.current.rotation.x += (targetRotation.current.x - group.current.rotation.x) * 0.05;
    group.current.rotation.y += (targetRotation.current.y - group.current.rotation.y) * 0.05;
  });

  // גדילה חלקה
  useFrame(() => {
    if (!group.current) return;
    const s = group.current.scale;
    const t = 0.02;
    s.x += (targetScale - s.x) * t;
    s.y += (targetScale - s.y) * t;
    s.z += (targetScale - s.z) * t;
  });

  return (
    <group ref={group} scale={[-0.1, 0, 0]}>
      <primitive object={scene} position={[0, -1.5, 0]} />
    </group>
  );
}

export default function AvatarModel() {
  const [modelName, setModelName] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const loadRandomModel = () => {
    const randomIndex = Math.floor(Math.random() * modelFiles.length);
    setModelName(modelFiles[randomIndex]);
    setLoaded(false);
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
            onFinishLoad={() => setLoaded(true)}
          />
        </Suspense>
      )}
    </>
  );
}
