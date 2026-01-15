import { Link, useNavigate } from "react-router";
import { FaUser } from "react-icons/fa";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loginuser } from "../../slices/SliceLoginAdmin";

import SuspendedDialog from "../Dialog/SuspendedDialog";
function LoginEmploye() {
  const dispatch = useDispatch()
  const Nav = useNavigate()
const [showDialog, setShowDialog] = useState(false);
const { user, role,token,loading,error } = useSelector(state => state.LoginAdmin);

    const [infoEmp,setInfoEmp] = useState({email:"",password:""})
 function HandeleLohinEmp(e){
         e.preventDefault()
       
         if(infoEmp.email==''||infoEmp.password==''){
  alert("svp Entre voter info")
         }else{
          dispatch(Loginuser({
            role:"Employe",
                data:{
        email:infoEmp.email,
        password:infoEmp.password
      }
          }))
          .unwrap().then(()=>{
             Nav('/Home/Dashboard')
          }).catch((err)=>{
         
          if(err=='Votre compte a été temporairement suspendu'){
            setShowDialog(true)
          }
          })
        
         }
 }
  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-[#0A2647] flex justify-center items-center gap-3 mb-8">
          Employee Login
          <FaUser className="text-[#2C74B3] text-3xl" />
        </h1>

        {/* Form */}
        <form className="flex flex-col gap-6" onSubmit={HandeleLohinEmp} >
          
          <input
            type="email"
            placeholder="Employee Email"
            className="w-full px-4 py-3 rounded-lg border
                       focus:outline-none focus:ring-2 focus:ring-[#2C74B3]"
                       onChange={(e)=>setInfoEmp({...infoEmp,email:e.target.value})}

          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border
                       focus:outline-none focus:ring-2 focus:ring-[#2C74B3]"
                       onChange={(e)=>setInfoEmp({...infoEmp,password:e.target.value})}
         
         />


          {/* Button */}
          <button
            className="
              mt-2 bg-[#0A2647] text-white py-3 rounded-lg
              font-semibold transition-all duration-300
              hover:bg-[#2C74B3] hover:shadow-lg
            "
          >
          {loading?'Login...':"Login"}
          </button>
          {error&&<span className="text-red-500">{error}</span>}
          {/* Admin switch */}
          <Link  to='/LoginAdmin'className="text-sm text-center text-[#2C74B3] hover:underline">
            Login as Admin?
          </Link>

        </form>
      </div>
   <SuspendedDialog
  open={showDialog} 
  onClose={() => setShowDialog(false)} 
/>

    </div>
  );
}

export default LoginEmploye;
