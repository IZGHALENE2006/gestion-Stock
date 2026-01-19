import React, { useState, useLayoutEffect, useRef, useMemo } from "react";
import { Toaster } from 'react-hot-toast';
import { IoCartOutline, IoCashOutline, IoCheckmarkCircleOutline, IoTimeOutline } from "react-icons/io5";
import gsap from "gsap";
import TopCard from "./TopCard";
import CaisseSection from "./Section";
import RightSidebar from "./RightSidebar";

function LaCaisse() {
  
const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prevCart,
        {
          id: product._id,
          name: product.name,
          price: product.prix_vente,
          qty: 1,
        },
      ];
    });
  };  const containerRef = useRef(null);
 

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".stat-card", { 
        y: 20, 
        opacity: 0, 
        duration: 0.5, 
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
    
    return () => ctx.revert(); 
  }, []);

  const clearCart = () => setCart([]);
  return (
    <div ref={containerRef} className="caise p-6 bg-[#0f172a] min-h-screen text-white flex flex-col gap-6 font-sans antialiased">
      <Toaster position="top-center" />
      


      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        <CaisseSection cart={cart} onAddToCart={handleAddToCart} onClearCart={clearCart} />
        <RightSidebar panierItems={cart}/>
      </div>
    </div>
  );
}

export default LaCaisse;