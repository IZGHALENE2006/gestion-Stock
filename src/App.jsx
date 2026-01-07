import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router'
import LoginChoise from './composent/login/LoginChoise'
import RegesterAdmin from './composent/login/regesterAdmin'
import LoginAdmin from './composent/login/loginAdmin'
import LoginEmploye from './composent/login/loginemloye'

function App() {
 

  return (
    <>
     <Routes>
      {/* //Route login Admin and Employe */}
    <Route path='/' element={<LoginChoise/>}/>
<Route path='/RegisterAdmin' element={<RegesterAdmin/>}/>
<Route path='/LoginAdmin' element={<LoginAdmin/>}/>
<Route path='/LoginEmploye' element={<LoginEmploye/>}/>
     </Routes>
    </>
  )
}

export default App
