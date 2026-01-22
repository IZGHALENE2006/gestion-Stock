import React, { useState, useEffect, useRef } from "react";
import { IoFlashOutline, IoCartOutline, IoReceiptOutline, IoTrashOutline } from "react-icons/io5";
import gsap from "gsap";

export default function RightSidebar({ panierItems = [] }) {
  const [activeTab, setActiveTab] = useState("panier");
  const [DerniereCommande, setDerniereCommande] = useState([]);
  const cartContainerRef = useRef(null);

  // GSAP Animation when cart items change
  useEffect(() => {
    if (activeTab === "panier" && panierItems.length > 0) {
      gsap.fromTo(
        ".cart-item-anim",
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [panierItems.length, activeTab]);

  const FunctionBtn = ({ label, isActive, onClick, activeColor }) => (
    <button 
      onClick={onClick}
      className={`relative py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-sm active:scale-95 border-2 flex items-center justify-center gap-2
        ${isActive 
          ? `${activeColor} text-white border-transparent shadow-lg` 
          : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900/50'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full lg:w-100 flex flex-col gap-6">
      
      {/* SECTION: Fonctions Système */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <IoFlashOutline size={18} className="text-emerald-500" /> Actions Rapides
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FunctionBtn 
            label="Panier" 
            isActive={activeTab === "panier"}
            onClick={() => setActiveTab("panier")}
            activeColor="bg-amber-400 shadow-amber-500/20" 
          />
          <FunctionBtn 
            label="Commandes" 
            isActive={activeTab === "commandes"}
            onClick={() => setActiveTab("commandes")}
            activeColor="bg-sky-600 shadow-sky-500/20" 
          />
        </div>
      </div>

      {/* SECTION: Main Content Area */}
      <div className="bg-white dark:bg-slate-900 flex-1 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden min-h-125 flex flex-col shadow-sm transition-colors">
        
        {activeTab === "panier" ? (
          <>
            {/* Cart Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-black text-sm flex items-center gap-2 text-slate-900 dark:text-white uppercase tracking-tight">
                <IoCartOutline size={22} className="text-emerald-500"/> Panier
              </h3>
              <span className="bg-emerald-500 text-white text-[10px] px-3 py-1.5 rounded-xl font-black shadow-lg shadow-emerald-500/20">
                {panierItems.length} ARTICLES
              </span>
            </div>
            
            {/* Cart Items List */}
            <div ref={cartContainerRef} className="flex-1 p-5 overflow-y-auto space-y-3">
              {panierItems.length > 0 ? (
                panierItems.map((item) => (
                  <div key={item.id} className="cart-item-anim flex justify-between items-center bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
                    <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-[10px]">
                        {item.qty}x
                      </div>
                      <div>
                        <p className="text-[12px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight line-clamp-1">{item.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">{item.price} DH / unité</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900 dark:text-white text-sm">{item.price * item.qty} DH</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 space-y-4">
                   <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-full border-2 border-dashed border-slate-100 dark:border-slate-800">
                    <IoCartOutline size={48} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em]">Votre panier est vide</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Orders Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-black text-sm flex items-center gap-2 text-slate-900 dark:text-white uppercase tracking-tight">
                <IoReceiptOutline size={22} className="text-emerald-500"/> Historique
              </h3>
            </div>
            
            {/* Orders Table */}
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="p-5">ID</th>
                    <th className="p-5">Heure</th>
                    <th className="p-5">Total</th>
                    <th className="p-5 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {DerniereCommande.length > 0 ? (
                    DerniereCommande.map((cmd) => (
                      <tr key={cmd.id} className="hover:bg-emerald-50 dark:hover:bg-emerald-500/5 transition-colors cursor-pointer group">
                        <td className="p-5 text-xs font-black text-slate-900 dark:text-slate-200">#{cmd.id}</td>
                        <td className="p-5 text-[11px] font-bold text-slate-400 dark:text-slate-500">{cmd.time}</td>
                        <td className="p-5 text-xs font-black text-emerald-600 dark:text-emerald-400">{cmd.total} DH</td>
                        <td className="p-5 text-right">
                          <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border border-emerald-200 dark:border-emerald-500/20">
                            {cmd.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-20 text-center">
                        <p className="text-slate-300 dark:text-slate-700 font-black text-[10px] uppercase tracking-[0.3em]">Aucune commande</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}