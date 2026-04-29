import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calculator, FileText, Scale, BarChart3, Settings, LogOut } from 'lucide-react';
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

export default function Sidebar() {
  const { logout } = useApp();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">PE</div>
        <div className="logo-text">
          <span className="logo-main">Planilla</span>
          <span className="logo-sub">Elsa</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path} end={item.path==='/'} className={({ isActive }) => `nav-item ${isActive?'active':''}`}>
            <item.icon size={20} />
            <span>{item.label}</span>
            <div className="nav-indicator"></div>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={logout}>
          <LogOut size={20} /><span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
