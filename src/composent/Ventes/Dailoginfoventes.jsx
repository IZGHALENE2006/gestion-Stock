import React from 'react';
import { 
  HiOutlineCube, HiOutlineCash, 
  HiOutlineTrendingUp, HiOutlineCalendar,
  HiOutlineHashtag, HiOutlineEye 
} from "react-icons/hi";

const DailogInfoVentes = ({ vente, onClose, onViewProduct }) => {
  if (!vente) return null;

  // Optimized StatCard to match your new theme
  const StatCard = ({ icon, label, value, subValue, colorClass, darkIconColor }) => (
    <div className={`relative overflow-hidden group
      p-5 rounded-[2rem] transition-all duration-500 border flex items-center gap-4
      /* Light Mode */
      bg-white shadow-sm border-slate-100 hover:shadow-md hover:-translate-y-1
      /* Dark Mode */
      dark:bg-slate-900/40 dark:border-slate-800 dark:shadow-none
    `}>
      {/* Icon Container with Blur */}
      <div className={`p-3 rounded-2xl 
        /* Light */
        bg-slate-50 text-slate-600 border border-slate-100
        /* Dark */
        dark:bg-slate-800/50 ${darkIconColor} dark:border-slate-700
        backdrop-blur-md transition-transform group-hover:scale-110`}>
        {icon}
      </div>

      <div className="relative z-10">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5 
          text-slate-400 dark:text-slate-500">
          {label}
        </p>
        <h2 className="text-sm font-black tracking-tight text-slate-800 dark:text-slate-100">
          {value}
        </h2>
        {subValue && <p className="text-[8px] font-bold text-slate-400 dark:text-slate-600 italic uppercase">{subValue}</p>}
      </div>
    </div>
  );

  return (
    <div className="p-2 rounded-[2.5rem] overflow-hidden transition-colors duration-300">
      
      <div className="space-y-6">
        
        {/* Header: Product Main Info */}
        <div className={`relative overflow-hidden group p-6 rounded-[2.2rem] border flex items-center justify-between
          /* Light Mode Gradient */
          bg-linear-to-br from-emerald-600 to-emerald-800 shadow-xl shadow-emerald-900/20 border-emerald-500/20
          /* Dark Mode */
          dark:bg-none dark:bg-slate-900/40 dark:border-slate-800 dark:shadow-none
        `}>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {vente.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-black text-white leading-none mb-1 tracking-tighter uppercase">{vente.name}</h3>
              <p className="text-[10px] font-bold text-emerald-100/60 dark:text-slate-500 tracking-widest uppercase">ID: {vente.idProduct || '---'}</p>
            </div>
          </div>

          {/* Glowing Blur Circle (Dark Mode Only) */}
          <div className="duration-700 absolute -right-12 -top-12 w-32 h-32 bg-emerald-500 opacity-20 dark:opacity-40 blur-3xl rounded-full group-hover:-right-4 group-hover:-top-4 transition-all" />

          <button 
            onClick={() => onViewProduct(vente.idProduct)}
            className="relative z-10 flex items-center gap-2 px-5 py-3 bg-white dark:bg-emerald-600 text-emerald-700 dark:text-white text-[10px] font-black rounded-xl shadow-xl transition-all active:scale-90 hover:bg-emerald-50 dark:hover:bg-emerald-500 uppercase tracking-widest"
          >
            <HiOutlineEye size={18} />
            <span>Détails Produit</span>
          </button>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard 
              icon={<HiOutlineCash size={22}/>} 
              label="Prix de Vente" 
              value={`${vente.price?.toLocaleString()} DH`}
              subValue="Prix unitaire"
              darkIconColor="dark:text-amber-400"
            />

            <StatCard 
              icon={<HiOutlineCube size={22}/>} 
              label="Quantité" 
              value={`${vente.quantite} Unités`}
              subValue="Volume total"
              darkIconColor="dark:text-blue-400"
            />

            <StatCard 
              icon={<HiOutlineTrendingUp size={22}/>} 
              label="Profit" 
              value={`${vente.profite?.toLocaleString()} DH`}
              subValue="Gain net"
              darkIconColor="dark:text-emerald-400  "
            />

            <StatCard 
              icon={<HiOutlineCalendar size={22}/>} 
              label="Date & Heure" 
              value={new Date(vente.DateVante).toLocaleDateString()}
              subValue={new Date(vente.DateVante).toLocaleTimeString()}
              darkIconColor="dark:text-purple-400"
            />
        </div>

        {/* Footer Summary */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2">
                <HiOutlineHashtag size={14} className="text-emerald-500" />
                <span>Transaction: <span className="text-emerald-600 dark:text-emerald-400">Validée</span></span>
            </div>
            <div className="italic opacity-50">
                System Log ID: {String(vente._id).slice(-8)}
            </div>
        </div>

      </div>
    </div>
  );
};

export default DailogInfoVentes;