
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
function App() {
 

  return (
    <>


        
        <Routes>
        <Route path='/' element={<LoginChoise/>}/>
        <Route path='/RegisterAdmin' element={<RegesterAdmin/>}/>
        <Route path='/LoginAdmin' element={<LoginAdmin/>}/>
        <Route path='/LoginEmploye' element={<LoginEmploye/>}/>
        <Route path='/Home' element={<Home/>}>
        <Route path='Categories' element={<Categories/>}/>
        <Route path='products' element={  <ProductPg />} />
        <Route path='Dashboard' element={""} />
        <Route path='Caisse' element={<Caisse />} />
        <Route path='profits' element={""} />
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
