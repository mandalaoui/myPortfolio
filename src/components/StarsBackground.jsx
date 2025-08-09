import { useMemo } from 'react';

export default function StarsBackground({ count = 1000 }) {
  const positions = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push((Math.random() - 0.5) * 100); // x
      arr.push((Math.random() - 0.5) * 100); // y
      arr.push((Math.random() - 0.5) * 100); // z
    }
    return new Float32Array(arr);
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.3} sizeAttenuation />
    </points>
  );
}
