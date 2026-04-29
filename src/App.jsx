import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import LoadingScreen from './components/LoadingScreen';
import LiveBackground from './components/LiveBackground';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Empleados from './pages/Empleados';
import FichaEmpleado from './pages/FichaEmpleado';
import Nomina from './pages/Nomina';
import Deducciones from './pages/Deducciones';
import Liquidaciones from './pages/Liquidaciones';
import Reportes from './pages/Reportes';
import Configuracion from './pages/Configuracion';

export default function App() {
  const { isAuthenticated, loading, setLoading } = useApp();

  if (loading) return <LoadingScreen onFinish={() => setLoading(false)} />;

  if (!isAuthenticated) return <Login />;

  return (
    <div className="app-layout">
      <LiveBackground />
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/empleados/:id" element={<FichaEmpleado />} />
          <Route path="/nomina" element={<Nomina />} />
          <Route path="/deducciones" element={<Deducciones />} />
          <Route path="/liquidaciones" element={<Liquidaciones />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
