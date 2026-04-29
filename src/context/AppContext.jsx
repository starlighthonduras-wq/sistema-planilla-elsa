import { createContext, useContext, useState, useEffect } from 'react';
import { empleadosIniciales, configuracionInicial, credencialesAdmin } from '../utils/datosIniciales';

const AppContext = createContext();

export function useApp() { return useContext(AppContext); }

const STORAGE_KEY = 'planillaElsa';

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch(e) { console.error('Error loading data', e); }
  return null;
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) { console.error('Error saving', e); }
}

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [empleados, setEmpleados] = useState([]);
  const [nominas, setNominas] = useState([]);
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [configuracion, setConfiguracion] = useState(configuracionInicial);

  useEffect(() => {
    const data = loadData();
    if (data) {
      setEmpleados(data.empleados || empleadosIniciales);
      setNominas(data.nominas || []);
      setLiquidaciones(data.liquidaciones || []);
      setConfiguracion(data.configuracion || configuracionInicial);
    } else {
      setEmpleados(empleadosIniciales);
      setConfiguracion(configuracionInicial);
    }
    const auth = sessionStorage.getItem('planillaAuth');
    if (auth === 'true') setIsAuthenticated(true);
    setTimeout(() => setLoading(false), 3000);
  }, []);

  useEffect(() => {
    if (empleados.length > 0) {
      saveData({ empleados, nominas, liquidaciones, configuracion });
    }
  }, [empleados, nominas, liquidaciones, configuracion]);

  const login = (user, pass) => {
    if (user === credencialesAdmin.usuario && pass === credencialesAdmin.password) {
      setIsAuthenticated(true);
      sessionStorage.setItem('planillaAuth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('planillaAuth');
  };

  const addEmpleado = (emp) => {
    const newEmp = { ...emp, id: `emp-${Date.now()}` };
    setEmpleados(prev => [...prev, newEmp]);
    return newEmp;
  };

  const updateEmpleado = (id, data) => {
    setEmpleados(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  };

  const deleteEmpleado = (id) => {
    setEmpleados(prev => prev.map(e => e.id === id ? { ...e, estado: 'inactivo' } : e));
  };

  const addNomina = (nomina) => {
    setNominas(prev => [...prev, { ...nomina, id: `nom-${Date.now()}`, fecha: new Date().toISOString() }]);
  };

  const addLiquidacion = (liq) => {
    setLiquidaciones(prev => [...prev, { ...liq, id: `liq-${Date.now()}`, fecha: new Date().toISOString() }]);
  };

  const updateConfiguracion = (newConfig) => {
    setConfiguracion(prev => ({ ...prev, ...newConfig }));
  };

  const value = {
    isAuthenticated, loading, setLoading, login, logout,
    empleados, addEmpleado, updateEmpleado, deleteEmpleado,
    nominas, addNomina, liquidaciones, addLiquidacion,
    configuracion, updateConfiguracion
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
