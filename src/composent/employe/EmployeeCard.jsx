import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
// All icons imported from the Ionicons 5 set
import { 
  IoPencil, 
  IoEyeOutline, 
  IoEyeOffOutline, 
  IoCallOutline, 
  IoMailOutline, 
  IoFingerPrintOutline, 
  IoCalendarOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoPersonOutline
} from "react-icons/io5";

export const EmployeeCard = ({ employee }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const innerRef = useRef(null);
  const passRef = useRef(null);

  const toggleFlip = (e) => {
    e.stopPropagation();
    const rotation = isFlipped ? 0 : 180;
    gsap.to(innerRef.current, { rotateY: rotation, duration: 0.6, ease: "power2.inOut" });
    setIsFlipped(!isFlipped);
  };

  const animatePassword = (e) => {
    e.stopPropagation();
    const newState = !showPassword;
    setShowPassword(newState);

    if (newState) {
      setTimeout(() => {
        gsap.fromTo(".pass-char", 
          { opacity: 0, y: 5 }, 
          { opacity: 1, y: 0, stagger: 0.05, duration: 0.2, ease: "power1.out" }
        );
      }, 0);
    }
  };

  const stopProp = (e) => e.stopPropagation();

  return (
    <div className="w-70 h-105 cursor-grab active:cursor-grabbing" style={{ perspective: "1000px" }}>
      <div ref={innerRef} className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
        
        <div className={`absolute inset-0 bg-[#1e293b]/70 backdrop-blur-xs hover:border-2 border border-gray-600 shadow-2xl rounded-3xl p-6 flex flex-col justify-between`} style={{ backfaceVisibility: "hidden" }}>
          <div>
            <div className="flex justify-between items-start mb-6">
               <div style={{ backgroundColor: employee.color }} className="w-12 h-1.5 rounded-full" />
               <div className="flex items-center gap-1">
                 {employee.isActive ? 
                    <IoCheckmarkCircleOutline className="text-green-400" size={18}/> : 
                    <IoCloseCircleOutline className="text-red-400" size={18}/>
                 }
                 <span className={`text-[10px] font-bold ${employee.isActive ? 'text-green-400' : 'text-red-400'}`}>
                   {employee.isActive ? "ACTIVE" : "OFFLINE"}
                 </span>
               </div>
            </div>
            
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              <IoPersonOutline size={20} style={{ color: employee.color }}/>
              {employee.name}
            </h3>
            <p className="text-slate-400 text-xs font-medium ml-7 mb-6 uppercase tracking-wider"
              style={{color : employee.color}}
            >{employee.role}</p>
            
            <div className="space-y-5 ml-1 mt-7">
              <div className="flex items-center gap-3 text-slate-300">
                <IoMailOutline className="text-slate-500" size={18}/>
                <span className="text-xs truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <IoCallOutline className="text-slate-500" size={18}/>
                <span className="text-xs">{employee.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <IoFingerPrintOutline className="text-slate-500" size={18}/>
                <span className="text-xs font-mono">{employee.cin.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <div className="bg-slate-800/80 overflow-hidden p-2 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[9px] text-slate-500 font-bold uppercase mb-1">Access Key</span>
                  <div className="flex min-h-4">
                    {showPassword ? (
                      employee.password.split('').map((char, i) => (
                        <span key={i} className="pass-char text-white text-xs font-mono">{char}</span>
                      ))
                    ) : (
                      <span className="text-slate-600 tracking-tighter">••••••••</span>
                    )}
                  </div>
                </div>
                <button 
                  onPointerDown={animatePassword} 
                  className="p-2 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-white"
                >
                  {showPassword ? <IoEyeOffOutline size={18}/> : <IoEyeOutline size={18}/>}
                </button>
             </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 px-3 py-1.5  text-gray-400">
                <IoCalendarOutline size={14} className="" />
                <span className="text-[11px] font-semibold tracking-wide">
                  {new Date(employee.datecreate).toLocaleString("fr-FR")}
                </span>
              </div>

              <button 
                onPointerDown={toggleFlip} 
                className="p-3 bg-slate-800 hover:bg-white group rounded-2xl text-white transition-all border border-slate-700"
              >
                <IoPencil size={16} className='group-hover:text-slate-900'/>
              </button>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-white rounded-3xl p-6 flex flex-col shadow-2xl" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
          <div className="flex items-center gap-2 mb-6">
            <IoPencil className="text-slate-400" />
            <h4 className="text-slate-800 text-xs font-black uppercase tracking-widest">Update Profile</h4>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
           {[
  { label: "Name", val: employee.name, icon: <IoPersonOutline />, type: "text" },
  { label: "Email", val: employee.email, icon: <IoMailOutline />, type: "email" },
  { label: "Phone", val: employee.phone, icon: <IoCallOutline />, type: "tel" },
  { label: "CIN", val: employee.cin, icon: <IoFingerPrintOutline />, type: "text" },
  { label: "Password", val: employee.password, icon: <IoEyeOffOutline />, type: "password" }
].map((f, i) => (
  <div key={i} className="group">
    <label className="text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1 mb-1">
      {f.icon} {f.label}
    </label>
    <input 
      type={f.type} 
      onPointerDown={stopProp}
      className="w-full border-b-2 border-slate-100 py-1 text-slate-800 text-sm font-semibold outline-none focus:border-slate-800 transition-colors" 
      defaultValue={f.val} 
    />
  </div>
))}
          </div>

          <button 
            onPointerDown={toggleFlip} 
            className="mt-6 w-full py-4 text-white rounded-2xl text-xs font-bold shadow-lg hover:brightness-110 transition-all"
            style={{ backgroundColor: employee.color }}
          >
            CONFIRM CHANGES
          </button>
        </div>
      </div>
    </div>
  );
};