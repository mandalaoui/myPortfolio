import React, { useState, useEffect, forwardRef } from 'react';
import './Hero3D.css';
import { Canvas } from '@react-three/fiber';
import CameraIntro from '../../components/CameraIntro';
import AvatarModel from '../../components/AvatarModel';
import { Suspense } from 'react';

const Hero3D = forwardRef(({ onIntroFinish }, ref) => {
  const [visible, setVisible] = useState(false);

  // מופעל רק פעם אחת לאחר סיום תנועת המצלמה
  const handleCameraIntroEnd = () => {
    setVisible(true);
    if (onIntroFinish) onIntroFinish(); 
  };

  // הקלדה של הטקסט + העלמת הקו המהבהב
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        document.querySelector('.typing-text')?.classList.add('typed');
      }, 2000); // 3s delay + 2s typing

      setTimeout(() => {
        document.querySelector('.typing-text-2')?.classList.add('typed');
      }, 3500); // 5s delay + 2s typing
    }
  }, [visible]);

  return (
    <section ref={ref} id="hero" className="hero">
      {/* רקע תלת-ממד */}
      <div className="hero-background">
        <Canvas camera={{ position: [0, 8, 80] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 5, 2]} intensity={1} />
          {/* פיניקס מופיע מיד */}
          {/* <PhoenixModel /> */}
          <Suspense fallback={null}>
            <AvatarModel />
          </Suspense>
          {/* מצלמה זזה ב־3 שניות, ואז onFinish */}
          <CameraIntro onFinish={handleCameraIntroEnd} />
        </Canvas>
      </div>

      {/* תוכן שמופיע רק אחרי שהמצלמה הגיעה */}
      {visible && (
        <div className="hero-content">
          <div className="hero-top visible">
            <div className="typing-container">
              <h1 className="typing-text">Omer Mandalaoui</h1>
            </div>
            <div className="typing-container">
              <p className="typing-text-2">Fullstack Developer</p>
            </div>
          </div>

          <div className="hero-bottom visible">
            <label className="scroll-label">
              Scroll for more
              <svg
                className="arrow-svg"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </label>
          </div>


        </div>
      )}
    </section>
  );
});

export default Hero3D;
