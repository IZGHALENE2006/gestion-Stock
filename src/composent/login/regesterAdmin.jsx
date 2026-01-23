import { Link, useNavigate } from "react-router-dom";
import { IoIosPersonAdd } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RegistreAdmin } from "../../slices/sliceLogin";
import gsap from "gsap";

function RegesterAdmin() {
  const Dispatch = useDispatch();
  const Nav = useNavigate();
  const formRef = useRef(null);
  const { loading, error } = useSelector((state) => state.register);
  const [Admininfo, setAdmininfo] = useState({ name: "", email: "", password: "" });
  const [ErrorLocal, setErrorLocal] = useState(false);

  useEffect(() => {
    gsap.fromTo(formRef.current, 
      { scale: 0.9, opacity: 0, y: 20 }, 
      { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" }
    );
  }, []);

  function HandeladdAdmin(e) {
    e.preventDefault();
    if (!Admininfo.name || !Admininfo.email || !Admininfo.password) return setErrorLocal(true);
    Dispatch(RegistreAdmin(Admininfo)).unwrap().then(() => Nav('/LoginAdmin'));
  }

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center p-4 overflow-hidden relative transition-colors duration-700 bg-gray-100 dark:bg-[#1e293b] font-sans">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-125 h-125 bg-emerald-500/10 dark:bg-emerald-600/15 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-125 h-125 bg-emerald-400/10 dark:bg-emerald-400/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />

      {/* Header Section */}
      <div className="mt-5 flex flex-col items-center mb-6 z-10 text-center">
        <h1 className="text-4xl font-black tracking-tighter text-slate-800 dark:text-white leading-none">
          STOCK <span className="text-emerald-500">PRO</span>
        </h1>
        <p className="text-slate-400 dark:text-slate-600 text-[9px] font-black uppercase tracking-[0.4em] mt-2 italic">Creator Studio</p>
      </div>

      {/* Registration Box */}
      <div 
        ref={formRef} 
        className="relative w-full max-w-md rounded-[2.5rem] p-10 z-10 border transition-all duration-500
          bg-white border-slate-200 shadow-2xl shadow-slate-200/50
          dark:bg-slate-900/40 dark:backdrop-blur-2xl dark:border-slate-700 dark:shadow-none"
      >
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Sign Up</h2>
            <div className="p-3 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                <IoIosPersonAdd size={24} />
            </div>
        </div>

        <form className="flex flex-col gap-4" onSubmit={HandeladdAdmin}>
          
          {/* Full Name Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase ml-2 tracking-widest">Identify Yourself</label>
            <input 
              type="text" 
              placeholder="Full Name" 
              className={`w-full px-5 py-4 rounded-2xl outline-none transition-all duration-300 border
                ${ErrorLocal && !Admininfo.name ? 'border-red-500 bg-red-50/50' : 'bg-slate-50 border-slate-100 dark:bg-white/5 dark:border-white/10'} 
                text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500`}
              onChange={(e) => { setAdmininfo({ ...Admininfo, name: e.target.value }); setErrorLocal(false); }} 
            />
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase ml-2 tracking-widest">Business Email</label>
            <input 
              type="email" 
              placeholder="Email" 
              className={`w-full px-5 py-4 rounded-2xl outline-none transition-all duration-300 border
                ${ErrorLocal && !Admininfo.email ? 'border-red-500 bg-red-50/50' : 'bg-slate-50 border-slate-100 dark:bg-white/5 dark:border-white/10'} 
                text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500`}
              onChange={(e) => { setAdmininfo({ ...Admininfo, email: e.target.value }); setErrorLocal(false); }} 
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase ml-2 tracking-widest">Secure Password</label>
            <input 
              type="password" 
              placeholder="Password" 
              className={`w-full px-5 py-4 rounded-2xl outline-none transition-all duration-300 border
                ${ErrorLocal && !Admininfo.password ? 'border-red-500 bg-red-50/50' : 'bg-slate-50 border-slate-100 dark:bg-white/5 dark:border-white/10'} 
                text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500`}
              onChange={(e) => { setAdmininfo({ ...Admininfo, password: e.target.value }); setErrorLocal(false); }} 
            />
          </div>

          <button className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-all">
            {loading ? (
               <div className="flex items-center justify-center gap-2">
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 <span>Initializing...</span>
               </div>
            ) : "Join the Team"}
          </button>

          <Link to='/LoginAdmin' className="text-center text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-widest hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors mt-2">
            Already have an account? Login
          </Link>

          {error && <p className="text-red-500 text-center text-[10px] font-bold uppercase mt-2">{error}</p>}
          {ErrorLocal && <p className="text-red-500 text-center text-[10px] font-bold uppercase mt-2">All fields are mandatory</p>}
        </form>
      </div>
    </div>
  );
}

export default RegesterAdmin;