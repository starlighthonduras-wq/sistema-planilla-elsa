import './LiveBackground.css';

export default function LiveBackground() {
  return (
    <div className="live-bg">
      <div className="live-bg-gradient"></div>
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className={`live-shape shape-${i % 4}`} style={{
          left: `${Math.random()*100}%`, top: `${Math.random()*100}%`,
          width: `${Math.random()*80+20}px`, height: `${Math.random()*80+20}px`,
          animationDelay: `${Math.random()*8}s`, animationDuration: `${Math.random()*15+10}s`,
          opacity: Math.random()*0.15+0.03
        }} />
      ))}
    </div>
  );
}
