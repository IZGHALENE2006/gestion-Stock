import { NavLink } from "react-router-dom";
import { IoPeopleOutline, IoBarChartOutline } from "react-icons/io5";

export default function NaveProfite() {
  return (
    <div className="flex justify-start gap-6 bg-[#1e293b] border border-slate-700 shadow-xl  p-4 rounded-xl shadow-md">
      
      {/* Employees List */}
      <NavLink 
        to="/Home/Profit/Ventes" 
        className={({ isActive }) => `
          flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition
          ${isActive 
            ? 'bg-[#2C74B3] text-white'
            : 'text-gray-400 hover:bg-[#2C74B3]/30 hover:text-white'
          }
        `}
      >
        <IoPeopleOutline size={22} />
        <span>Ventes</span>
      </NavLink>

      {/* Statistics */}
      <NavLink 
        to="/Home/Profit/Facture" 
        className={({ isActive }) => `
          flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition
          ${isActive 
            ? 'bg-[#2C74B3] text-white'
            : 'text-gray-400 hover:bg-[#2C74B3]/30 hover:text-white'
          }
        `}
      >
        <IoBarChartOutline size={22} />
        <span>Facture</span>
      </NavLink>

    </div>
  );
}
