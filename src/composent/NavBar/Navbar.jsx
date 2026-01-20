import { useEffect, useState } from 'react';
import { 
  IoGridOutline, IoPeopleOutline, IoCartOutline, 
  IoBarChartOutline, IoCardOutline, IoCalendarOutline, 
  IoPersonOutline, IoLogOutOutline, IoSettingsOutline ,IoPricetagsOutline , IoBusinessOutline 
} from "react-icons/io5";
import { useSelector ,useDispatch} from 'react-redux';
import { NavLink, useNavigate } from 'react-router';
import { getMe, logoutAdmin } from '../../slices/SliceLoginAdmin';
export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, role,token,loading } = useSelector(state => state.LoginAdmin);


   
  
const dispatch = useDispatch()
const nav  =  useNavigate()
useEffect(()=>{
 if(token){
   dispatch(getMe())
 }
},[dispatch,token])

  const handleProfileClick = () => {
    setProfileOpen(!profileOpen);
  }
  function HanleLogoutAdmin(){
    dispatch(logoutAdmin())
    nav('/LoginAdmin')
  }

  return (
    <div className="fixed z-50 flex min-h-screen bg-[#0f1016]">
      <div
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`fixed left-0 top-0 h-full bg-[#11121a]/50 backdrop-blur-lg border-r border-[#42434a] text-white 
          transition-all duration-300 ease-in-out flex flex-col overflow-hidden
          ${isExpanded ? 'w-64' : 'w-20'}`}
      >
        
        {/* Logo */}
        <div className="flex items-center h-20 px-6">
          <div className="bg-[#2C74B3] p-2 rounded-lg min-w-8">
            <div className="w-4 h-4 bg-white rounded-sm" /> 
          </div>
          <span className={`ml-4 font-bold text-[#2C74B3] transition-opacity duration-300 whitespace-nowrap
            ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            Gestion De Stock
          </span>
        </div>

        {/* Nav */}
        <nav className="grow px-3 mt-4 space-y-2">
          <NavItem to="/Home/Dashboard" icon={<IoBarChartOutline size={22} />} label="Dashboard" expanded={isExpanded} />
          <NavItem to="/Home/Categories" icon={<IoPricetagsOutline  size={22} />} label="Categories" expanded={isExpanded} />
         
          <NavItem to="/Home/products" icon={<IoGridOutline size={22} />} label="Products" expanded={isExpanded} />
{role=='admin'&&<NavItem to="/Home/employees/EmployeeDashboard" icon={<IoPeopleOutline size={22} />} label="Employees" expanded={isExpanded} />
}
          <NavItem to="/Home/Fornisseur" icon={<IoBusinessOutline size={22} />} label="Fornisseur" expanded={isExpanded} />
          <NavItem to="/Home/Caisse" icon={<IoCartOutline size={22} />} label="Caisse" expanded={isExpanded} />
          <NavItem to="/Home/profits" icon={<IoCardOutline size={22} />} label="Profits" expanded={isExpanded} />
          <NavItem to="/Home/history" icon={<IoCalendarOutline size={22} />} label="History" expanded={isExpanded} />
        </nav>

        {/* Profile */}
        <div className="p-4 border-t border-[#42434a] relative">
          <div className="flex items-center cursor-pointer" onClick={handleProfileClick}>
            <div className="min-w-10 overflow-hidden h-10 rounded-full bg-[#2C74B3] flex items-center justify-center font-bold">
              <IoPersonOutline size={35} className='mt-3.5'/>
            </div>
            <div className={`ml-3 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
              <p className="text-sm font-medium whitespace-nowrap">  {user?.name || "user"}</p>
              <p className="text-xs text-gray-500">{role}</p>
            </div>
          </div>

          {/* Dropdown menu */}
          {profileOpen && isExpanded && (
            <div className="absolute left-0 bottom-15 w-42 bg-[#1b1c25] shadow-lg rounded-lg overflow-hidden">
              <button className="flex items-center w-full px-4 py-2 text-gray-200 hover:bg-[#2C74B3] transition">
                <IoSettingsOutline className="mr-2"/> Profile
              </button>
              <button className="flex items-center w-full px-4 py-2 text-gray-200 hover:bg-red-600 transition" onClick={HanleLogoutAdmin}>
                <IoLogOutOutline className="mr-2"/> Logout
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// NavItem helper
function NavItem({ to, icon, label, expanded }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        flex items-center h-12 rounded-xl transition-all duration-200 
        ${isActive 
          ? 'bg-[#2C74B3] text-white' 
          : 'text-gray-400 hover:bg-[#2C74B3]/30 hover:text-white'
        }
      `}
    >
      <div className="min-w-14 flex justify-center items-center">
        {icon}
      </div>
      <span className={`font-medium transition-opacity duration-300 whitespace-nowrap
        ${expanded ? 'opacity-100' : 'opacity-0'}`}>
        {label}
      </span>
    </NavLink>
  );
}
