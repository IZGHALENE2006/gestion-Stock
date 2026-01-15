import React, { useState, useLayoutEffect, useRef } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { IoCartOutline, IoCashOutline, IoCheckmarkCircleOutline, IoTimeOutline, IoFlashOutline } from "react-icons/io5";
import gsap from "gsap";

import TopCard from "./TopCard";
import CaisseSection from "./Section";
import RightSidebar from "./RightSidebar";

function LaCaisse() {
  const [cart, setCart] = useState([]); 
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stat-card", { y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" });
      gsap.from(".ticket-section", { x: -50, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.2 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="p-6 bg-[#0f172a] min-h-screen text-white flex flex-col gap-6">
      <Toaster position="top-center" />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <TopCard className="stat-card" title="Commandes" value="2" color="text-blue-400" icon={<IoCartOutline size={24}/>} />
        <TopCard className="stat-card" title="CA Total" value="68 DH" color="text-green-400" icon={<IoCashOutline size={24}/>} />
        <TopCard className="stat-card" title="Payé" value="68 DH" color="text-emerald-400" icon={<IoCheckmarkCircleOutline size={24}/>} />
        <TopCard className="stat-card" title="Crédit" value="0 DH" color="text-red-400" icon={<IoTimeOutline size={24}/>} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        <CaisseSection cart={cart} />

        <RightSidebar />
      </div>
    </div>
  );
}

export default LaCaisse;