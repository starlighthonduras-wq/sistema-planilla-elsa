import { Users, DollarSign, Calendar, TrendingDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatoMoneda, calcularIHSS, calcularISR, calcularRAP } from '../utils/calculoNomina';
import KPICard from '../components/KPICard';
import './Dashboard.css';

export default function Dashboard() {
  const { empleados, configuracion, nominas } = useApp();
  const activos = empleados.filter(e => e.estado === 'activo');
  const totalNomina = activos.reduce((s, e) => s + e.salarioBase, 0);
  const totalDed = activos.reduce((s, e) => {
    const ihss = calcularIHSS(e.salarioBase, configuracion).total;
    const isr = calcularISR(e.salarioBase, configuracion);
    const rap = calcularRAP(e.salarioBase, configuracion);
    return s + ihss + isr + rap;
  }, 0);

  const departamentos = {};
  activos.forEach(e => {
    departamentos[e.departamento] = (departamentos[e.departamento] || 0) + e.salarioBase;
  });
  const maxSalario = Math.max(...Object.values(departamentos), 1);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Resumen general de la empresa</p>
      </div>
      <div className="grid-4">
        <KPICard icon={Users} label="Empleados Activos" value={activos.length} sub="De 10 registrados" color="purple" delay={0} />
        <KPICard icon={DollarSign} label="Nómina Mensual" value={formatoMoneda(totalNomina)} sub="Salarios base" color="teal" delay={100} />
        <KPICard icon={Calendar} label="Próximo Pago" value="30 Abr" sub="En 1 día" color="pink" delay={200} />
        <KPICard icon={TrendingDown} label="Deducciones del Mes" value={formatoMoneda(totalDed)} sub="IHSS + ISR + RAP" color="gold" delay={300} />
      </div>

      <div className="dashboard-grid mt-24">
        <div className="glass-panel dash-chart">
          <h3>Distribución Salarial por Departamento</h3>
          <div className="chart-bars">
            {Object.entries(departamentos).sort((a,b) => b[1]-a[1]).map(([dept, total], i) => (
              <div key={dept} className="chart-bar-row" style={{ animationDelay: `${i*80+400}ms` }}>
                <span className="bar-label">{dept}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(total/maxSalario)*100}%` }}></div>
                </div>
                <span className="bar-value">{formatoMoneda(total)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel dash-activity">
          <h3>Actividad Reciente</h3>
          <div className="activity-list">
            {nominas.slice(-5).reverse().map((n, i) => (
              <div key={i} className="activity-item" style={{ animationDelay: `${i*100+400}ms` }}>
                <div className="activity-dot"></div>
                <div className="activity-info">
                  <span className="activity-text">Nómina procesada: {n.empleadoNombre}</span>
                  <span className="activity-date">{new Date(n.fecha).toLocaleDateString('es-HN')}</span>
                </div>
              </div>
            ))}
            {nominas.length === 0 && (
              <p className="empty-text">No hay actividad reciente. Procesa tu primera nómina.</p>
            )}
          </div>
        </div>
      </div>

      <div className="glass-panel mt-24 dash-employees">
        <h3>Empleados por Departamento</h3>
        <div className="dept-chips">
          {Object.entries(departamentos).map(([dept, total]) => {
            const count = activos.filter(e => e.departamento === dept).length;
            return (
              <div key={dept} className="dept-chip">
                <span className="dept-name">{dept}</span>
                <span className="dept-count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
