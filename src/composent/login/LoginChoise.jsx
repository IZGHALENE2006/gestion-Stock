import { FaUserTie } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router";
function LoginChoise(){
    return(
<div className="h-screen flex flex-col justify-center items-center bg-gray-100">
  
  <h1 className="text-4xl font-bold mb-12 text-[#0A2647]">
    Choose your role
  </h1>

  <div className="flex gap-10">
{/* ////////////////////@@@@@@@@@@@@@@@@@@@///////////////////// */}
    {/* Admin Card */}
<Link to={'/LoginAdmin'}>
 <div className="
      flex flex-col w-40 h-52
      justify-center items-center
      bg-[#0A2647]
      rounded-2xl
      shadow-lg
      cursor-pointer
      transition-all duration-300
      hover:scale-105 hover:shadow-2xl
    ">
      <FaUserTie className="text-6xl text-[#2C74B3] mb-4"/>
      <h1 className="text-2xl font-semibold text-white">
        Admin
      </h1>
    </div>
</Link>
{/* ////////////////////@@@@@@@@@@@@@@@@@@@///////////////////// */}

    {/* Employee Card */}
  <Link to={'/LoginEmploye'}>
    <div className="
      flex flex-col w-40 h-52
      justify-center items-center
      bg-white
      rounded-2xl
      shadow-lg
      cursor-pointer
      transition-all duration-300
      hover:scale-105 hover:shadow-2xl
      border
    ">
      <FaUser className="text-6xl text-[#2C74B3] mb-4"/>
      <h1 className="text-2xl font-semibold text-[#0A2647]">
        Employe
      </h1>
    </div>

  </Link>
  </div>
</div>

    )
}
export default LoginChoise