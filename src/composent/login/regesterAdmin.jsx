  import { Link, useNavigate } from "react-router";
  import { IoIosPersonAdd } from "react-icons/io";
  import { useState, } from "react";

  import { useDispatch,useSelector } from "react-redux";
  import { RegistreAdmin } from "../../slices/sliceLogin";
  function RegesterAdmin() {
  const Dispatch = useDispatch()
  const Nav = useNavigate()
  const { loading, error} = useSelector((state)=>{
    return state.register
  })
  
      const [Admininfo,setAdmininfo] = useState({name:"",email:"",password:""})
      const [Error,setError] = useState(false)
      function Handelgetname(e){
          setAdmininfo({...Admininfo,name:e.target.value})
          setError(false)
      } function Handelgetemail(e){
          setAdmininfo({...Admininfo,email:e.target.value})
          setError(false)

      } function Handelgetpassword(e){
          setAdmininfo({...Admininfo,password:e.target.value})
          setError(false)

      }

    function HandeladdAdmin(e){
          e.preventDefault()
        if(Admininfo.name==""||Admininfo.email==''||Admininfo.password==""){
         setError(true)
        }else{
          Dispatch(RegistreAdmin(Admininfo))
         .unwrap().then((res)=>{
          Nav('/LoginAdmin')
         })
        }

      }
    return (
      <div className="h-screen flex justify-center items-center bg-gray-100">
        
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-[#0A2647] flex justify-center items-center gap-2 mb-8">
            Create new account
            <IoIosPersonAdd className="text-[#2C74B3] text-3xl" />
          </h1>

          {/* Form */}
          <form className="flex flex-col gap-5" onSubmit={HandeladdAdmin}>
            
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#2C74B3]"
              onChange={Handelgetname}
              style={{borderColor:Error?'red':""}}
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#2C74B3]"
              onChange={Handelgetemail}
              style={{borderColor:Error?'red':""}}
            
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#2C74B3]"
              onChange={Handelgetpassword}
              style={{borderColor:Error?'red':""}}
             
            />

            {/* Login link */}
            <Link to='/LoginAdmin' className="text-sm text-left text-[#2C74B3] hover:underline">
            Already have an account?
            </Link>

            {/* Button */}
            <button
              className="
                mt-4 bg-[#0A2647] text-white py-3 rounded-lg
                font-semibold transition-all duration-300
                hover:bg-[#2C74B3] hover:shadow-lg
              "
            >
              {loading ? "Loading..." : "Register"}
            </button>
              
        <p style={{ color: "red" }}>{error}</p>
          </form>
        </div>
      </div>
    );
  }

  export default RegesterAdmin;
