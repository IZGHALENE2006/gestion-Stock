import React, { useState, useLayoutEffect, useRef, useMemo } from "react";
import { Toaster } from 'react-hot-toast';
import { IoCartOutline, IoCashOutline, IoCheckmarkCircleOutline, IoTimeOutline } from "react-icons/io5";
import gsap from "gsap";
import TopCard from "./TopCard";
import CaisseSection from "./Section";
import RightSidebar from "./RightSidebar";

function LaCaisse() {
  const [cart] = useState([]); // In a real app, this would come from context/Redux
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".stat-card", { 
        y: 20, 
        opacity: 0, 
        duration: 0.5, 
        stagger: 0.05, 
        ease: "power2.out" 
      });
      gsap.from(".ticket-section", { 
        x: -30, 
        opacity: 0, 
        duration: 0.6, 
        ease: "power3.out", 
        delay: 0.2 
      });
    }, containerRef);
    
    return () => ctx.revert(); // Cleanup is crucial for performance
  }, []);

  // Memoize static sidebars if they don't depend on changing state
  const memoizedSidebar = useMemo(() => <RightSidebar />, []);

  return (
    <div ref={containerRef} className="caise p-6 bg-[#0f172a] min-h-screen text-white flex flex-col gap-6 font-sans antialiased">
      <Toaster position="top-center" />
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TopCard className="stat-card" title="Commandes" value="2" color="text-blue-400" icon={<IoCartOutline size={22}/>} />
        <TopCard className="stat-card" title="CA Total" value="68 DH" color="text-green-400" icon={<IoCashOutline size={22}/>} />
        <TopCard className="stat-card" title="Payé" value="68 DH" color="text-emerald-400" icon={<IoCheckmarkCircleOutline size={22}/>} />
        <TopCard className="stat-card" title="Crédit" value="0 DH" color="text-red-400" icon={<IoTimeOutline size={22}/>} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        <CaisseSection cart={cart} />
        {memoizedSidebar}
      </div>
    </div>
  );
}

export default LaCaisse;