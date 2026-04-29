import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, Plus, User, Briefcase, MapPin } from 'lucide-react';
import { formatoMoneda } from '../utils/calculoNomina';
import PopupModal from '../components/PopupModal';
import './Empleados.css';

export default function Empleados() {
  const { empleados, addEmpleado } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newEmp, setNewEmp] = useState({ nombre:'', cargo:'', departamento:'', salarioBase:0, fechaIngreso:'', identidad:'', telefono:'', email:'', direccion:'', genero:'M', estadoCivil:'Soltero(a)', tipoContrato:'Indefinido', frecuenciaPago:'mensual', jornada:'diurna', horasJornada:8, moneda:'HNL', estado:'activo', recomendaciones:'', observaciones:'', contactoEmergencia:{nombre:'',telefono:'',parentesco:''}, deducciones:{prestamos:[],embargos:[],fondoPension:0}, foto:'' });

  const filtered = empleados.filter(e => e.nombre.toLowerCase().includes(search.toLowerCase()) || e.cargo.toLowerCase().includes(search.toLowerCase()) || e.departamento.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!newEmp.nombre || !newEmp.cargo) return;
    addEmpleado(newEmp);
    setShowAdd(false);
    setNewEmp({ ...newEmp, nombre:'', cargo:'', departamento:'', salarioBase:0 });
  };

  return (
    <div className="page-content">
      <div className="page-header flex-between">
        <div><h1>Empleados</h1><p>Gestión del personal de la empresa</p></div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={18}/>Nuevo Empleado</button>
      </div>
      <div className="emp-search-bar glass-panel">
        <Search size={18} />
        <input type="text" placeholder="Buscar por nombre, cargo o departamento..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="emp-grid">
        {filtered.map((emp, i) => (
          <div key={emp.id} className="emp-card glass-card" onClick={() => navigate(`/empleados/${emp.id}`)} style={{ animationDelay: `${i*60}ms` }}>
            <div className="emp-card-avatar">
              {emp.foto ? <img src={emp.foto} alt={emp.nombre} /> : <div className="avatar-placeholder"><User size={28}/></div>}
              <span className={`emp-status ${emp.estado}`}></span>
            </div>
            <h4 className="emp-card-name">{emp.nombre}</h4>
            <div className="emp-card-detail"><Briefcase size={14}/><span>{emp.cargo}</span></div>
            <div className="emp-card-detail"><MapPin size={14}/><span>{emp.departamento}</span></div>
            <div className="emp-card-salary">{formatoMoneda(emp.salarioBase, emp.moneda)}</div>
            <span className={`badge badge-${emp.estado==='activo'?'success':'danger'}`}>{emp.estado}</span>
          </div>
        ))}
      </div>

      <PopupModal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Nuevo Empleado" size="lg">
        <div className="grid-2">
          <div className="input-group"><label>Nombre Completo *</label><input value={newEmp.nombre} onChange={e => setNewEmp({...newEmp, nombre:e.target.value})} /></div>
          <div className="input-group"><label>Identidad</label><input value={newEmp.identidad} onChange={e => setNewEmp({...newEmp, identidad:e.target.value})} /></div>
          <div className="input-group"><label>Cargo *</label><input value={newEmp.cargo} onChange={e => setNewEmp({...newEmp, cargo:e.target.value})} /></div>
          <div className="input-group"><label>Departamento</label><input value={newEmp.departamento} onChange={e => setNewEmp({...newEmp, departamento:e.target.value})} /></div>
          <div className="input-group"><label>Salario Base (HNL)</label><input type="number" value={newEmp.salarioBase} onChange={e => setNewEmp({...newEmp, salarioBase:parseFloat(e.target.value)||0})} /></div>
          <div className="input-group"><label>Fecha de Ingreso</label><input type="date" value={newEmp.fechaIngreso} onChange={e => setNewEmp({...newEmp, fechaIngreso:e.target.value})} /></div>
          <div className="input-group"><label>Teléfono</label><input value={newEmp.telefono} onChange={e => setNewEmp({...newEmp, telefono:e.target.value})} /></div>
          <div className="input-group"><label>Email</label><input value={newEmp.email} onChange={e => setNewEmp({...newEmp, email:e.target.value})} /></div>
          <div className="input-group" style={{gridColumn:'1/-1'}}><label>Dirección</label><input value={newEmp.direccion} onChange={e => setNewEmp({...newEmp, direccion:e.target.value})} /></div>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',gap:12,marginTop:20}}>
          <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleAdd}>Guardar Empleado</button>
        </div>
      </PopupModal>
    </div>
  );
}
