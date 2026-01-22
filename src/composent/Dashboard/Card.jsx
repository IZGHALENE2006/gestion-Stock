export default function Card({ data }) {
  return (
    <div className={`group relative overflow-hidden border transition-all duration-300 
      /* Light Mode: Now using the data.gradient */
      bg-linear-to-br ${data.gradient} border-white/20 shadow-sm hover:shadow-xl hover:-translate-y-2 
      /* Dark Mode: Keeps your original slate style */
      dark:bg-slate-900/40 dark:from-transparent dark:to-transparent dark:border-slate-700 dark:shadow-none dark:hover:bg-slate-800/50
      rounded-[2.5rem] p-5`}>
      
      <div className={`duration-700 absolute -right-12 -top-12 w-32 h-32 bg-linear-to-br ${data.gradient} to-transparent 
        opacity-20 dark:opacity-[0.75] blur-3xl rounded-full group-hover:opacity-40`} />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className={`
          ${data.text} 
          ${data.bgIcon || 'bg-white/80 dark:bg-slate-800'} 
          backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-sm border border-white/50 dark:border-slate-700`}>
          {data.icon}
        </div>
        
        <div>
          <p className="text-white/80 dark:text-slate-500 text-[11px] uppercase font-black tracking-[0.15em]">
            {data.label}
          </p>
          <p className="text-3xl font-black text-white dark:text-slate-100 mt-1 tracking-tight">
            {data.value}
          </p>
        </div>
      </div>
    </div>
  );
}