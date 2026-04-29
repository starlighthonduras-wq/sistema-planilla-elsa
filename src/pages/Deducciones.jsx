import { useApp } from '../context/AppContext';
import { formatoMoneda, calcularIHSS, calcularISR, calcularRAP, calcularDeduccionPrestamos, calcularEmbargos } from '../utils/calculoNomina';
import './Deducciones.css';

export default function Deducciones() {
  const { empleados, configuracion } = useApp();
  const activos = empleados.filter(e => e.estado === 'activo');

  return (
    <div className="page-content">
      <div className="page-header"><h1>Deducciones</h1><p>Resumen de deducciones por empleado</p></div>
      <div className="glass-panel" style={{overflow:'auto',padding:0}}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Empleado</th><th>Salario</th><th>IHSS IVM</th><th>IHSS EM</th><th>ISR</th><th>RAP</th>
              <th>Préstamos</th><th>Embargos</th><th>F. Pensión</th><th>Total</th>
            </tr>
          </thead>
          <tbody>
            {activos.map((emp, i) => {
              const ihss = calcularIHSS(emp.salarioBase, configuracion);
              const isr = calcularISR(emp.salarioBase, configuracion);
              const rap = calcularRAP(emp.salarioBase, configuracion);
              const pr = calcularDeduccionPrestamos(emp.deducciones?.prestamos || []);
              const emb = calcularEmbargos(emp.salarioBase, emp.deducciones?.embargos || []);
              const fp = emp.deducciones?.fondoPension || 0;
              const total = ihss.total + isr + rap + pr + emb + fp;
              return (
                <tr key={emp.id} style={{animation:`slideUp 0.4s ease ${i*50}ms both`}}>
                  <td style={{fontWeight:500}}>{emp.nombre}</td>
                  <td>{formatoMoneda(emp.salarioBase)}</td>
                  <td>{formatoMoneda(ihss.ivm)}</td>
                  <td>{formatoMoneda(ihss.em)}</td>
                  <td>{formatoMoneda(isr)}</td>
                  <td>{formatoMoneda(rap)}</td>
                  <td>{pr > 0 ? formatoMoneda(pr) : '—'}</td>
                  <td>{emb > 0 ? formatoMoneda(emb) : '—'}</td>
                  <td>{fp > 0 ? formatoMoneda(fp) : '—'}</td>
                  <td style={{fontWeight:700,color:'var(--accent-3)'}}>{formatoMoneda(total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
