// components/FloatingCodeBlocks.jsx
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const CODE_SNIPPETS = [
  "HTML", "CSS", "JS", "React", "Node.js", "Express", "MongoDB",
  "TypeScript", "Three.js", "Python", "Git", "Docker", "REST",
  "Linux", "JWT", "MySQL", "C#", "C++", "Machine Learning", "AI",
  "DevOps", "Agile", "UI/UX", "VS Code", "Cursor", "Wix",
  "Firebase", "GraphQL", "Redux", "Framer", "Tailwind", "Vite"
];

export default function FloatingCodeBlocks({ count = 30, scrollY = 0 }) {
  const groupRef = useRef();

  const blocks = useMemo(() =>
    Array.from({ length: count }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 30
      ),
      rotationSpeed: Math.random() * 0.005 + 0.002,
      snippet: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
      phase: Math.random() * Math.PI * 2,
    }))
  , [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((blockGroup, i) => {
      const { position, rotationSpeed, phase } = blocks[i];
      const floatY = Math.sin(t + phase) * 0.5 + scrollY * 0.002;

      blockGroup.position.set(
        position.x,
        position.y + floatY,
        position.z
      );

      blockGroup.rotation.y += rotationSpeed;
    });
  });

  return (
    <group ref={groupRef}>
      {blocks.map((block, i) => (
        <group key={i}>
          {/* בלוק */}
          <mesh>
            <boxGeometry args={[1.5, 1, 0.2]} />
            <meshStandardMaterial color="#00ffff" metalness={0.6} roughness={0.3} />
          </mesh>

          <Text
            position={[0, 0, 0.12]}
            fontSize={0.18}
            maxWidth={1.4}
            textAlign="center"
            color="black"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="white"
          >
            {block.snippet}
          </Text>

          <Text
            position={[0, 0, -0.12]}
            rotation={[0, Math.PI, 0]}
            fontSize={0.18}
            maxWidth={1.4}
            textAlign="center"
            color="black"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="white"
          >
            {block.snippet}
          </Text>
        </group>
      ))}
    </group>
  );
}
