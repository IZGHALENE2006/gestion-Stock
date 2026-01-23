
import './App.css'
import { Route, Routes } from 'react-router'
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
import Profite from './composent/Ventes/Profit'
import Ventes from './composent/Ventes/Ventes'
import FactureVentes from './composent/Ventes/Facture'
import HestoriqueProfit from './composent/Ventes/hestorique'
import { useRef, useState } from 'react'
import { useEffect } from "react";
import gsap from "gsap";
import { LuMoon, LuSun } from "react-icons/lu"; 

function App() {

  
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

const toggleTheme = () => {
  setTheme((prev) => (prev === "light" ? "dark" : "light"));
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
  gsap.to(buttonRef.current, {
    x: 45, // Push it 40px off the right edge
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
    className="fixed z-999 -right-3 bottom-5 z-50 flex items-center justify-start pl-4 w-25 h-12 translate-x-[45px] bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-yellow-200 rounded-l-full text-indigo-500 dark:text-yellow-500 transition-colors"
  >
    <div className="text-xl flex items-center justify-center">
      {theme === "light" ? <LuMoon size={20}/> : <LuSun size={20}/>}
      <span className='text-sm'>

      {theme === "light" ? "Dark Mode" : "Light Mode"}
      </span>

    </div>
  </button>


        
        <Routes>
        <Route path='/' element={<LoginChoise/>}/>
        <Route path='/RegisterAdmin' element={<RegesterAdmin/>}/>
        <Route path='/LoginAdmin' element={<LoginAdmin/>}/>
        <Route path='/LoginEmploye' element={<LoginEmploye/>}/>
        <Route path='/Home' element={<Home/>}>
        <Route path='Categories' element={<Categories/>}/>
        <Route path='products' element={  <ProductPg />} />
        <Route path='Dashboard' element={<Dashboard />} />
        <Route path='Caisse' element={<Caisse />} />
        <Route path='Fornisseur' element={<Fornisseur />} />
        <Route path="profit" element={<Profite/>}>
            <Route path='Ventes' element={<Ventes/>}/>
            <Route path='Facture' element={<FactureVentes/>}/>
            <Route path='Hestorique' element={<HestoriqueProfit/>}/>
        </Route>
        <Route path='history' element={""} />
        <Route path="employees" element={<EmployeesPage />}>
        <Route path="EmployeeDashboard" element={<EmployeeDashboard/>} />
        <Route path="statistique" element={""} />
      </Route>

        </Route>  



     
     </Routes>
    </>
  )
}

export default App
