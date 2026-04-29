import './KPICard.css';

export default function KPICard({ icon: Icon, label, value, sub, color = 'purple', delay = 0 }) {
  return (
    <div className={`kpi-card kpi-${color}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="kpi-icon-wrap"><Icon size={22} /></div>
      <div className="kpi-info">
        <span className="kpi-label">{label}</span>
        <span className="kpi-value">{value}</span>
        {sub && <span className="kpi-sub">{sub}</span>}
      </div>
      <div className="kpi-glow"></div>
    </div>
  );
}
