import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { UpdateEmploye } from '../../slices/sliceEmploye';
import toast, { Toaster } from 'react-hot-toast';

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
import { useDispatch, useSelector } from 'react-redux';

export const EmployeeCard = ({ employee }) => {
  const dispatch = useDispatch();

  const employeeFromRedux = useSelector(state => 
    state.Employe.Employe.find(emp => emp._id === employee._id)
  );

  const [newinfoEmp, setNewInfoEmp] = useState(employeeFromRedux || employee);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const innerRef = useRef(null);

  useEffect(() => {
    if (employeeFromRedux) {
      setNewInfoEmp(employeeFromRedux);
    }
  }, [employeeFromRedux]);

  // ===================== Logic Update =====================
  const HandleUpdateEmploye = (id) => {
    dispatch(UpdateEmploye({ id, newinfoEmp }))
      .unwrap()
      .then(() => {
        toast.success("Employé mis à jour avec succès ", {
          duration: 3000,
          style: {
            border: "1px solid #00d435",
            padding: "16px",
            color: "#00d435",
            backgroundColor: "#fffffe",
          },
        });
        setIsFlipped(false);
        gsap.to(innerRef.current, { rotateY: 0, duration: 0.6, ease: "power2.inOut" });
      })
      .catch((err) => {
        toast.error(err || "Erreur serveur ", {
          duration: 3000,
          style: {
            border: "1px solid #ff0000",
            padding: "16px",
            color: "#ff0000",
            backgroundColor: "#fffffe",
          },
        });
      });
  };

  // ===================== Flip wo password =====================
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

  const { loading } = useSelector(state => state.Employe);

  return (
    <div className="w-70 h-105 cursor-grab active:cursor-grabbing" style={{ perspective: "1000px" }}>
      <div ref={innerRef} className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
        
        {/* ===== Front Face ===== */}
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

        {/* ===== Back Face ===== */}
        <div className="absolute inset-0 bg-white rounded-3xl p-6 flex flex-col shadow-2xl" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
          <div className="flex items-center gap-2 mb-6">
            <IoPencil className="text-slate-400" />
            <h4 className="text-slate-800 text-xs font-black uppercase tracking-widest">Update Profile</h4>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {/* Name */}
            <div className="group">
              <label className="text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1 mb-1">
                <IoPersonOutline /> Name
              </label>
              <input
                type="text"
                className="w-full border-b-2 border-slate-100 py-1 text-slate-800 text-sm font-semibold outline-none focus:border-slate-800 transition-colors"
                value={newinfoEmp.name}
                onChange={(e)=>setNewInfoEmp({...newinfoEmp,name:e.target.value})}
              />
            </div>
            {/* Email */}
            <div className="group">
              <label className="text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1 mb-1">
                <IoMailOutline /> Email
              </label>
              <input
                type="email"
                className="w-full border-b-2 border-slate-100 py-1 text-slate-800 text-sm font-semibold outline-none focus:border-slate-800 transition-colors"
                value={newinfoEmp.email}
                onChange={(e)=>setNewInfoEmp({...newinfoEmp,email:e.target.value})}
              />
            </div>
            {/* Phone */}
            <div className="group">
              <label className="text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1 mb-1">
                <IoCallOutline /> Phone
              </label>
              <input
                type="tel"
                className="w-full border-b-2 border-slate-100 py-1 text-slate-800 text-sm font-semibold outline-none focus:border-slate-800 transition-colors"
                value={newinfoEmp.phone}
                onChange={(e)=>setNewInfoEmp({...newinfoEmp,phone:e.target.value})}
              />
            </div>
            {/* CIN */}
            <div className="group">
              <label className="text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1 mb-1">
                <IoFingerPrintOutline /> CIN
              </label>
              <input
                type="text"
                className="w-full border-b-2 border-slate-100 py-1 text-slate-800 text-sm font-semibold outline-none focus:border-slate-800 transition-colors"
                value={newinfoEmp.cin}
                onChange={(e)=>setNewInfoEmp({...newinfoEmp,cin:e.target.value})}
              />
            </div>
            {/* Password */}
            <div className="group">
              <label className="text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1 mb-1">
                <IoEyeOffOutline /> Password
              </label>
              <input
                type="password"
                className="w-full border-b-2 border-slate-100 py-1 text-slate-800 text-sm font-semibold outline-none focus:border-slate-800 transition-colors"
                value={newinfoEmp.password}
                onChange={(e)=>setNewInfoEmp({...newinfoEmp,password:e.target.value})}
              />
            </div>

            {/* Status */}
            <div className="group pt-2">
              <label className="text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1 mb-2">
                <IoCheckmarkCircleOutline /> Account Status
              </label>
              <div
                onClick={() =>
                  setNewInfoEmp((prev) => ({
                    ...prev,
                    isActive: !prev.isActive,
                  }))
                }
                className="flex items-center gap-3 cursor-pointer select-none"
              >
                <div
                  className="relative w-11 h-6 rounded-full transition-colors duration-200"
                  style={{
                    backgroundColor: newinfoEmp.isActive
                      ? employee.color
                      : "#cbd5e1",
                  }}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      newinfoEmp.isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
                <span
                  className={`text-sm font-bold ${
                    newinfoEmp.isActive ? "text-slate-800" : "text-slate-500"
                  }`}
                >
                  {newinfoEmp.isActive ? "Active" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <button 
            className="mt-6 w-full py-4 text-white rounded-2xl text-xs font-bold shadow-lg hover:brightness-110 transition-all"
            style={{ backgroundColor: employee.color }}
            onClick={()=>HandleUpdateEmploye(employee._id)}
          >
            {loading ? "CONFIRM CHANGES..." : "CONFIRM CHANGES"}
          </button>
        </div>
      </div>
      <Toaster/>
    </div>
  );
};
