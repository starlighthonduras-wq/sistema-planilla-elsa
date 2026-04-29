import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Save, Download, Upload, CheckCircle } from 'lucide-react';
import './Configuracion.css';

export default function Configuracion() {
  const { configuracion, updateConfiguracion, empleados, nominas, liquidaciones } = useApp();
  const [config, setConfig] = useState({ ...configuracion });
  const [saved, setSaved] = useState(false);
  const [empNombre, setEmpNombre] = useState(config.empresa?.nombre || 'Empresa Elsa');
  const [empDir, setEmpDir] = useState(config.empresa?.direccion || '');
  const [empRtn, setEmpRtn] = useState(config.empresa?.rtn || '');
  const [empTel, setEmpTel] = useState(config.empresa?.telefono || '');

  const guardar = () => {
    updateConfiguracion({
      ...config,
      empresa: { ...config.empresa, nombre: empNombre, direccion: empDir, rtn: empRtn, telefono: empTel }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const exportarDatos = () => {
    const data = { empleados, nominas, liquidaciones, configuracion };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `backup_planilla_${new Date().toISOString().split('T')[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const importarDatos = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        localStorage.setItem('planillaElsa', JSON.stringify(data));
        window.location.reload();
      } catch { alert('Archivo inválido'); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="page-content">
      <div className="page-header"><h1>Configuración</h1><p>Ajustes del sistema y parámetros legales</p></div>

      <div className="config-grid">
        <div className="glass-panel config-section">
          <h3>Datos de la Empresa</h3>
          <div className="input-group"><label>Nombre</label><input value={empNombre} onChange={e => setEmpNombre(e.target.value)}/></div>
          <div className="input-group"><label>RTN</label><input value={empRtn} onChange={e => setEmpRtn(e.target.value)}/></div>
          <div className="input-group"><label>Dirección</label><input value={empDir} onChange={e => setEmpDir(e.target.value)}/></div>
          <div className="input-group"><label>Teléfono</label><input value={empTel} onChange={e => setEmpTel(e.target.value)}/></div>
        </div>

        <div className="glass-panel config-section">
          <h3>Parámetros IHSS</h3>
          <div className="input-group"><label>Techo de Cotización (L)</label><input type="number" value={config.techoIHSS} onChange={e => setConfig({...config, techoIHSS: parseFloat(e.target.value)||0})}/></div>
          <div className="input-group"><label>% IVM (Empleado)</label><input type="number" step="0.1" value={config.porcentajeIHSS_IVM} onChange={e => setConfig({...config, porcentajeIHSS_IVM: parseFloat(e.target.value)||0})}/></div>
          <div className="input-group"><label>% EM (Empleado)</label><input type="number" step="0.1" value={config.porcentajeIHSS_EM} onChange={e => setConfig({...config, porcentajeIHSS_EM: parseFloat(e.target.value)||0})}/></div>
          <div className="input-group"><label>% RAP</label><input type="number" step="0.1" value={config.porcentajeRAP} onChange={e => setConfig({...config, porcentajeRAP: parseFloat(e.target.value)||0})}/></div>
        </div>

        <div className="glass-panel config-section">
          <h3>Tipos de Cambio</h3>
          <div className="input-group"><label>USD → HNL</label><input type="number" step="0.01" value={config.tiposCambio?.USD || 24.85} onChange={e => setConfig({...config, tiposCambio: {...config.tiposCambio, USD: parseFloat(e.target.value)||0}})}/></div>
          <div className="input-group"><label>EUR → HNL</label><input type="number" step="0.01" value={config.tiposCambio?.EUR || 27.50} onChange={e => setConfig({...config, tiposCambio: {...config.tiposCambio, EUR: parseFloat(e.target.value)||0}})}/></div>
        </div>

        <div className="glass-panel config-section">
          <h3>Backup y Restauración</h3>
          <p style={{color:'var(--text-secondary)',fontSize:'0.85rem',marginBottom:16}}>Exporta o importa todos los datos del sistema en formato JSON.</p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <button className="btn btn-primary" onClick={exportarDatos}><Download size={16}/>Exportar Datos</button>
            <label className="btn btn-secondary" style={{cursor:'pointer'}}><Upload size={16}/>Importar Datos<input type="file" accept=".json" onChange={importarDatos} hidden/></label>
          </div>
        </div>
      </div>

      <div style={{display:'flex',justifyContent:'flex-end',marginTop:24}}>
        <button className="btn btn-primary" onClick={guardar}><Save size={18}/>Guardar Configuración</button>
      </div>
      {saved && <div className="success-toast"><CheckCircle size={20}/> Configuración guardada</div>}
    </div>
  );
}
