
export default function Card({data, key}) {
  return (
            <div
              key={key}
              className={`group relative overflow-hidden bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 ${data.border} transition-all group`}
            >
              <div className={`group-hover:-right-4 group-hover:-top-4 duration-500 absolute -right-14 -top-10 w-24 h-24 bg-linear-to-br ${data.gradient} to-white/20 blur-2xl rounded-full`} />
            <div className="relative z-10">
              <div className={`${data.text} text-2xl mb-4`}>{data.icon}</div>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{data.label}</p>
              <p className="text-2xl font-black text-white mt-1">{data.value}</p>
            </div>
          </div>
            )
}
