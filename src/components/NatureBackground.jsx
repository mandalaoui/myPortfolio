// components/NatureBackground.jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import FloatingCodeBlocks from './FloatingCodeBlocks';
import StarsBackground from './StarsBackground';
import CameraRig from './CameraRig';

export default function NatureBackground({ currentSection }) {
  return (
    <Canvas>
      <color attach="background" args={['#0a0f24']} />
      <StarsBackground count={800} size={0.15} color="#888" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 5, 2]} intensity={1} />

      <CameraRig currentSection={currentSection} />
      <FloatingCodeBlocks />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
