import { useEffect, useState } from 'react';
import { 
  IoGridOutline, IoPeopleOutline, IoCartOutline, 
  IoBarChartOutline, IoCardOutline, IoPersonOutline, 
  IoLogOutOutline, IoSettingsOutline, IoPricetagsOutline, 
  IoBusinessOutline, IoMenuOutline, IoCloseOutline 
} from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { getMe, logoutAdmin } from '../../slices/SliceLoginAdmin';
import { Box } from "lucide-react";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); // Mobile Menu State

  const { user, role, token } = useSelector(state => state.LoginAdmin);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (token && !loaded) {
      dispatch(getMe());
      setLoaded(true);
    }
  }, [dispatch, token, loaded]);

  const HanleLogoutAdmin = () => {
    dispatch(logoutAdmin());
    nav('/LoginAdmin');
  }

  // Helper to close mobile menu when clicking a link
  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* --- MOBILE MENU BUTTON --- */}
      <div className="md:hidden fixed top-4 left-4 z-[60]">
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-3 bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800 text-[#19b393]"
        >
          {mobileOpen ? <IoCloseOutline size={24} /> : <IoMenuOutline size={24} />}
        </button>
      </div>

      {/* --- MOBILE OVERLAY --- */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[55] transition-opacity"
          onClick={closeMobile}
        />
      )}

      {/* --- SIDEBAR (Shared logic for Desktop & Mobile) --- */}
      <div className={`
        fixed z-[56] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 
        transition-all duration-300 ease-in-out flex flex-col overflow-hidden shadow-2xl
        
        /* Desktop Logic */
        md:left-0 md:flex ${isExpanded ? 'md:w-64' : 'md:w-20'}
        
        /* Mobile Logic */
        ${mobileOpen ? 'left-0 w-64' : '-left-full w-64'} 
      `}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        
        {/* Logo */}
        <div className="flex items-center h-20 px-6">
          <div className="bg-[#19b393] p-2 rounded-xl min-w-10 h-10 flex items-center justify-center shadow-lg">
            <Box color='white' size={20}/>
          </div>
          <span className={`ml-4 font-black text-slate-800 dark:text-slate-100 text-lg transition-opacity duration-300 whitespace-nowrap
            ${(isExpanded || mobileOpen) ? 'opacity-100' : 'md:opacity-0'}`}>
            STOCK <span className='text-[#19b393]'>PRO</span>
          </span>
        </div>

        {/* Nav Links */}
        <nav className="grow px-3 mt-4 space-y-1.5">
          {role === 'admin' && <NavItem to="/Home/Dashboard" icon={<IoBarChartOutline size={22} />} label="Dashboard" expanded={isExpanded} mobileOpen={mobileOpen} onClick={closeMobile} />}
          <NavItem to="/Home/Categories" icon={<IoPricetagsOutline size={22} />} label="Categories" expanded={isExpanded} mobileOpen={mobileOpen} onClick={closeMobile} />
          <NavItem to="/Home/products" icon={<IoGridOutline size={22} />} label="Products" expanded={isExpanded} mobileOpen={mobileOpen} onClick={closeMobile} />
          {role === 'admin' && <NavItem to="/Home/employees/EmployeeDashboard" icon={<IoPeopleOutline size={22} />} label="Employees" expanded={isExpanded} mobileOpen={mobileOpen} onClick={closeMobile} />}
          {role === 'admin' && <NavItem to="/Home/Fornisseur" icon={<IoBusinessOutline size={22} />} label="Suppliers" expanded={isExpanded} mobileOpen={mobileOpen} onClick={closeMobile} />}
          <NavItem to="/Home/Caisse" icon={<IoCartOutline size={22} />} label="Cashier" expanded={isExpanded} mobileOpen={mobileOpen} onClick={closeMobile} />
          <NavItem to="/Home/Profit/Ventes" icon={<IoCardOutline size={22} />} label="Sales" expanded={isExpanded} mobileOpen={mobileOpen} onClick={closeMobile} />
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 relative">
          <div className="flex items-center cursor-pointer p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" onClick={() => setProfileOpen(!profileOpen)}>
            <div className="min-w-10 h-10 rounded-xl bg-[#19b393]/20 flex items-center justify-center text-[#19b393] font-bold">
              <IoPersonOutline size={20} />
            </div>
            <div className={`ml-3 transition-opacity duration-300 ${(isExpanded || mobileOpen) ? 'opacity-100' : 'md:opacity-0'}`}>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap capitalize">{user?.name || "User"}</p>
              <p className="text-[10px] text-[#19b393] font-black uppercase tracking-wider">{role}</p>
            </div>
          </div>

          {/* Dropdown Menu */}
          {profileOpen && (isExpanded || mobileOpen) && (
            <div className="absolute left-4 bottom-20 w-48 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
              <NavLink to="/Home/profile" onClick={closeMobile} className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50">
                <IoSettingsOutline className="mr-3" size={18}/> Profile
              </NavLink>

              <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50" onClick={HanleLogoutAdmin}>
                <IoLogOutOutline className="mr-3" size={18}/> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// NavItem Helper
function NavItem({ to, icon, label, expanded, mobileOpen, onClick }) {
  return (
    <NavLink 
      to={to} 
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center h-12 rounded-xl transition-all duration-200 
        ${isActive 
          ? 'bg-[#19b393] text-white shadow-lg shadow-green-100 dark:shadow-green-900/20 scale-[1.02]' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-300'
        }
      `}
    >
      <div className="min-w-14 flex justify-center items-center">
        {icon}
      </div>
      <span className={`font-bold text-sm transition-opacity duration-300 whitespace-nowrap
        ${(expanded || mobileOpen) ? 'opacity-100' : 'md:opacity-0'}`}>
        {label}
      </span>
    </NavLink>
  );
}