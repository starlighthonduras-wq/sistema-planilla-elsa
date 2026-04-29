import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calcularNominaEmpleado, formatoMoneda } from '../utils/calculoNomina';
import { generarReciboPDF } from '../utils/generarPDF';
import PopupModal from '../components/PopupModal';
import { Calculator, Download, CheckCircle } from 'lucide-react';
import './Nomina.css';

export default function Nomina() {
  const { empleados, configuracion, addNomina } = useApp();
  const activos = empleados.filter(e => e.estado === 'activo');
  const [frecuencia, setFrecuencia] = useState('mensual');
  const [extras, setExtras] = useState({});
  const [resultados, setResultados] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [processed, setProcessed] = useState(false);

  const calcular = () => {
    const res = activos.map(emp => calcularNominaEmpleado(emp, extras[emp.id] || {}, configuracion));
    setResultados(res);
  };

  const procesar = () => {
    resultados.forEach(r => addNomina(r));
    setProcessed(true);
    setShowConfirm(false);
    setTimeout(() => setProcessed(false), 3000);
  };

  const descargarPDF = (nomina) => {
    generarReciboPDF(nomina, configuracion.empresa || {});
  };

  const totalNomina = resultados.reduce((s, r) => s + r.salarioNeto, 0);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Nómina</h1><p>Cálculo y procesamiento de nómina</p>
        <div className="nomina-controls">
          <select className="freq-select" value={frecuencia} onChange={e => setFrecuencia(e.target.value)}>
            <option value="semanal">Semanal</option>
            <option value="catorcenal">Catorcenal</option>
            <option value="quincenal">Quincenal</option>
            <option value="mensual">Mensual</option>
          </select>
          <button className="btn btn-primary" onClick={calcular}><Calculator size={16}/>Calcular</button>
        </div>
      </div>

      {resultados.length > 0 && (
        <>
          <div className="nomina-table-wrap glass-panel" style={{animation:'slideUp 0.5s ease'}}>
            <div className="nomina-scroll-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Empleado</th><th>Cargo</th><th>Salario Base</th>
                    <th>H. Extras</th><th>Otros Ing.</th><th>Total Ing.</th>
                    <th>IHSS</th><th>ISR</th><th>RAP</th><th>Otros Ded.</th><th>Total Ded.</th>
                    <th>Neto</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((r, i) => (
                    <tr key={r.empleadoId} style={{animation:`slideUp 0.4s ease ${i*50}ms both`}}>
                      <td style={{fontWeight:500}}>{r.empleadoNombre}</td>
                      <td style={{color:'var(--text-secondary)',fontSize:'0.8rem'}}>{r.cargo}</td>
                      <td>{formatoMoneda(r.ingresos.salarioBase)}</td>
                      <td>{formatoMoneda(r.ingresos.horasExtras.total)}</td>
                      <td>{formatoMoneda(r.ingresos.comisiones + r.ingresos.bonos + r.ingresos.otrosIngresos)}</td>
                      <td style={{fontWeight:600,color:'var(--accent-2)'}}>{formatoMoneda(r.ingresos.totalIngresos)}</td>
                      <td style={{color:'var(--danger)'}}>{formatoMoneda(r.deducciones.ihss.total)}</td>
                      <td style={{color:'var(--danger)'}}>{formatoMoneda(r.deducciones.isr)}</td>
                      <td style={{color:'var(--danger)'}}>{formatoMoneda(r.deducciones.rap)}</td>
                      <td style={{color:'var(--danger)'}}>{formatoMoneda(r.deducciones.prestamos + r.deducciones.embargos + r.deducciones.fondoPension)}</td>
                      <td style={{fontWeight:600,color:'var(--accent-3)'}}>{formatoMoneda(r.deducciones.totalDeducciones)}</td>
                      <td className="neto-cell">{formatoMoneda(r.salarioNeto)}</td>
                      <td><button className="btn-icon" onClick={() => descargarPDF(r)} title="Descargar PDF"><Download size={16}/></button></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={11} style={{textAlign:'right',fontWeight:700,fontSize:'1rem'}}>TOTAL A PAGAR:</td>
                    <td className="neto-cell" style={{fontSize:'1.1rem'}}>{formatoMoneda(totalNomina)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'flex-end',gap:12,marginTop:16}}>
            <button className="btn btn-primary" onClick={() => setShowConfirm(true)}><CheckCircle size={18}/>Procesar Nómina</button>
          </div>
        </>
      )}

      {processed && (
        <div className="success-toast">
          <CheckCircle size={20}/> Nómina procesada exitosamente
        </div>
      )}

      <PopupModal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirmar Procesamiento" size="sm">
        <p style={{color:'var(--text-secondary)',marginBottom:20}}>¿Deseas procesar la nómina para {resultados.length} empleados por un total de <strong style={{color:'var(--accent-2)'}}>{formatoMoneda(totalNomina)}</strong>?</p>
        <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
          <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancelar</button>
          <button className="btn btn-primary" onClick={procesar}>Confirmar</button>
        </div>
      </PopupModal>
    </div>
  );
}
