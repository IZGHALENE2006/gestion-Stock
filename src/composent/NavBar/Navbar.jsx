import { useEffect, useState } from 'react';
import { 
  IoGridOutline, IoPeopleOutline, IoCartOutline, 
  IoBarChartOutline, IoCardOutline, IoCalendarOutline, 
  IoPersonOutline, IoLogOutOutline, IoSettingsOutline, IoPricetagsOutline, IoBusinessOutline 
} from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { getMe, logoutAdmin } from '../../slices/SliceLoginAdmin';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, role, token } = useSelector(state => state.LoginAdmin);

  const dispatch = useDispatch();
  const nav = useNavigate();

  useEffect(() => {
    if (token) {
      dispatch(getMe());
    }
  }, [dispatch, token]);

  const handleProfileClick = () => {
    setProfileOpen(!profileOpen);
  }

  function HanleLogoutAdmin() {
    dispatch(logoutAdmin());
    nav('/LoginAdmin');
  }

  return (
    <div className="fixed z-50 flex min-h-screen">
      <div
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 
          transition-all duration-300 ease-in-out flex flex-col overflow-hidden shadow-2xl
          ${isExpanded ? 'w-64' : 'w-20'}`}
      >
        
        {/* Logo */}
        <div className="flex items-center h-20 px-6">
          <div className="bg-[#19b393] p-2 rounded-xl min-w-10 h-10 flex items-center justify-center shadow-lg shadow-green-200 dark:shadow-green-900/20">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45" /> 
          </div>
          <span className={`ml-4 font-black text-slate-800 dark:text-slate-100 text-lg transition-opacity duration-300 whitespace-nowrap
            ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            STOCK <span className='text-[#19b393]'>PRO</span>
          </span>
        </div>

        {/* Nav Links */}
        <nav className="grow px-3 mt-4 space-y-1.5">
          {role === 'admin' && <NavItem to="/Home/Dashboard" icon={<IoBarChartOutline size={22} />} label="Dashboard" expanded={isExpanded} />}
          <NavItem to="/Home/Categories" icon={<IoPricetagsOutline size={22} />} label="Catégories" expanded={isExpanded} />
          <NavItem to="/Home/products" icon={<IoGridOutline size={22} />} label="Produits" expanded={isExpanded} />
          {role === 'admin' && <NavItem to="/Home/employees/EmployeeDashboard" icon={<IoPeopleOutline size={22} />} label="Employés" expanded={isExpanded} />}
          {role === 'admin' && <NavItem to="/Home/Fornisseur" icon={<IoBusinessOutline size={22} />} label="Fournisseurs" expanded={isExpanded} />}
          <NavItem to="/Home/Caisse" icon={<IoCartOutline size={22} />} label="Caisse" expanded={isExpanded} />
          <NavItem to="/Home/Profit/Ventes" icon={<IoCardOutline size={22} />} label="Profits" expanded={isExpanded} />
          <NavItem to="/Home/history" icon={<IoCalendarOutline size={22} />} label="Historique" expanded={isExpanded} />
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 relative">
          <div className="flex items-center cursor-pointer p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" onClick={handleProfileClick}>
            <div className="min-w-10 h-10 rounded-xl bg-[#19b393]/20 border border-green-100 dark:border-green-900/30 flex items-center justify-center text-[#19b393] font-bold">
              <IoPersonOutline size={20} />
            </div>
            <div className={`ml-3 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap capitalize">{user?.name || "User"}</p>
              <p className="text-[10px] text-[#19b393] font-black uppercase tracking-wider">{role}</p>
            </div>
          </div>

          {/* Dropdown Menu */}
          {profileOpen && isExpanded && (
            <div className="absolute left-4 bottom-20 w-48 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-[#19b393] transition">
                <IoSettingsOutline className="mr-3" size={18}/> Profile
              </button>
              <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition" onClick={HanleLogoutAdmin}>
                <IoLogOutOutline className="mr-3" size={18}/> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// NavItem Helper
function NavItem({ to, icon, label, expanded }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        flex items-center h-12 rounded-xl transition-all duration-200 
        ${isActive 
          ? 'bg-[#19b393] text-white shadow-lg shadow-green-100 dark:shadow-green-900/20 scale-[1.02]' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
        }
      `}
    >
      <div className="min-w-14 flex justify-center items-center">
        {icon}
      </div>
      <span className={`font-bold text-sm transition-opacity duration-300 whitespace-nowrap
        ${expanded ? 'opacity-100' : 'opacity-0'}`}>
        {label}
      </span>
    </NavLink>
  );
}