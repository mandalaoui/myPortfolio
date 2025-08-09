// components/CameraRig.jsx
import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const rotations = [
  new THREE.Euler(0, 0, 0),                   // 0 – Hero: מבט קדמי ישר
  new THREE.Euler(0.1, Math.PI / 3, 0.1),     // 1 – אלכסון ימני קדמי
  new THREE.Euler(0.2, 2 * Math.PI / 3, -0.1),// 2 – ימינה אחורה
  new THREE.Euler(0.05, Math.PI, 0),          // 3 – אחורה (180 מעלות)
  new THREE.Euler(0.05, Math.PI, 0),// 4 – שמאלה אחורה
  new THREE.Euler(0.05, Math.PI, 0),  // 5 – שמאלה קדימה
];

const positions = [
  new THREE.Vector3(0, 0, 15),                // 0 – Hero: מקדימה
  new THREE.Vector3(10, 3, 10),               // 1 – מצד ימין קדימה
  new THREE.Vector3(10, 2, -8),               // 2 – מצד ימין אחורה
  new THREE.Vector3(0, -3, 0),             // 3 – מאחורה
  new THREE.Vector3(-10, 3, -8),              // 4 – שמאל אחורי
  new THREE.Vector3(-10, 1.5, 10),            // 5 – שמאל קדמי
];

export default function CameraRig({ currentSection }) {
  const groupRef = useRef();
  const { camera } = useThree();

  const [entered, setEntered] = useState(false);
  const targetRotation = useRef(new THREE.Euler());
  const targetPosition = useRef(new THREE.Vector3());

  const elapsed = useRef(0);
  const duration = 3; // 3 שניות כניסה

  useEffect(() => {
    // מצב התחלה – רחוק יותר
    if (groupRef.current && !entered) {
      groupRef.current.position.set(0, 0, 80);
    }

    // יעד לסיבוב תמיד
    targetRotation.current.copy(rotations[currentSection]);

    // יעד למיקום רק אם כבר נכנסנו
    if (entered) {
      targetPosition.current.copy(positions[currentSection]);
    }
  }, [currentSection, entered]);


  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (!entered) {
      // שלב הכניסה פנימה
      elapsed.current += delta;
      const t = Math.min(elapsed.current / duration, 1);
      const z = THREE.MathUtils.lerp(80, 15, t);
      groupRef.current.position.z = z;

      if (t >= 1) {
        setEntered(true);
      }

      // לא להמשיך לרוטציות
      return;
    }
    // אנימציית רוטציה עדינה
    groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * 0.02;
    groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * 0.02;
    groupRef.current.rotation.z += (targetRotation.current.z - groupRef.current.rotation.z) * 0.02;

    // אנימציית מיקום עדינה
    groupRef.current.position.lerp(targetPosition.current, 0.03);
    
  });

  return <group ref={groupRef}>{camera && <primitive object={camera} />}</group>;
}

