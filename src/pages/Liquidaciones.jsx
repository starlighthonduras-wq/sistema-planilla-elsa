import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calcularLiquidacion } from '../utils/calculoLiquidacion';
import { formatoMoneda } from '../utils/calculoNomina';
import { generarLiquidacionPDF } from '../utils/generarPDF';
import { Scale, Download, CheckCircle } from 'lucide-react';
import './Liquidaciones.css';

export default function Liquidaciones() {
  const { empleados, configuracion, addLiquidacion } = useApp();
  const activos = empleados.filter(e => e.estado === 'activo');
  const [empId, setEmpId] = useState('');
  const [tipo, setTipo] = useState('injustificado');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [resultado, setResultado] = useState(null);
  const [saved, setSaved] = useState(false);

  const calcular = () => {
    const emp = empleados.find(e => e.id === empId);
    if (!emp) return;
    const res = calcularLiquidacion(emp, fecha, tipo);
    setResultado(res);
  };

  const guardar = () => {
    if (resultado) {
      addLiquidacion(resultado);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const descargarPDF = () => {
    if (resultado) generarLiquidacionPDF(resultado, configuracion.empresa || {});
  };

  return (
    <div className="page-content">
      <div className="page-header"><h1>Liquidaciones</h1><p>Cálculo de finiquitos y prestaciones laborales</p></div>
      <div className="glass-panel liq-form">
        <div className="grid-3">
          <div className="input-group">
            <label>Empleado</label>
            <select value={empId} onChange={e => setEmpId(e.target.value)}>
              <option value="">Seleccionar...</option>
              {activos.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Tipo de Terminación</label>
            <select value={tipo} onChange={e => setTipo(e.target.value)}>
              <option value="injustificado">Despido Injustificado</option>
              <option value="renuncia">Renuncia Voluntaria</option>
            </select>
          </div>
          <div className="input-group">
            <label>Fecha de Terminación</label>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-primary mt-16" onClick={calcular}><Scale size={18}/>Calcular Liquidación</button>
      </div>

      {resultado && (
        <div className="liq-result glass-panel mt-24" style={{animation:'slideUp 0.5s ease'}}>
          <h3>Resultado de Liquidación</h3>
          <div className="liq-info">
            <span><strong>Empleado:</strong> {resultado.empleado}</span>
            <span><strong>Antigüedad:</strong> {resultado.antiguedad.anios} años, {resultado.antiguedad.meses} meses</span>
            <span><strong>Tipo:</strong> {tipo === 'injustificado' ? 'Despido Injustificado' : 'Renuncia Voluntaria'}</span>
          </div>
          <div className="liq-items">
            <LiqItem label="Vacaciones Proporcionales" value={resultado.vacaciones}/>
            <LiqItem label="Décimo Tercer Mes (Aguinaldo) Proporcional" value={resultado.decimoTercer}/>
            <LiqItem label="Décimo Cuarto Mes Proporcional" value={resultado.decimoCuarto}/>
            <LiqItem label="Preaviso" value={resultado.preaviso}/>
            <LiqItem label="Auxilio de Cesantía" value={resultado.cesantia}/>
          </div>
          <div className="liq-total">
            <span>TOTAL LIQUIDACIÓN</span>
            <span className="liq-total-value">{formatoMoneda(resultado.total)}</span>
          </div>
          <div style={{display:'flex',gap:12,marginTop:20}}>
            <button className="btn btn-primary" onClick={descargarPDF}><Download size={16}/>Descargar PDF</button>
            <button className="btn btn-success" onClick={guardar}><CheckCircle size={16}/>Guardar</button>
          </div>
        </div>
      )}
      {saved && <div className="success-toast"><CheckCircle size={20}/> Liquidación guardada</div>}
    </div>
  );
}

function LiqItem({ label, value }) {
  return (
    <div className="liq-item">
      <span>{label}</span>
      <span style={{fontWeight:600}}>{formatoMoneda(value)}</span>
    </div>
  );
}
