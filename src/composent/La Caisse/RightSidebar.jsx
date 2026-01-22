import React, { useState } from "react";
import { IoFlashOutline, IoCartOutline, IoReceiptOutline } from "react-icons/io5";

export default function RightSidebar({ panierItems = [] }) {
  const [activeTab, setActiveTab] = useState("panier");
  const [DerniereCommande, setDerniereCommande] = useState([]);

  const FunctionBtn = ({ label, isActive, onClick, activeColor }) => (
    <button 
      onClick={onClick}
      className={`relative py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 border-2 
        ${isActive 
          ? `${activeColor} text-white border-transparent shadow-md shadow-blue-100` 
          : 'bg-white text-[#64748b] border-[#e2e8f0] hover:border-blue-200'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full lg:w-112.5 flex flex-col gap-6">
      
      {/* SECTION: Fonctions Système */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-[#e2e8f0] shadow-sm">
        <h3 className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <IoFlashOutline size={18} className="text-blue-600" /> Fonctions Système
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FunctionBtn 
            label="Panier" 
            isActive={activeTab === "panier"}
            onClick={() => setActiveTab("panier")}
            activeColor="bg-blue-600" 
          />
          <FunctionBtn 
            label="Commandes" 
            isActive={activeTab === "commandes"}
            onClick={() => setActiveTab("commandes")}
            activeColor="bg-[#0f172a]" 
          />
        </div>
      </div>

      {/* SECTION: Content (Panier or Commandes) */}
      <div className="bg-white flex-1 rounded-[2.5rem] border border-[#e2e8f0] overflow-hidden min-h-125 flex flex-col shadow-sm">
        
        {activeTab === "panier" ? (
          <>
            <div className="p-5 border-b border-[#e2e8f0] flex justify-between items-center bg-[#f8fafc]">
              <h3 className="font-black text-sm flex items-center gap-2 text-[#0f172a] uppercase tracking-tight">
                <IoCartOutline size={20} className="text-blue-600"/> Panier Actuel
              </h3>
              <span className="bg-blue-50 text-blue-600 text-[10px] px-3 py-1 rounded-full font-black border border-blue-100">
                {panierItems.length} ARTICLES
              </span>
            </div>
            
            <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-white">
              {panierItems.length > 0 ? (
                panierItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-[#f8fafc] p-4 rounded-2xl border border-[#e2e8f0] group hover:border-blue-200 transition-all">
                    <div>
                      <p className="text-sm font-black text-[#334155] uppercase tracking-tight">{item.name}</p>
                      <p className="text-[11px] font-bold text-[#64748b] mt-0.5">{item.qty} x {item.price} DH</p>
                    </div>
                    <p className="font-black text-[#0f172a] text-md">{item.price * item.qty} DH</p>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-[#cbd5e1] space-y-2 opacity-60">
                   <IoCartOutline size={40} />
                   <p className="text-xs font-bold uppercase tracking-widest">Panier Vide</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="p-5 border-b border-[#e2e8f0] flex justify-between items-center bg-[#f8fafc]">
              <h3 className="font-black text-sm flex items-center gap-2 text-[#0f172a] uppercase tracking-tight">
                <IoReceiptOutline size={20} className="text-blue-600"/> Historique
              </h3>
              <span className="bg-blue-50 text-blue-600 text-[10px] px-3 py-1 rounded-full font-black border border-blue-100">
                {DerniereCommande.length} COMMANDES
              </span>
            </div>
            
            <div className="overflow-x-auto flex-1 bg-white">
              <table className="w-full text-left">
                <thead className="bg-[#f8fafc] text-[#64748b] text-[9px] font-black uppercase tracking-widest border-b border-[#e2e8f0]">
                  <tr>
                    <th className="p-4">N°</th>
                    <th className="p-4">Heure</th>
                    <th className="p-4">Montant</th>
                    <th className="p-4 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {DerniereCommande.length > 0 ? (
                    DerniereCommande.map((cmd) => (
                      <tr key={cmd.id} className="hover:bg-blue-50/30 transition-colors cursor-pointer group">
                        <td className="p-4 text-xs font-black text-[#0f172a]">#{cmd.id}</td>
                        <td className="p-4 text-[11px] font-bold text-[#64748b]">{cmd.time}</td>
                        <td className="p-4 text-xs font-black text-blue-600">{cmd.total} DH</td>
                        <td className="p-4 text-right">
                          <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border border-emerald-100">
                            {cmd.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-10 text-center text-[#cbd5e1] font-bold text-xs uppercase tracking-widest">Aucune commande</td>
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