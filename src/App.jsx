
import './App.css'
import { Navigate, Route, Routes } from 'react-router'
import LoginChoise from './composent/login/LoginChoise'
import RegesterAdmin from './composent/login/regesterAdmin'
import LoginAdmin from './composent/login/loginAdmin'
import LoginEmploye from './composent/login/loginemloye'
import Home from './composent/home'
import ProductPg from './composent/ProductPg/ProductPg'
import Categories from './composent/Categories/Categories'
import EmployeesPage from './composent/employe/employe'
import {EmployeeDashboard} from "./composent/employe/EmployeeDashboard"
import Caisse from "./composent/La Caisse/Caisse"
import Dashboard from "./composent/Dashboard/Dashboard"
import Fornisseur from "./composent/Fornisseur/Fornisseur"
import SupplierInvoices from './composent/Fornisseur/SupplierInvoices'
import Clients from './composent/Clients/Clients'
import ClientCreditDetails from './composent/Clients/ClientCreditDetails.jsx'
import Profite from './composent/Ventes/Profit'
import Ventes from './composent/Ventes/Ventes'
import Invoices from './composent/Facture/Invoices'
import InvoiceSettings from './composent/Facture/InvoiceSettings'
import HestoriqueProfit from './composent/Ventes/hestorique'
import { useRef, useState } from 'react'
import { useEffect } from "react";
import gsap from "gsap";
import { LuMoon, LuSun } from "react-icons/lu"; 
import Landing from './composent/Landing/landing'
import ProfilePage from './composent/profile/profile'
import ChangePassword from './composent/profile/UpdatePassword'
import Usercridit from './composent/Usercridit/usercridit'
import AddUserCredit from './composent/Usercridit/pageAddUserCridite'
import ListUsercridite from './composent/Usercridit/ListUserCridite'
import UserCreditDetails from './composent/Usercridit/UserCreditDetails'
import { useTranslation } from 'react-i18next'
import PageNave from './composent/NavBar/pageNave'
function App() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === "ar";

  
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    
    // Fallback to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };
  const [theme, setTheme] = useState(getInitialTheme);
useEffect(() => {

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("theme", theme);
}, [theme]);

useEffect(() => {
  document.documentElement.lang = i18n.language;
  document.documentElement.dir = isArabic ? "rtl" : "ltr";
}, [i18n.language, isArabic]);

const toggleTheme = () => {
  setTheme((prev) => (prev === "light" ? "dark" : "light"));
};

const toggleLanguage = () => {
  const nextLanguage = i18n.language === "ar" ? "fr" : "ar";
  i18n.changeLanguage(nextLanguage);
  localStorage.setItem("lang", nextLanguage);
};

const buttonRef = useRef(null);

const onEnter = () => {
  gsap.to(buttonRef.current, {
    x: 0, // Slide back to original position
    duration: 0.3,
    ease: "power2.out"
  });
};

const onLeave = () => {
  const hiddenOffset = isArabic ? -45 : 45;
  gsap.to(buttonRef.current, {
    x: hiddenOffset,
    duration: 0.3,
    ease: "power2.in"
  });
};

  return (
    <>
<button
    ref={buttonRef}
    onMouseEnter={onEnter}
    onMouseLeave={onLeave}
    onClick={toggleTheme}
    className={`fixed z-999 bottom-5 flex items-center w-25 h-12 bg-white dark:bg-zinc-900 border border-primary-200 dark:border-yellow-200 text-primary-500 dark:text-yellow-500 transition-colors ${
      isArabic
        ? "-left-3 justify-end pr-4 rounded-r-full -translate-x-[45px]"
        : "-right-3 justify-start pl-4 rounded-l-full translate-x-[45px]"
    }`}
  >
    <div className="text-xl flex items-center justify-center">
      {theme === "light" ? <LuMoon size={20}/> : <LuSun size={20}/>}
      <span className='text-sm'>

      {theme === "light" ? t("theme.darkMode") : t("theme.lightMode")}
      </span>

    </div>
  </button>
<button
    onClick={toggleLanguage}
    className={`fixed z-999 bottom-20 flex items-center w-25 h-12 bg-white dark:bg-zinc-900 border border-primary-200 dark:border-yellow-200 text-primary-500 dark:text-yellow-500 transition-colors ${
      isArabic
        ? "-left-3 justify-end pr-4 rounded-r-full"
        : "-right-3 justify-start pl-4 rounded-l-full"
    }`}
  >
    <div className="text-sm font-bold">
      {i18n.language === "ar" ? t("common.french") : t("common.arabic")}
    </div>
  </button>


        
        <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/LoginChoise' element={<LoginChoise/>}/>
        <Route path='/RegisterAdmin' element={<RegesterAdmin/>}/>
        <Route path='/LoginAdmin' element={<LoginAdmin/>}/>
        <Route path='/LoginEmploye' element={<LoginEmploye/>}/>
        <Route path='/Home' element={<Home/>}>
        <Route path='Categories' element={<Categories/>}/>
        <Route path='products' element={  <ProductPg />} />
        <Route path='Dashboard' element={<Dashboard />} />
        <Route path='Caisse' element={<Caisse />} />
        <Route path='Fornisseur' element={<Fornisseur />} />
        <Route path='Fornisseur/:id/invoices' element={<SupplierInvoices />} />
        <Route path='Clients' element={<Clients />} />
        <Route path='Clients/:id' element={<ClientCreditDetails />} />
       <Route path='profile' element={<ProfilePage/>}/>
       <Route path='changePassword' element={<ChangePassword/>}/>
        <Route path='Facture' element={<Invoices/>}/>
        <Route path='invoice-settings' element={<InvoiceSettings/>}/>
        <Route path='Facture/new' element={<Invoices/>}/>
        <Route path='Facture/caisse' element={<Invoices/>}/>
        <Route path='Facture/history' element={<Invoices/>}/>
        <Route path='profit/Facture' element={<Navigate to='/Home/Facture/caisse' replace/>}/>
        <Route path='profit/Facture/new' element={<Navigate to='/Home/Facture/new' replace/>}/>
        <Route path="profit" element={<Profite/>}>
            <Route path='Ventes' element={<Ventes/>}/>
            <Route path='Hestorique' element={<HestoriqueProfit/>}/>
        </Route>
        <Route path='cridit' element={<Usercridit/>}>
            <Route path='add' element={<AddUserCredit/>}/>
            <Route path='UserCridit' element={<ListUsercridite/>}/>
            <Route path='UserCreditDetails/:id' element={<UserCreditDetails/>}/>
            
     
        </Route>
        <Route path='history' element={""} />
        <Route path="employees" element={<EmployeesPage />}>
        <Route path="EmployeeDashboard" element={<EmployeeDashboard/>} />
        <Route path="statistique" element={""} />
      </Route>
         < Route path='pagination' element={<PageNave/>}/>
        </Route>  


     
     
     </Routes>
    </>
  )
}

export default App
