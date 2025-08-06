// components/PhoenixModel.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Color } from 'three';

export default function PhoenixModel(props) {
  const group = useRef();
  const { scene } = useGLTF('/models/phoenix.glb');
  const mouse = useRef(new THREE.Vector2(0, 0));
  const targetRotation = useRef(new THREE.Euler());

  // עדכון מיקום העכבר
  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouse.current.set(x, y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scale = useRef(0);
  const [targetScale, setTargetScale] = useState(1);

  useEffect(() => {
    scale.current = 0;
  }, []);

  useFrame((_, delta) => {
    if (group.current) {
      const s = group.current.scale;
      const t = 0.01; // מהירות
      s.x += (targetScale - s.x) * t;
      s.y += (targetScale - s.y) * t;
      s.z += (targetScale - s.z) * t;
    }
  });


  // אנימציה – הטייה עדינה לפי מיקום העכבר
  useFrame((state, delta) => {
    if (!group.current) return;

    const maxTilt = 0.4; // רדיאנים
    const targetX = -mouse.current.y * maxTilt;
    const targetY = mouse.current.x * maxTilt;

    targetRotation.current.set(targetX, targetY, 0);
    group.current.rotation.x += (targetRotation.current.x - group.current.rotation.x) * 0.05;
    group.current.rotation.y += (targetRotation.current.y - group.current.rotation.y) * 0.05;
  });

useEffect(() => {
  const colorBottom = new Color('#00c2ff'); // תכלת עמוק
  const colorTop = new Color('#e0f8ff');    // תכלת לבנבן

  scene.traverse((child) => {
    if (child.isMesh) {
      const geometry = child.geometry;
      geometry.computeBoundingBox();

      const { min, max } = geometry.boundingBox;
      const height = max.y - min.y;

      const colors = [];
      const position = geometry.attributes.position;

      for (let i = 0; i < position.count; i++) {
        const y = position.getY(i);
        const tRaw = (y - min.y) / height;
        const t = Math.pow(tRaw, 0.7); // נשאר יותר זמן באדום/כתום
        const color = colorBottom.clone().lerp(colorTop, t);
        colors.push(color.r, color.g, color.b);
      }

      geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

      child.material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        metalness: 0.,
        roughness: 0.15,
        emissive: new THREE.Color('#33ccff'),
        emissiveIntensity: 0.05,
      });
    }
  });
}, [scene]);



  return (
    <group ref={group} {...props} scale={[0, 0, 0]} >
      <primitive object={scene} position={[0, -1.5, 0]} rotation={[0.2, 0, 0]} />
    </group>
  );
}
