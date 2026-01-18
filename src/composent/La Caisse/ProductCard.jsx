import { IoAddCircle } from "react-icons/io5";

export default function ProductCard({ item , click }) {
  const statusStyles = {
    active: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20",
    low: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20",
    out: "from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/20",
  };

  const currentStatus = item.status || 'active';

  return (
    <div 
    onClick={click}
    className="cursor-pointer group relative overflow-hidden bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#2C74B3]/10 hover:border-[#2C74B3]/50">
    
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#2C74B3]/10 blur-3xl rounded-full group-hover:bg-[#2C74B3]/20 transition-colors" />

      <div className="flex justify-between items-center mb-6">
        <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
          {item.categorie}
        </span>
        <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase bg-linear-to-tr ${statusStyles[currentStatus]}`}>
          ● {item.status || 'Disponible'}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#2C74B3] to-[#1e293b] flex items-center justify-center text-white font-bold shadow-lg">
            {item.name.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-xl font-bold text-white leading-tight group-hover:text-[#2C74B3] transition-colors">
            {item.name}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-800/50">
        <div>
          <p className="text-slate-500 text-[10px] uppercase font-semibold">Stock</p>
          <p className="text-slate-200 font-medium">{item.quantite} Unités</p>
        </div>
        <div className="text-right">
          <p className="text-slate-500 text-[10px] uppercase font-semibold">Prix Unitaire</p>
          <p className="text-slate-200 font-medium">{item.prix_vente} DH</p>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-end">
        <div>
          <p className="text-slate-500 text-[10px] font-medium italic">Valeur totale</p>
          <p className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400">
            {item.prix_vente * item.quantite} 
            <span className="text-sm ml-1 text-slate-500 font-normal">DH</span>
          </p>
        </div>
        
        <div className="opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <IoAddCircle className="text-[#2C74B3]" size={32}/>
        </div>
      </div>
    </div>
  );
}