
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
import { useState } from 'react'
import HestoriqueProfit from './composent/Ventes/hestorique'

function App() {
const [theme, seTheme] = useState("light");

const toggleTheme = () => {
  const newTheme = theme === "light" ? "dark" : "light";
  seTheme(newTheme);
  document.documentElement.classList.toggle("dark", newTheme === "dark");
};

  return (
    <>

      <button
      className="fixed border border-white p-2 right-3 bottom-3 bg-black dark:bg-amber-50 rounded-3xl text-white dark:text-black"
      onClick={toggleTheme}
    >
      {theme === "light" ? "🌙" : "☀️"}
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
