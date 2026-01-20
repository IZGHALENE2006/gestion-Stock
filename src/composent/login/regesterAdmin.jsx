import { Link, useNavigate } from "react-router";
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
    gsap.fromTo(formRef.current, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 });
  }, []);

  function HandeladdAdmin(e) {
    e.preventDefault();
    if (!Admininfo.name || !Admininfo.email || !Admininfo.password) return setErrorLocal(true);
    Dispatch(RegistreAdmin(Admininfo)).unwrap().then(() => Nav('/LoginAdmin'));
  }

  return (
    <div className="h-screen flex justify-center items-center overflow-hidden relative">
            <div className="absolute top-[-10%] left-[-5%] w-125 h-125 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-125 h-125 bg-indigo-400/10 rounded-full blur-[120px] animate-pulse" />
      <div ref={formRef} style={{ background: "rgba(30, 41, 59, 0.5)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }} className="w-full max-w-md rounded-4xl p-10">
        <h1 className="text-3xl font-bold text-center text-white flex justify-center items-center gap-3 mb-10">
          Join Us <IoIosPersonAdd className="text-blue-400" />
        </h1>
        <form className="flex flex-col gap-5" onSubmit={HandeladdAdmin}>
          <input type="text" placeholder="Full Name" style={{ borderColor: ErrorLocal && !Admininfo.name ? 'red' : 'transparent' }} className="w-full px-5 py-4 bg-white/5 border rounded-xl text-white outline-none focus:border-blue-500" onChange={(e) => { setAdmininfo({ ...Admininfo, name: e.target.value }); setErrorLocal(false); }} />
          <input type="email" placeholder="Email" style={{ borderColor: ErrorLocal && !Admininfo.email ? 'red' : 'transparent' }} className="w-full px-5 py-4 bg-white/5 border rounded-xl text-white outline-none focus:border-blue-500" onChange={(e) => { setAdmininfo({ ...Admininfo, email: e.target.value }); setErrorLocal(false); }} />
          <input type="password" placeholder="Password" style={{ borderColor: ErrorLocal && !Admininfo.password ? 'red' : 'transparent' }} className="w-full px-5 py-4 bg-white/5 border rounded-xl text-white outline-none focus:border-blue-500" onChange={(e) => { setAdmininfo({ ...Admininfo, password: e.target.value }); setErrorLocal(false); }} />
          <button className="mt-4 bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-95">
            {loading ? "Registering..." : "Create Account"}
          </button>
          <Link to='/LoginAdmin' className="text-center text-gray-400 text-sm hover:text-white">Already have an account?</Link>
          {error && <p className="text-red-400 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
export default RegesterAdmin;