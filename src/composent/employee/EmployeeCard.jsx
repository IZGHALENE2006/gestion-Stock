import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { IoPencil, IoCheckmarkSharp } from "react-icons/io5";

export const EmployeeCard = ({ employee }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const innerRef = useRef(null);

  const toggleFlip = (e) => {
    e.stopPropagation();
    const rotation = isFlipped ? 0 : 180;
    gsap.to(innerRef.current, { rotateY: rotation, duration: 0.6, ease: "power2.inOut" });
    setIsFlipped(!isFlipped);
  };

  const stopProp = (e) => e.stopPropagation();

  return (
    <div className="w-[250px] h-[300px] cursor-grab active:cursor-grabbing" style={{ perspective: "1000px" }}>
      <div ref={innerRef} className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
        
        {/* FRONT */}
        <div className="absolute inset-0 bg-slate-800 border border-slate-700 rounded-3xl p-6 flex flex-col justify-between shadow-lg" style={{ backfaceVisibility: "hidden" }}>
          <div>
            <div className="w-10 h-1 bg-[#2C74B3] rounded-full mb-4" />
            <h3 className="text-white font-bold text-xl">{employee.name}</h3>
            <p className="text-[#2C74B3] text-sm font-medium">Engineer</p>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-xs font-bold uppercase">Age: {employee.age}</span>
            <button 
              onPointerDown={toggleFlip}
              className="p-3 bg-slate-700 hover:bg-[#2C74B3] rounded-2xl text-white transition-colors"
            >
              <IoPencil size={15} />
            </button>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 bg-white rounded-3xl p-6 flex flex-col shadow-2xl" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
          <h4 className="text-slate-400 text-[10px] font-black uppercase mb-4 tracking-widest">Update Employee</h4>
          
          <input 
             onPointerDown={stopProp}
             className="w-full border-b border-slate-200 py-2 mb-4 text-slate-800 font-semibold outline-none focus:border-[#2C74B3]" 
             placeholder="Name"
             defaultValue={employee.name} 
          />
          
          <input 
             onPointerDown={stopProp}
             type="number"
             className="w-full border-b border-slate-200 py-2 text-slate-800 font-semibold outline-none focus:border-[#2C74B3]" 
             placeholder="Age"
             defaultValue={employee.age} 
          />

          <button 
            onPointerDown={toggleFlip} 
            className="mt-auto w-full py-3 bg-[#2C74B3] text-white rounded-2xl text-xs font-bold hover:shadow-lg transition-all"
          >
            CONFIRM
          </button>
        </div>

      </div>
    </div>
  );
};