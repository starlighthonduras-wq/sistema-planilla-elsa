import { useApp } from '../context/AppContext';
import { formatoMoneda } from '../utils/calculoNomina';
import { FileText, Download } from 'lucide-react';
import './Reportes.css';

export default function Reportes() {
  const { nominas, liquidaciones } = useApp();

  return (
    <div className="page-content">
      <div className="page-header"><h1>Reportes</h1><p>Historial de nóminas y liquidaciones procesadas</p></div>

      <div className="glass-panel report-section">
        <h3><FileText size={20}/> Historial de Nóminas</h3>
        {nominas.length === 0 ? <p className="empty-text">No hay nóminas procesadas aún.</p> : (
          <div className="report-table-wrap">
            <table className="data-table">
              <thead><tr><th>Fecha</th><th>Empleado</th><th>Cargo</th><th>Total Ing.</th><th>Total Ded.</th><th>Neto</th></tr></thead>
              <tbody>
                {[...nominas].reverse().map((n, i) => (
                  <tr key={i} style={{animation:`slideUp 0.3s ease ${i*30}ms both`}}>
                    <td>{new Date(n.fecha).toLocaleDateString('es-HN')}</td>
                    <td style={{fontWeight:500}}>{n.empleadoNombre}</td>
                    <td style={{color:'var(--text-secondary)'}}>{n.cargo}</td>
                    <td>{formatoMoneda(n.ingresos.totalIngresos)}</td>
                    <td style={{color:'var(--accent-3)'}}>{formatoMoneda(n.deducciones.totalDeducciones)}</td>
                    <td className="neto-cell">{formatoMoneda(n.salarioNeto)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="glass-panel report-section mt-24">
        <h3><FileText size={20}/> Historial de Liquidaciones</h3>
        {liquidaciones.length === 0 ? <p className="empty-text">No hay liquidaciones registradas aún.</p> : (
          <div className="report-table-wrap">
            <table className="data-table">
              <thead><tr><th>Fecha</th><th>Empleado</th><th>Tipo</th><th>Antigüedad</th><th>Total</th></tr></thead>
              <tbody>
                {[...liquidaciones].reverse().map((l, i) => (
                  <tr key={i} style={{animation:`slideUp 0.3s ease ${i*30}ms both`}}>
                    <td>{new Date(l.fecha).toLocaleDateString('es-HN')}</td>
                    <td style={{fontWeight:500}}>{l.empleado}</td>
                    <td><span className={`badge ${l.tipoDespido==='injustificado'?'badge-danger':'badge-warning'}`}>{l.tipoDespido==='injustificado'?'Despido':'Renuncia'}</span></td>
                    <td>{l.antiguedad?.anios || 0} años</td>
                    <td className="neto-cell">{formatoMoneda(l.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
