import React from "react";
import { IoFlashOutline } from "react-icons/io5";

export default function RightSidebar() {
  const lastCommands = [
    { id: "#226", time: "21:15", total: 34, status: "Payé" },
    { id: "#27", time: "21:22", total: 85, status: "Payé" },
  ];

  const FunctionBtn = ({ label, color }) => (
    <button className={`${color} hover:opacity-90 py-3 rounded-xl text-xs font-bold uppercase transition-all shadow-lg active:scale-95`}>
      {label}
    </button>
  );

  return (
    <div className="w-full lg:w-[450px] flex flex-col gap-6">
      <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-700">
        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
          <IoFlashOutline className="text-yellow-400" /> Fonctions Système
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <FunctionBtn label="Articles" color="bg-emerald-600" />
          <FunctionBtn label="Clients" color="bg-purple-600" />
          <FunctionBtn label="Fournisseurs" color="bg-orange-600" />
          <FunctionBtn label="Stock" color="bg-amber-500" />
        </div>
      </div>

      <div className="bg-[#1e293b] flex-1 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="font-bold">Dernières Commandes</h3>
          <button className="text-[#2C74B3] text-xs hover:underline">Voir tout</button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0f172a] text-slate-400 text-[10px] uppercase">
            <tr>
              <th className="p-3">N°</th>
              <th className="p-3">Heure</th>
              <th className="p-3">Montant</th>
              <th className="p-3">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {lastCommands.map((cmd) => (
              <tr key={cmd.id} className="hover:bg-[#0f172a]/50 transition">
                <td className="p-3 font-medium">{cmd.id}</td>
                <td className="p-3 text-slate-400">{cmd.time}</td>
                <td className="p-3 text-[#2C74B3] font-bold">{cmd.total} DH</td>
                <td className="p-3">
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-[10px] font-bold">{cmd.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}