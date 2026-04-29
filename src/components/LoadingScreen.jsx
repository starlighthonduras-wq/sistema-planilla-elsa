import { useEffect, useState } from 'react';
import './LoadingScreen.css';

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => onFinish && onFinish(), 600);
    }, 3000);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [onFinish]);

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loading-particles">
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random()*100}%`, top: `${Math.random()*100}%`,
            width: `${Math.random()*6+2}px`, height: `${Math.random()*6+2}px`,
            animationDelay: `${Math.random()*3}s`, animationDuration: `${Math.random()*4+3}s`
          }} />
        ))}
      </div>
      <div className="loading-content">
        <div className="loading-logo-container">
          <div className="loading-logo-3d">
            <div className="logo-cube">
              <div className="cube-face front">PE</div>
              <div className="cube-face back">HR</div>
              <div className="cube-face left">$$</div>
              <div className="cube-face right">✓</div>
              <div className="cube-face top">⚡</div>
              <div className="cube-face bottom">★</div>
            </div>
          </div>
          <div className="loading-glow"></div>
        </div>
        <h1 className="loading-title">Sistema de Planilla</h1>
        <p className="loading-subtitle">Elsa</p>
        <div className="loading-bar-container">
          <div className="loading-bar" style={{ width: `${Math.min(progress, 100)}%` }}></div>
        </div>
        <p className="loading-text">Cargando plataforma...</p>
      </div>
    </div>
  );
}
