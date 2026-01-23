import { useEffect, useRef } from "react";
import { FaUserTie, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import gsap from "gsap";
import "../../App.css";
function LoginChoise() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.set(containerRef.current, { opacity: 0 });
    gsap.set(cardsRef.current, { opacity: 0, y: 60, scale: 0.9 });

    const tl = gsap.timeline();
    tl.to(containerRef.current, { opacity: 1, duration: 1.2, ease: "power2.out" })
      .to(cardsRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2, 
        stagger: 0.2,  
        ease: "elastic.out(1, 0.8)", 
      }, "-=0.6");
  }, []);

  const roles = [
    { 
      to: "/LoginAdmin", 
      icon: <FaUserTie />, 
      label: "Administration", 
      gradient: "from-emerald-500 to-emerald-700",
      lightShadow: "rgba(16, 185, 129, 0.15)",
      darkGlow: "rgba(16, 185, 129, 0.4)" 
    },
    { 
      to: "/LoginEmploye", 
      icon: <FaUser />, 
      label: "Point de Vente", 
      gradient: "from-indigo-500 to-indigo-700",
      lightShadow: "rgba(99, 102, 241, 0.15)",
      darkGlow: "rgba(99, 102, 241, 0.4)" 
    },
  ];

  return (
    <div ref={containerRef} className="h-screen flex flex-col justify-center items-center transition-colors duration-700
      bg-gray-100 dark:bg-[#1e293b] overflow-hidden relative font-sans">
      
      {/* Background Glows (Subtle in light, vibrant in dark) */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-600/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />

      {/* Brand Header */}
<div className="flex flex-col items-center mb-12 z-10">
  {/* Logo Container - Tightened spacing */}
  <div className="w-32 h-32 flex items-center justify-center transition-transform duration-500 hover:scale-105">
    <img 
      src="/logo.png" 
      alt="Logo" 
      className="w-full h-full object-contain drop-shadow-xl" 
    />
  </div>

  {/* Text Content - Negative mt-2 to pull text closer to logo if needed */}
  <div className="text-center -mt-2"> 
    <h1 className="text-5xl md:text-6xl font-black tracking-tighter transition-all duration-500
      /* Theme Colors */
      text-slate-800 dark:text-transparent dark:bg-clip-text dark:bg-linear-to-b dark:from-white dark:to-slate-400">
      STOCK <span className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">PRO</span>
    </h1>
    
    <p className="text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2 opacity-80">
      SÉLECTIONNER UN PORTAIL
    </p>
  </div>
</div>

      <div className="flex flex-col md:flex-row gap-10 z-10">
        {roles.map((role, i) => (
          <Link 
            key={role.label} 
            to={role.to} 
            ref={el => cardsRef.current[i] = el}
            className="group relative"
          >
            {/* Dark Mode Aura Effect */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${role.gradient} rounded-[3rem] blur opacity-0 dark:group-hover:opacity-30 transition duration-1000`} />
            
            <div 
              className="relative flex flex-col w-72 h-80 justify-center items-center rounded-[3rem] transition-all duration-500 ease-out border
                /* Light Mode */
                bg-white border-slate-200 shadow-xl shadow-slate-200/50 hover:-translate-y-4 hover:shadow-2xl
                /* Dark Mode */
                dark:bg-slate-900/40 dark:backdrop-blur-2xl dark:border-white/5 dark:shadow-none dark:hover:bg-slate-900/60"
              onMouseEnter={(e) => {
                const isDark = document.documentElement.classList.contains('dark');
                e.currentTarget.style.boxShadow = isDark 
                  ? `0px 20px 80px ${role.darkGlow}` 
                  : `0px 20px 40px ${role.lightShadow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "";
              }}
            >
              {/* Icon Section */}
              <div className={`mt-12 relative p-7 rounded-3xl bg-gradient-to-br ${role.gradient} mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-700`}>
                <span className="text-5xl text-white drop-shadow-md">{role.icon}</span>
              </div>

              {/* Label Section */}
              <h2 className="text-xl font-black tracking-widest uppercase transition-all duration-500
                text-slate-800 dark:text-slate-100 group-hover:tracking-[0.2em]">
                {role.label}
              </h2>
              
              <div className={`w-0 h-1 mt-4 rounded-full bg-gradient-to-r ${role.gradient} group-hover:w-16 transition-all duration-700`} />
              
              <p className="text-slate-400 dark:text-slate-500 text-[9px] font-bold mt-6 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                Se Connecter
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LoginChoise;