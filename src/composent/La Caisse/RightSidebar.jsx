import React, { useState } from "react";
import { IoFlashOutline, IoCartOutline, IoReceiptOutline } from "react-icons/io5";

export default function RightSidebar({ panierItems = [] }) {
  const [activeTab, setActiveTab] = useState("panier");

  const [DerniereCommande , setDerniereCommande] = useState([])


  const FunctionBtn = ({ label, color, isActive, onClick }) => (
    <button 
      onClick={onClick}
      className={`${color} relative hover:opacity-90 py-3 rounded-xl text-xs font-bold uppercase transition-all shadow-lg active:scale-95 border-2 ${isActive ? 'border-white/40' : 'border-transparent'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full lg:w-112.5 flex flex-col gap-6 ">
      <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-700">
        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
          <IoFlashOutline size={20} className="text-yellow-400" /> Fonctions Système
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <FunctionBtn 
            label="Panier" 
            isActive={activeTab === "panier"}
            onClick={() => setActiveTab("panier")}
            color="bg-linear-to-r from-[#ff6c27] via-[#ffd727] to-[#ff6c27] bg-size-[300%_auto] transition-all duration-1000 ease-in-out hover:bg-right cursor-pointer" 
          />
          <FunctionBtn 
            label="Dernières Commandes" 
            isActive={activeTab === "commandes"}
            onClick={() => setActiveTab("commandes")}
            color="bg-linear-to-r from-[#5c3bb4] via-[#72b4ff] to-[#5c3bb4] bg-size-[300%_auto] transition-all duration-1000 ease-in-out hover:bg-right cursor-pointer" 
          />
        </div>
      </div>

      <div className="bg-[#1e293b] flex-1 rounded-2xl border border-slate-700 overflow-hidden min-h-125 flex flex-col">
        {activeTab === "panier" ? (
          <>
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/30">
              <h3 className="font-bold flex items-center gap-2 text-white">
                <IoCartOutline size={18}/> Panier Actuel
              </h3>
              <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-1 rounded-full font-bold">
                {panierItems.length} Articles
              </span>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {panierItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-[#0f172a]/40 p-3 rounded-xl border border-slate-700/50">
                  <div>
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.qty} x {item.price} DH</p>
                  </div>
                  <p className="font-bold text-white">{item.price * item.qty} DH</p>
                </div>
              ))}
            </div>

          </>
        ) : (
          <>
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/30">
              <h3 className="font-bold flex items-center gap-2 text-white">
                <IoReceiptOutline size={18}/> Dernières Commandes
              </h3>
                <span className="bg-yellow-500/20 text-yellow-400 text-[10px] px-2 py-1 rounded-full font-bold">
                  {DerniereCommande.length} Commandes
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0f172a] text-slate-400 text-[10px] uppercase">
                  <tr>
                    <th className="p-3">N°</th>
                    <th className="p-3">Heure</th>
                    <th className="p-3">Montant</th>
                    <th className="p-3 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {DerniereCommande.map((cmd) => (
                    <tr key={cmd.id} className="hover:bg-[#0f172a]/50 transition cursor-pointer">
                      <td className="p-3 font-medium text-white">{cmd.id}</td>
                      <td className="p-3 text-slate-400">{cmd.time}</td>
                      <td className="p-3 text-[#2C74B3] font-bold">{cmd.total} DH</td>
                      <td className="p-3 text-right">
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-[10px] font-bold">
                          {cmd.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}