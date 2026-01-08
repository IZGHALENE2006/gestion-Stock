import { useState } from 'react';
import { 
  IoGridOutline, IoPeopleOutline, IoCartOutline, 
  IoBarChartOutline, IoCardOutline, IoCalendarOutline, 
  IoPersonOutline 
} from "react-icons/io5";
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const {admin,loading,error} = useSelector((state)=>{
    return state.LoginAdmin
  })
  return (
    <div className="fixed z-1000 flex min-h-screen bg-[#0f1016]">
      <div
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`fixed left-0 top-0 h-full bg-[#11121a] backdrop-blur-lg border-r border-[#42434a] text-white 
          transition-all duration-300 ease-in-out flex flex-col overflow-hidden
          ${isExpanded ? 'w-64' : 'w-20'}`}
      >
        
        <div className="flex items-center h-20 px-6">
          <div className="bg-[#2C74B3] p-2 rounded-lg min-w-[32px]">
            <div className="w-4 h-4 bg-white rounded-sm" /> 
          </div>
          <span className={`ml-4 font-bold text-[#2C74B3] transition-opacity duration-300 whitespace-nowrap
            ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            Gestion De Stock
          </span>
        </div>

        <nav className="flex-grow px-3 mt-4 space-y-2">
          <NavItem to="/Home/Dashboard" icon={<IoBarChartOutline size={22} />} label="Dashboard" expanded={isExpanded} />
          <NavItem to="/products" icon={<IoGridOutline size={22} />} label="Products" expanded={isExpanded} />
          <NavItem to="/employees" icon={<IoPeopleOutline size={22} />} label="Employees" expanded={isExpanded} />
          <NavItem to="/sell" icon={<IoCartOutline size={22} />} label="Sell" expanded={isExpanded} />
          <NavItem to="/profits" icon={<IoCardOutline size={22} />} label="Profits" expanded={isExpanded} />
          <NavItem to="/history" icon={<IoCalendarOutline size={22} />} label="History" expanded={isExpanded} />
        </nav>

        <div className="p-4 border-t border-[#42434a] flex items-center">
          <div className="min-w-[40px] overflow-hidden h-10 rounded-full bg-[#2C74B3] flex items-center justify-center font-bold">
            <IoPersonOutline size={35} className='mt-3.5'/>
          </div>
          <div className={`ml-3 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-sm font-medium whitespace-nowrap">{admin.name}</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
      </div>

    </div>
  );
}

function NavItem({ to, icon, label, expanded }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        flex items-center h-12 rounded-xl transition-all duration-200 
        ${isActive 
          ? 'bg-[#2C74B3] text-white' 
          : 'text-gray-400 hover:bg-[#222533] hover:text-white'
        }
      `}
    >
      <div className="min-w-[56px] flex justify-center items-center">
        {icon}
      </div>

      <span className={`font-medium transition-opacity duration-300 whitespace-nowrap
        ${expanded ? 'opacity-100' : 'opacity-0'}`}>
        {label}
      </span>
    </NavLink>
  );
}