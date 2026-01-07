import gsap from "gsap"
import './App.css'
import { Route, Routes } from 'react-router'
import LoginChoise from './composent/login/LoginChoise'
import RegesterAdmin from './composent/login/regesterAdmin'
import LoginAdmin from './composent/login/loginAdmin'
import LoginEmploye from './composent/login/loginemloye'
import Navbar from "./composent/NavBar/Navbar"
function App() {
 

  return (
    <>


        <Navbar />
        
        <Routes>

        <Route path='/' element={<LoginChoise/>}/>
        <Route path='/RegisterAdmin' element={<RegesterAdmin/>}/>
        <Route path='/LoginAdmin' element={<LoginAdmin/>}/>
        <Route path='/LoginEmploye' element={<LoginEmploye/>}/>
     
     </Routes>
    </>
  )
}

export default App
