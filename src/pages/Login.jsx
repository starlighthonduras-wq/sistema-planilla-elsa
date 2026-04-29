import { useState } from 'react';
import { useApp } from '../context/AppContext';
import LiveBackground from '../components/LiveBackground';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import './Login.css';

export default function Login() {
  const { login } = useApp();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!login(usuario, password)) {
      setError('Credenciales incorrectas');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="login-page">
      <LiveBackground />
      <div className={`login-card ${shake ? 'shake' : ''}`}>
        <div className="login-logo">
          <div className="login-logo-3d">
            <div className="login-cube">
              <div className="l-face l-front">PE</div>
              <div className="l-face l-back">HR</div>
              <div className="l-face l-left">$$</div>
              <div className="l-face l-right">✓</div>
            </div>
          </div>
        </div>
        <h1>Sistema de Planilla</h1>
        <p className="login-subtitle">Elsa — Recursos Humanos</p>
        <form onSubmit={handleSubmit}>
          <div className="login-input-group">
            <User size={18} />
            <input type="text" placeholder="Usuario" value={usuario} onChange={e => { setUsuario(e.target.value); setError(''); }} autoComplete="username" />
          </div>
          <div className="login-input-group">
            <Lock size={18} />
            <input type={showPass ? 'text' : 'password'} placeholder="Contraseña" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} autoComplete="current-password" />
            <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-btn">Iniciar Sesión</button>
        </form>
        <p className="login-footer">© 2026 Empresa Elsa. Todos los derechos reservados.</p>
      </div>
    </div>
  );
}
