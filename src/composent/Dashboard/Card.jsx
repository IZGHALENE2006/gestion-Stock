export default function Card({ data }) {
  
  return (
    <div className="group relative overflow-hidden bg-white border border-slate-100 rounded-[2.5rem] p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
      {/* L-Glow effect f l-top right */}
      <div className={`duration-700 absolute -right-12 -top-12 w-32 h-32 bg-gradient-to-br ${data.gradient} to-transparent opacity-[0.08] blur-3xl rounded-full group-hover:opacity-20`} />
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Icon container b background fate7 mn nefss lon l-e7sa'iya */}
        <div className={`${data.text} ${data.bgIcon || 'bg-slate-50'} w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-sm border border-white/50`}>
          {data.icon}
        </div>
        
        <div>
          <p className="text-slate-400 text-[11px] uppercase font-black tracking-[0.15em]">
            {data.label}
          </p>
          <p className="text-3xl font-black text-slate-800 mt-1 tracking-tight">
            {data.value}
          </p>
        </div>
      </div>
    </div>
  );
}