import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calculator, FileText, Scale, BarChart3, Settings, LogOut, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Sidebar.css';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/empleados', icon: Users, label: 'Empleados' },
  { path: '/nomina', icon: Calculator, label: 'Nómina' },
  { path: '/deducciones', icon: FileText, label: 'Deducciones' },
  { path: '/liquidaciones', icon: Scale, label: 'Liquidaciones' },
  { path: '/reportes', icon: BarChart3, label: 'Reportes' },
  { path: '/configuracion', icon: Settings, label: 'Configuración' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useApp();

  const handleNavClick = () => {
    if (window.innerWidth <= 768) onClose?.();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">PE</div>
          <div className="logo-text">
            <span className="logo-main">Planilla</span>
            <span className="logo-sub">Elsa</span>
          </div>
          <button className="sidebar-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} end={item.path==='/'} className={({ isActive }) => `nav-item ${isActive?'active':''}`} onClick={handleNavClick}>
              <item.icon size={18} />
              <span>{item.label}</span>
              <div className="nav-indicator"></div>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={() => { logout(); handleNavClick(); }}>
            <LogOut size={18} /><span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
