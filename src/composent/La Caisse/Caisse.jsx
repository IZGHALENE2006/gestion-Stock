import React, { useState, useLayoutEffect, useRef } from "react";
import { Toaster, toast } from 'react-hot-toast';
import gsap from "gsap";
import CaisseSection from "./Section";
import RightSidebar from "./RightSidebar";
import "./Caisse.css";
function LaCaisse() {
  const [cart, setCart] = useState([]);
  const containerRef = useRef(null);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product._id);
      
      // LOGIC: Check Stock Availability
      if (existingItem) {
        if (existingItem.qty >= product.quantite) {
          toast.error(`Stock insuffisant! (${product.quantite} max)`, {
            icon: '⚠️',
            style: { borderRadius: '15px', background: '#fff', color: '#000', fontWeight: 'bold' }
          });
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      // First time adding
      if (product.quantite <= 0) {
        toast.error("Produit en rupture de stock");
        return prevCart;
      }

      return [
        ...prevCart,
        {
          id: product._id,
          name: product.name,
          price: product.prix_vente,
          qty: 1,
          stockMax: product.quantite // Kan-khabiw l-max hna bach n-checkiw f l-panier
        },
      ];
    });
  };

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".ticket-section", { 
        y: 30, 
        opacity: 0, 
        duration: 0.8, 
        ease: "expo.out" 
      });
    }, containerRef);
    return () => ctx.revert(); 
  }, []);

  const clearCart = () => setCart([]);

  return (
    // Background fatih dialna: f8fafc
    <div ref={containerRef} className="p-6 bg-gray-100 dark:bg-[#1e293b] min-h-screen text-[#1e293b] dark:text-white flex flex-col gap-6 font-sans">
      <Toaster position="top-center" />

      <div className="flex flex-col lg:flex-row gap-6 flex-1 h-full">
        {/* Pass functions to Section */}
        <CaisseSection 
           cart={cart} 
           onAddToCart={handleAddToCart} 
           onClearCart={clearCart} 
        />
        
        {/* RightSidebar shows the cart */}
        <RightSidebar panierItems={cart}/>
      </div>
    </div>
  );
}

export default LaCaisse;