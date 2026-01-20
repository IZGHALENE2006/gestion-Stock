import { Link, useNavigate } from "react-router";
import { IoIosLogIn } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Loginuser } from "../../slices/SliceLoginAdmin";
import gsap from "gsap";

function LoginAdmin() {
  const Dispatch = useDispatch();
  const Nav = useNavigate();
  const boxRef = useRef(null);
  const { loading, error } = useSelector((state) => state.LoginAdmin);
  const [infoAdmin, setInfoAdmin] = useState({ email: "", password: "" });

  useEffect(() => {
    gsap.fromTo(boxRef.current, 
      { opacity: 0, scale: 0.8, y: 20 }, 
      { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "power4.out" }
    );
  }, []);

  function Login(e) {
    e.preventDefault();
    Dispatch(Loginuser({ role: 'admin', data: infoAdmin }))
      .unwrap().then(() => {
        gsap.to(boxRef.current, { opacity: 0, scale: 1.1, duration: 0.4, onComplete: () => Nav("/Home/Dashboard") });
      });
  }

  return (
    <div className="h-screen flex justify-center items-center p-4 overflow-hidden relative">
  <div className="absolute top-[-10%] left-[-5%] w-125 h-125 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"/>
  <div className="absolute bottom-[-10%] right-[-5%] w-125 h-125 bg-indigo-400/10 rounded-full blur-[120px] animate-pulse" />
      <div ref={boxRef} style={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255, 255, 255, 0.1)" }} className="w-full max-w-md rounded-4xl p-10 shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-white flex justify-center items-center gap-3 mb-10">
          Admin <IoIosLogIn className="text-[#D4AF37]" />
        </h1>
        <form className="flex flex-col gap-5" onSubmit={Login}>
          <input type="email" placeholder="Email" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all" onChange={(e) => setInfoAdmin({ ...infoAdmin, email: e.target.value })} />
          <input type="password" placeholder="Password" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all" onChange={(e) => setInfoAdmin({ ...infoAdmin, password: e.target.value })} />
          <button className="mt-4 bg-[#D4AF37] hover:bg-[#B8860B] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#D4AF37]/20 active:scale-95 transition-all">
            {loading ? "Authenticating..." : "Login"}
          </button>
          <div className="flex justify-between text-sm mt-4 text-gray-400">
            <Link to='/RegisterAdmin' className="hover:text-blue-400 underline decoration-blue-500/30">Create Account</Link>
            <Link to='/LoginEmploye' className="hover:text-white">Login as Employee</Link>
          </div>
          {error && <p className="text-red-400 text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
export default LoginAdmin;