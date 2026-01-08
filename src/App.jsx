
import './App.css'
import { Route, Routes } from 'react-router'
import LoginChoise from './composent/login/LoginChoise'
import RegesterAdmin from './composent/login/regesterAdmin'
import LoginAdmin from './composent/login/loginAdmin'
import LoginEmploye from './composent/login/loginemloye'
import Home from './composent/home'
function App() {
 

  return (
    <>


        
        <Routes>
        <Route path='/' element={<LoginChoise/>}/>
        <Route path='/RegisterAdmin' element={<RegesterAdmin/>}/>
        <Route path='/LoginAdmin' element={<LoginAdmin/>}/>
        <Route path='/LoginEmploye' element={<LoginEmploye/>}/>
        <Route path='/Home' element={<Home/>} />

     
     </Routes>
    </>
  )
}

export default App
