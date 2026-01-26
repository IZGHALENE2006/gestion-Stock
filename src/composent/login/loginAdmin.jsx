import { Link, useNavigate } from "react-router-dom";
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
      { opacity: 0, scale: 0.9, y: 30 }, 
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" }
    );
  }, []);

  function Login(e) {
    e.preventDefault();
    Dispatch(Loginuser({ role: 'admin', data: infoAdmin }))
      .unwrap().then(() => {
        gsap.to(boxRef.current, { opacity: 0, scale: 1.05, y: -20, duration: 0.4, onComplete: () => Nav("/Home/Dashboard") });
      });
  }

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center p-4 overflow-hidden relative transition-colors duration-700 bg-gray-100 dark:bg-[#1e293b] font-sans">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-125 h-125 bg-emerald-500/10 dark:bg-emerald-600/15 rounded-full blur-[120px] animate-pulse pointer-events-none"/>
      <div className="absolute bottom-[-10%] right-[-5%] w-125 h-125 bg-emerald-400/10 dark:bg-emerald-400/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />

      {/* Header Section (Tightened Logo + Title) */}
      <div className="flex flex-col items-center mb-8 z-10 text-center">
        <h1 className="text-4xl font-black tracking-tighter text-slate-800 dark:text-white leading-none">
          STOCK <span className="text-emerald-500">PRO</span>
        </h1>
        <p className="text-slate-400 dark:text-slate-600 text-[9px] font-black uppercase tracking-[0.4em] mt-2">Admin Portal</p>
      </div>

      {/* Login Box */}
      <div 
        ref={boxRef} 
        className="relative w-full max-w-md rounded-[2.5rem] p-10 z-10 border transition-all duration-500
          bg-white border-slate-200 shadow-2xl shadow-slate-200/50
          dark:bg-slate-900/40 dark:backdrop-blur-2xl dark:border-white/5 dark:shadow-none"
      >
        <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Login</h2>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <IoIosLogIn size={24} />
            </div>
        </div>

        <form className="flex flex-col gap-4" onSubmit={Login}>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase ml-2">Email Address</label>
            <input 
              type="email" 
              placeholder="admin@stockpro.com" 
              className="w-full px-5 py-4 rounded-2xl outline-none transition-all duration-300
                bg-slate-50 border-slate-100 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-emerald-500" 
              onChange={(e) => setInfoAdmin({ ...infoAdmin, email: e.target.value })} 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase ml-2">Security Key</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full px-5 py-4 rounded-2xl outline-none transition-all duration-300
                bg-slate-50 border-slate-100 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-emerald-500" 
              onChange={(e) => setInfoAdmin({ ...infoAdmin, password: e.target.value })} 
            />
          </div>

          <button className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : "Authenticate"}
          </button>

          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mt-6">
            <Link to='/RegisterAdmin' className="text-slate-400 dark:text-slate-600 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Create Account</Link>
            <Link to='/LoginChoise' className="text-emerald-600 dark:text-emerald-500 hover:underline">Switch Portal</Link>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold text-center uppercase tracking-wider">
               {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginAdmin;