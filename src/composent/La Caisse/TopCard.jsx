import "./Caisse.css"

export default function TopCard({ title, value, color, icon, className }) {
  return (
  <div className={`${className} CaisseCard bg-[#1e293b] p-4 rounded-2xl border border-slate-700 flex items-center gap-4 shadow-lg hover:border-slate-500 transition-colors`}>
    
    <div className={`p-3 rounded-xl bg-[#0f172a] ${color}`}>{icon}</div>
    <div>
      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">{title}</p>
      <h3 className="text-xl font-black">{value}</h3>
    </div>
  </div>
  )
}
