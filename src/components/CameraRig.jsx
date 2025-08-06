// components/CameraRig.jsx
import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const rotations = [
  new THREE.Euler(0, 0, 0),                     // 0 – Hero: מבט ישיר קדימה
  new THREE.Euler(-0.3, -1.2, 1.5),             // 1 – About: מבט צד בזווית חדה
  new THREE.Euler(0.6, 0.8, 0.2),               // 2 – Projects: מבט מלמעלה באלכסון
  new THREE.Euler(-0.2, 1.2, 0),                // 3 – Skills: מבט הפוך קלות
  new THREE.Euler(0.5, -0.5, 0.7),              // 4 – Resume: מבט דינאמי שמאלה-למעלה
  new THREE.Euler(0.8, 1.2, 0.3),               // 5 – Contact: מבט פנורמי יותר
];

const positions = [
  new THREE.Vector3(0, 0, 15),         // 0 – Hero: רחוק ומרוכז
  new THREE.Vector3(0, -5, -5),        // 1 – About: עמוק מהצד
  new THREE.Vector3(0, 0, 5),          // 2 – Projects: מתקרב פנימה
  new THREE.Vector3(3, 1, 3),          // 3 – Skills: טיפה אלכסונית
  new THREE.Vector3(-4, 2, 6),         // 4 – Resume: מבט משמאל-קדימה
  new THREE.Vector3(0, 6, 10),         // 5 – Contact: מבט רחב מלמעלה
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

