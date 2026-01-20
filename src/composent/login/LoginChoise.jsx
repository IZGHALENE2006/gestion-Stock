import { useEffect, useRef } from "react";
import { FaUserTie, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom"; // Ensure this matches your router version
import gsap from "gsap";
import "./login.css";
function LoginChoise() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Initial state: slightly lower, transparent, and smaller
    gsap.set(containerRef.current, { opacity: 0 });
    gsap.set(cardsRef.current, { opacity: 0, y: 60, scale: 0.8 });

    const tl = gsap.timeline();

    tl.to(containerRef.current, { 
      opacity: 1, 
      duration: 1.2, 
      ease: "power2.out" 
    })
    .to(cardsRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.5, 
      stagger: 0.3,  
      ease: "elastic.out(1, 0.75)", 
    }, "-=0.8");
  }, []);

  const glassStyle = {
    backgroundColor : "#02061720",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    duration: "0.7s",
  };

  const roles = [
    { 
      to: "/LoginAdmin", 
      icon: <FaUserTie />, 
      label: "Admin", 
      color: "from-[#D4AF37] via-[#F9E2AF] to-[#0f172a] bg-size-[300%_auto] transition-all duration-[1500ms] ease-in-out group-hover:bg-right", 
      shcolor: "rgba(212,175,55,0.25)" 
    },
    { 
      to: "/LoginEmploye", 
      icon: <FaUser />, 
      label: "Employee", 
      color: "from-[#2563eb] via-[#7c3aed] to-[#0f172a] bg-size-[300%_auto] transition-all duration-[1500ms] ease-in-out group-hover:bg-right", 
      shcolor: "rgba(124,58,237,0.25)" 
    },
  ];

  return (
    <div ref={containerRef} className="h-screen flex flex-col justify-center items-center text-white overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-125 h-125 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-125 h-125 bg-indigo-400/10 rounded-full blur-[120px] animate-pulse" />

      <h1 className="text-5xl font-black mb-16 tracking-tighter bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
        SELECT PORTAL
      </h1>

      <div className="flex flex-col md:flex-row gap-15 z-10">
        {roles.map((role, i) => (
          <Link 
            key={role.label} 
            to={role.to} 
            ref={el => cardsRef.current[i] = el}
            className="block"
          >
            <div 
              style={glassStyle} 
              className={`group hover:z-5000 flex flex-col w-72 h-80 justify-center items-center rounded-[2.5rem] transition-all duration-700 ease-out hover:-translate-y-6 hover:border-blue-500/40`}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0px 10px 400px ${role.shcolor}`}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
            >
              <div className={`drt p-7 rounded-2xl bg-linear-to-br ${role.color} mb-12 shadow-xl group-hover:scale-110 transition-transform duration-700`}>
                <span className="drt text-5xl text-white">{role.icon}</span>
              </div>
              <h2 className="text-2xl font-bold tracking-widest uppercase group-hover:tracking-[0.2em] transition-all duration-700">
                {role.label}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LoginChoise;