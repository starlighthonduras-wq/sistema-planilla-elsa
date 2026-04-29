import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, User, Edit3, FileText, Camera } from 'lucide-react';
import { formatoMoneda, calcularIHSS, calcularISR, calcularRAP } from '../utils/calculoNomina';
import PopupModal from '../components/PopupModal';
import './FichaEmpleado.css';

export default function FichaEmpleado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { empleados, updateEmpleado, configuracion } = useApp();
  const emp = empleados.find(e => e.id === id);
  const [tab, setTab] = useState('personal');
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({});

  if (!emp) return <div className="page-content"><p>Empleado no encontrado</p></div>;

  const ihss = calcularIHSS(emp.salarioBase, configuracion);
  const isr = calcularISR(emp.salarioBase, configuracion);
  const rap = calcularRAP(emp.salarioBase, configuracion);

  const openEdit = () => { setEditData({...emp}); setShowEdit(true); };
  const saveEdit = () => { updateEmpleado(id, editData); setShowEdit(false); };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateEmpleado(id, { foto: ev.target.result });
    reader.readAsDataURL(file);
  };

  const tabs = ['personal','laboral','deducciones','recomendaciones'];
  const tabLabels = { personal:'Información Personal', laboral:'Información Laboral', deducciones:'Deducciones', recomendaciones:'Notas' };

  return (
    <div className="page-content">
      <button className="btn btn-secondary mb-24" onClick={() => navigate('/empleados')}><ArrowLeft size={18}/>Volver</button>
      <div className="ficha-header glass-panel">
        <div className="ficha-avatar-wrap">
          <div className="ficha-avatar">
            {emp.foto ? <img src={emp.foto} alt={emp.nombre}/> : <div className="ficha-avatar-ph"><User size={48}/></div>}
          </div>
          <label className="ficha-photo-btn"><Camera size={16}/><input type="file" accept="image/*" onChange={handlePhoto} hidden/></label>
        </div>
        <div className="ficha-info">
          <h2>{emp.nombre}</h2>
          <p className="ficha-cargo">{emp.cargo} — {emp.departamento}</p>
          <div className="ficha-meta">
            <span className={`badge badge-${emp.estado==='activo'?'success':'danger'}`}>{emp.estado}</span>
            <span className="ficha-since">Desde {new Date(emp.fechaIngreso).toLocaleDateString('es-HN',{year:'numeric',month:'long'})}</span>
          </div>
          <p className="ficha-salary">{formatoMoneda(emp.salarioBase, emp.moneda)} <span>/{emp.frecuenciaPago}</span></p>
        </div>
        <button className="btn btn-primary" onClick={openEdit}><Edit3 size={16}/>Editar</button>
      </div>

      <div className="ficha-tabs">
        {tabs.map(t => <button key={t} className={`tab-btn ${tab===t?'active':''}`} onClick={() => setTab(t)}>{tabLabels[t]}</button>)}
      </div>

      <div className="ficha-tab-content glass-panel">
        {tab === 'personal' && (
          <div className="grid-2">
            <InfoRow label="Identidad" value={emp.identidad}/>
            <InfoRow label="Fecha Nacimiento" value={emp.fechaNacimiento ? new Date(emp.fechaNacimiento).toLocaleDateString('es-HN') : '-'}/>
            <InfoRow label="Género" value={emp.genero==='M'?'Masculino':'Femenino'}/>
            <InfoRow label="Estado Civil" value={emp.estadoCivil}/>
            <InfoRow label="Teléfono" value={emp.telefono}/>
            <InfoRow label="Email" value={emp.email}/>
            <InfoRow label="Dirección" value={emp.direccion} full/>
            <InfoRow label="Contacto Emergencia" value={`${emp.contactoEmergencia?.nombre || '-'} (${emp.contactoEmergencia?.parentesco || ''}) — ${emp.contactoEmergencia?.telefono || ''}`} full/>
          </div>
        )}
        {tab === 'laboral' && (
          <div className="grid-2">
            <InfoRow label="Cargo" value={emp.cargo}/>
            <InfoRow label="Departamento" value={emp.departamento}/>
            <InfoRow label="Fecha Ingreso" value={new Date(emp.fechaIngreso).toLocaleDateString('es-HN')}/>
            <InfoRow label="Tipo Contrato" value={emp.tipoContrato}/>
            <InfoRow label="Salario Base" value={formatoMoneda(emp.salarioBase, emp.moneda)}/>
            <InfoRow label="Frecuencia Pago" value={emp.frecuenciaPago}/>
            <InfoRow label="Jornada" value={emp.jornada}/>
            <InfoRow label="Horas/Día" value={emp.horasJornada}/>
          </div>
        )}
        {tab === 'deducciones' && (
          <div>
            <h4 className="ded-section-title">Deducciones de Ley (Automáticas)</h4>
            <div className="grid-3 mb-24">
              <DedCard label="IHSS (IVM)" value={formatoMoneda(ihss.ivm)} color="purple"/>
              <DedCard label="IHSS (EM)" value={formatoMoneda(ihss.em)} color="teal"/>
              <DedCard label="ISR" value={formatoMoneda(isr)} color="pink"/>
              <DedCard label="RAP" value={formatoMoneda(rap)} color="gold"/>
              <DedCard label="Total Ley" value={formatoMoneda(ihss.total + isr + rap)} color="purple"/>
            </div>
            {emp.deducciones?.prestamos?.length > 0 && (
              <>
                <h4 className="ded-section-title">Préstamos Internos</h4>
                {emp.deducciones.prestamos.map(p => (
                  <div key={p.id} className="prestamo-row glass-card">
                    <span>{p.descripcion}</span>
                    <span>Cuota: {formatoMoneda(p.cuotaMensual)}</span>
                    <span>Saldo: {formatoMoneda(p.saldoPendiente)}</span>
                  </div>
                ))}
              </>
            )}
            {emp.deducciones?.embargos?.length > 0 && (
              <>
                <h4 className="ded-section-title mt-16">Embargos Judiciales</h4>
                {emp.deducciones.embargos.map(e => (
                  <div key={e.id} className="prestamo-row glass-card">
                    <span>{e.descripcion}</span>
                    <span>{e.porcentaje > 0 ? `${e.porcentaje}%` : formatoMoneda(e.montoFijo)}</span>
                  </div>
                ))}
              </>
            )}
            {emp.deducciones?.fondoPension > 0 && <p className="mt-16" style={{color:'var(--text-secondary)',fontSize:'0.85rem'}}>Fondo Pensión Privado: {formatoMoneda(emp.deducciones.fondoPension)}</p>}
          </div>
        )}
        {tab === 'recomendaciones' && (
          <div className="grid-2">
            <div>
              <h4 className="ded-section-title" style={{color:'var(--success)'}}>✨ Recomendaciones</h4>
              <p className="notes-text">{emp.recomendaciones || 'Sin recomendaciones registradas.'}</p>
            </div>
            <div>
              <h4 className="ded-section-title" style={{color:'var(--warning)'}}>📋 Observaciones</h4>
              <p className="notes-text">{emp.observaciones || 'Sin observaciones registradas.'}</p>
            </div>
          </div>
        )}
      </div>

      <PopupModal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Editar Empleado" size="lg">
        <div className="grid-2">
          <div className="input-group"><label>Nombre</label><input value={editData.nombre||''} onChange={e => setEditData({...editData,nombre:e.target.value})}/></div>
          <div className="input-group"><label>Cargo</label><input value={editData.cargo||''} onChange={e => setEditData({...editData,cargo:e.target.value})}/></div>
          <div className="input-group"><label>Departamento</label><input value={editData.departamento||''} onChange={e => setEditData({...editData,departamento:e.target.value})}/></div>
          <div className="input-group"><label>Salario Base</label><input type="number" value={editData.salarioBase||0} onChange={e => setEditData({...editData,salarioBase:parseFloat(e.target.value)||0})}/></div>
          <div className="input-group"><label>Teléfono</label><input value={editData.telefono||''} onChange={e => setEditData({...editData,telefono:e.target.value})}/></div>
          <div className="input-group"><label>Email</label><input value={editData.email||''} onChange={e => setEditData({...editData,email:e.target.value})}/></div>
          <div className="input-group" style={{gridColumn:'1/-1'}}><label>Recomendaciones</label><textarea rows={3} value={editData.recomendaciones||''} onChange={e => setEditData({...editData,recomendaciones:e.target.value})}/></div>
          <div className="input-group" style={{gridColumn:'1/-1'}}><label>Observaciones</label><textarea rows={3} value={editData.observaciones||''} onChange={e => setEditData({...editData,observaciones:e.target.value})}/></div>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',gap:12,marginTop:20}}>
          <button className="btn btn-secondary" onClick={() => setShowEdit(false)}>Cancelar</button>
          <button className="btn btn-primary" onClick={saveEdit}>Guardar</button>
        </div>
      </PopupModal>
    </div>
  );
}

function InfoRow({ label, value, full }) {
  return (
    <div className={`info-row ${full?'full':''}`}>
      <span className="info-label">{label}</span>
      <span className="info-value">{value || '-'}</span>
    </div>
  );
}

function DedCard({ label, value, color }) {
  return (
    <div className={`ded-card ded-${color}`}>
      <span className="ded-label">{label}</span>
      <span className="ded-value">{value}</span>
    </div>
  );
}
