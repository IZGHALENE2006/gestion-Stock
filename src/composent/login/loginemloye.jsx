import { Link, useNavigate } from "react-router";
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
  const { loading, error } = useSelector(state => state.LoginAdmin);
  const [infoEmp, setInfoEmp] = useState({ email: "", password: "" });

  useEffect(() => {
    gsap.fromTo(boxRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.75)" });
  }, []);

  function HandeleLohinEmp(e) {
    e.preventDefault();
    dispatch(Loginuser({ role: "Employe", data: infoEmp }))
      .unwrap().then(() => Nav('/Home/Caisse'))
      .catch((err) => { if (err.includes('suspendu')) setShowDialog(true); });
  }

  return (
    <div className="h-screen flex justify-center items-center relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-5%] w-125 h-125 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-125 h-125 bg-indigo-400/10 rounded-full blur-[120px] animate-pulse" />
      <div ref={boxRef} style={{ background: "linear-gradient(145deg, rgba(30,41,59,0.9), rgba(15,23,42,0.9))", border: "1px solid rgba(139, 92, 246, 0.2)" }} className="w-full max-w-md rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(139,92,246,0.1)]">
        <h1 className="text-3xl font-bold text-center text-white flex justify-center items-center gap-3 mb-10">
          Staff Portal <FaUser className="text-[#2563eb]" />
        </h1>
        <form className="flex flex-col gap-6" onSubmit={HandeleLohinEmp}>
          <input type="email" placeholder="Email" className="w-full px-5 py-4 bg-purple-500/5 border border-purple-500/20 rounded-xl text-white outline-none focus:ring-2 focus:ring-[#2563eb]" onChange={(e) => setInfoEmp({ ...infoEmp, email: e.target.value })} />
          <input type="password" placeholder="Password" className="w-full px-5 py-4 bg-purple-500/5 border border-purple-500/20 rounded-xl text-white outline-none focus:ring-2 focus:ring-[#2563eb]" onChange={(e) => setInfoEmp({ ...infoEmp, password: e.target.value })} />
          <button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-4 rounded-xl font-bold shadow-lg shadow-purple-900/30 active:scale-95 transition-all">
            {loading ? "Logging in..." : "Login"}
          </button>
          <Link to='/LoginAdmin' className="text-center text-gray-400 text-sm hover:text-[#D4AF37] transition-colors">Switch to Admin</Link>
          {error && <span className="text-red-400 text-center text-sm">{error}</span>}
        </form>
      </div>
      <SuspendedDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </div>
  );
}
export default LoginEmploye;