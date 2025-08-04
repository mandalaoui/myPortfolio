import './Hero3D.css';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Box() {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0.5, 0.5, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshPhongMaterial color="#5faafc" shininess={80} />
    </mesh>
  );
}

const scrollToAbout = () => {
  const target = document.getElementById('about');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
};



export default function Hero3D() {
  return (
    <div className="hero-wrapper">
      <div className="hero-background" />

      <Canvas
        style={{ position: 'relative', zIndex: 1 }}
        camera={{ position: [5, 5, 5] }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
        <pointLight position={[10, 10, 10]} />
        <Box />
        <OrbitControls enableZoom={false} />
      </Canvas>

      <div className="hero-overlay">
        <h1>Omer Mandalaoui</h1>
        <p>Fullstack Developer</p>
      </div>

      <button
        className="scroll-button"
        onClick={scrollToAbout}
      >
        ↓ Explore More
      </button>

    </div>
  );
}
