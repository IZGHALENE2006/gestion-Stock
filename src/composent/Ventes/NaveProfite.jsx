import { NavLink } from "react-router-dom";
import { IoPeopleOutline, IoBarChartOutline } from "react-icons/io5";

export default function NaveProfite() {
  return (
    /* - bg-white: blast l-k7al
       - border-slate-200: khit fate7
       - shadow-sm: shadow khfif dial l-light mode
    */
    <div className="flex justify-start gap-6 bg-white border border-slate-200 shadow-sm p-3 rounded-2xl mb-6">
      
      {/* Ventes Link */}
      <NavLink 
        to="/Home/Profit/Ventes" 
        className={({ isActive }) => `
          flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-200
          ${isActive 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
          }
        `}
      >
        <IoPeopleOutline size={20} />
        <span className="text-sm">Ventes</span>
      </NavLink>

      {/* Facture Link */}
      <NavLink 
        to="/Home/Profit/Facture" 
        className={({ isActive }) => `
          flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-200
          ${isActive 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
          }
        `}
      >
        <IoBarChartOutline size={20} />
        <span className="text-sm">Facture</span>
      </NavLink>

    </div>
  );
}