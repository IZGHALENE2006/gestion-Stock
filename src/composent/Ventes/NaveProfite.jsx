import { NavLink } from "react-router-dom";
import { IoPeopleOutline, IoBarChartOutline } from "react-icons/io5";

export default function NaveProfite() {
  return (
    /* - Standardized with your dashboard's container style 
       - Glass effect in dark mode
    */
    <div className="flex justify-start gap-4 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm p-2 rounded-2xl mb-8 backdrop-blur-md transition-all">
      
      {/* Ventes Link */}
      <NavLink 
        to="/Home/Profit/Ventes" 
        className={({ isActive }) => `
          flex items-center gap-3 px-6 py-3 rounded-[1.2rem] text-xs font-black uppercase tracking-widest transition-all duration-300
          ${isActive 
            ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 scale-105' 
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-600'
          }
        `}
      >
        <IoPeopleOutline size={18} className={({ isActive }) => isActive ? 'animate-pulse' : ''} />
        <span>Ventes</span>
      </NavLink>

      {/* Facture Link */}
      <NavLink 
        to="/Home/Profit/Facture" 
        className={({ isActive }) => `
          flex items-center gap-3 px-6 py-3 rounded-[1.2rem] text-xs font-black uppercase tracking-widest transition-all duration-300
          ${isActive 
            ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 scale-105' 
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-600'
          }
        `}
      >
        <IoBarChartOutline size={18} />
        <span>Facture</span>
      </NavLink>

    </div>
  );
}