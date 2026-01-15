import React, { memo } from "react";
import "./Caisse.css";

const TopCard = ({ title, value, color, icon, className }) => {
  return (
    <div className={`${className} CaisseCard bg-[#1e293b] p-4 rounded-2xl border border-slate-700 flex items-center gap-4 shadow-lg hover:border-slate-500 transition-all duration-300`}>
      <div className={`p-3 rounded-xl bg-[#0f172a] ${color} shadow-inner`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">{title}</p>
        <h3 className="text-xl font-black text-white">{value}</h3>
      </div>
    </div>
  );
};

export default memo(TopCard);