import { Link } from "react-router";
import { IoIosPersonAdd } from "react-icons/io";

function RegesterAdmin() {
  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-[#0A2647] flex justify-center items-center gap-2 mb-8">
          Create new account
          <IoIosPersonAdd className="text-[#2C74B3] text-3xl" />
        </h1>

        {/* Form */}
        <form className="flex flex-col gap-5">
          
          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#2C74B3]"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#2C74B3]"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#2C74B3]"
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
            Register
          </button>

        </form>
      </div>
    </div>
  );
}

export default RegesterAdmin;
