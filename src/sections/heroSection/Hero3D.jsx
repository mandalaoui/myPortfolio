import React, { useState, useEffect } from 'react';
import './Hero3D.css';
import { Canvas } from '@react-three/fiber';
import PhoenixModel from '../../components/PhoenixModel';
import CameraIntro from '../../components/CameraIntro';

const Hero3D = ({ onIntroFinish }) => {
  const [visible, setVisible] = useState(false);

  // מופעל רק פעם אחת לאחר סיום תנועת המצלמה
  const handleCameraIntroEnd = () => {
    setVisible(true);
    if (onIntroFinish) onIntroFinish(); 
  };


  const scrollToAbout = () => {
    const target = document.getElementById('about');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
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
    <section className="hero">
      {/* רקע תלת-ממד */}
      <div className="hero-background">
        <Canvas camera={{ position: [0, 8, 80] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 5, 2]} intensity={1} />
          {/* פיניקס מופיע מיד */}
          <PhoenixModel />
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
            <button className="scroll-button" onClick={scrollToAbout}>
              ↓ Explore More
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero3D;
