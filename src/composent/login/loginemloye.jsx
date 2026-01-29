import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loginuser } from "../../slices/SliceLoginAdmin";
import SuspendedDialog from "../Dialog/SuspendedDialog";
import gsap from "gsap";

function LoginEmploye() {
  const dispatch = useDispatch();
  const Nav = useNavigate();
  const boxRef = useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  const { loading, error } = useSelector((state) => state.LoginAdmin);
  const [infoEmp, setInfoEmp] = useState({ email: "", password: "" });

  useEffect(() => {
    // Check if the ref exists before animating
    if (boxRef.current) {
      gsap.fromTo(
        boxRef.current,
        { y: -40, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.75)" }
      );
    }
  }, []);

  function HandeleLohinEmp(e) {
    e.preventDefault();
    dispatch(Loginuser({ role: "Employe", data: infoEmp }))
      .unwrap()
      .then(() => Nav("/Home/Caisse"))
      .catch((err) => {
        // Basic error checking - adjusted to be more robust
        if (err && typeof err === 'string' && err.includes("suspendu")) {
          setShowDialog(true);
        }
      });
  }

  return (
    /* Changed w-full to min-h-screen to ensure it centers vertically on all devices */
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 overflow-hidden relative transition-colors duration-700 bg-gray-100 dark:bg-[#1e293b] font-sans">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-120 h-120 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-120 h-120 bg-purple-400/10 dark:bg-purple-400/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col items-center mb-8 z-10 text-center">
        <h1 className="text-4xl font-black tracking-tighter text-slate-800 dark:text-white leading-none">
          STOCK <span className="text-indigo-500">PRO</span>
        </h1>
        <p className="text-slate-400 dark:text-slate-600 text-[9px] font-black uppercase tracking-[0.4em] mt-2">
          Employe
        </p>
      </div>

      {/* Login Box */}
      <div
        ref={boxRef}
        className="relative w-full max-w-md rounded-[2.5rem] p-8 md:p-10 z-10 border transition-all duration-500
          bg-white border-slate-200 shadow-2xl shadow-slate-200/50
          dark:bg-slate-900/40 dark:backdrop-blur-2xl dark:border-white/5 dark:shadow-none"
      >
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Employe Login</h2>
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-inner">
            <FaUser size={20} />
          </div>
        </div>

        <form className="flex flex-col gap-5" onSubmit={HandeleLohinEmp}>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase ml-2 tracking-widest">Email Adress</label>
            <input
              required
              type="email"
              placeholder="vendeur@stockpro.com"
              className="w-full px-5 py-4 rounded-2xl outline-none transition-all duration-300
                bg-slate-50 border-slate-100 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-indigo-500"
              onChange={(e) => setInfoEmp({ ...infoEmp, email: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase ml-2 tracking-widest">Password</label>
            <input
              required
              type="password"
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-2xl outline-none transition-all duration-300
                bg-slate-50 border-slate-100 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-indigo-500"
              onChange={(e) => setInfoEmp({ ...infoEmp, password: e.target.value })}
            />
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Log In"
            )}
          </button>

          <div className="flex flex-col items-center gap-4 mt-6">
            <Link to="/LoginAdmin" className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 hover:text-emerald-500 transition-colors">
              Admin ?
            </Link>
            <Link to="/LoginChoise" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-500 hover:underline">
              Switch Portal
            </Link>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold text-center uppercase tracking-wider">
              {error}
            </div>
          )}
        </form>
      </div>

      <SuspendedDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </div>
  );
}

export default LoginEmploye;