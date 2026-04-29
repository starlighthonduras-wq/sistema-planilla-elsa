import { useState, useEffect } from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Navbar.css';

export default function Navbar() {
  const { logout } = useApp();
  const [time, setTime] = useState(new Date());
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-search">
          <Search size={18} />
          <input type="text" placeholder="Buscar empleado, reporte..." />
        </div>
      </div>
      <div className="navbar-right">
        <span className="navbar-clock">{time.toLocaleTimeString('es-HN', { hour:'2-digit', minute:'2-digit' })}</span>
        <span className="navbar-date">{time.toLocaleDateString('es-HN', { weekday:'short', day:'numeric', month:'short' })}</span>
        <button className="btn-icon navbar-bell">
          <Bell size={18} />
          <span className="bell-badge">3</span>
        </button>
        <div className="navbar-profile" onClick={() => setShowProfile(!showProfile)}>
          <div className="profile-avatar"><User size={18} /></div>
          <span>Admin</span>
          {showProfile && (
            <div className="profile-dropdown">
              <button onClick={logout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
