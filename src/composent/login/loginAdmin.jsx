import { Link } from "react-router";
import { useNavigate } from "react-router";
import { IoIosLogIn } from "react-icons/io";
import { useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { LoginAdmine } from "../../slices/SliceLoginAdmin";
function LoginAdmin() {
  const Dispatch = useDispatch()
  const Nav = useNavigate()
  
  const {admin,loading,error} = useSelector((state)=>{
    return state.LoginAdmin
  })
  
    const [infoAdmin,setInfoAdmin] = useState({email:"",password:""})
    
function Login(e){
     e.preventDefault()
     
  if (!infoAdmin.email || !infoAdmin.password) {
    return alert("عمر الإيميل و الباسوورد");
  }
     Dispatch(LoginAdmine(infoAdmin))
     .unwrap().then(()=>{
    Nav("/Home")
     }
    
    ).catch((err) => {
      console.log("Login error:", err);
    });
}
  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-[#0A2647] flex justify-center items-center gap-2 mb-8">
          Admin Login

          <IoIosLogIn className="text-[#2C74B3] text-3xl" />
        </h1>

        {/* Form */}
        <form className="flex flex-col gap-5 " onSubmit={Login}>
          
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#2C74B3]"
         onChange={(e)=>setInfoAdmin({...infoAdmin,email:e.target.value})}
         
         />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#2C74B3]"
           onChange={(e)=>setInfoAdmin({...infoAdmin,password:e.target.value})}
        
        />

          {/* Register link */}
          <Link  to='/RegisterAdmin' className="text-sm text-left text-[#2C74B3] hover:underline">
            Don’t have an account?
          </Link>

          {/* Button */}
          <button
            className="
              mt-4 bg-[#0A2647] text-white py-3 rounded-lg
              font-semibold transition-all duration-300
              hover:bg-[#2C74B3] hover:shadow-lg
            "
          >
            {loading?"Login...":"Login"}
          </button>
          <Link  to='/LoginEmploye'className="text-sm text-center text-[#2C74B3] hover:underline">
            Login as Employe?
          </Link>
          {error&& <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginAdmin;
