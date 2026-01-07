import { Link } from "react-router";
import { FaUser } from "react-icons/fa";

function LoginEmploye() {
  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-[#0A2647] flex justify-center items-center gap-3 mb-8">
          Employee Login
          <FaUser className="text-[#2C74B3] text-3xl" />
        </h1>

        {/* Form */}
        <form className="flex flex-col gap-6">
          
          <input
            type="email"
            placeholder="Employee Email"
            className="w-full px-4 py-3 rounded-lg border
                       focus:outline-none focus:ring-2 focus:ring-[#2C74B3]"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border
                       focus:outline-none focus:ring-2 focus:ring-[#2C74B3]"
          />


          {/* Button */}
          <button
            className="
              mt-2 bg-[#0A2647] text-white py-3 rounded-lg
              font-semibold transition-all duration-300
              hover:bg-[#2C74B3] hover:shadow-lg
            "
          >
            Login
          </button>

          {/* Admin switch */}
          <Link  to='/LoginAdmin'className="text-sm text-center text-[#2C74B3] hover:underline">
            Login as Admin?
          </Link>
        </form>
      </div>
    </div>
  );
}

export default LoginEmploye;
