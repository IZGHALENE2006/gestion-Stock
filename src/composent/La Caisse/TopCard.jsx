import React, { memo } from "react";

const TopCard = ({ title, value, color, icon, className }) => {
  return (
    <div className={`${className} bg-white p-5 rounded-[2rem] border border-[#e2e8f0] flex items-center gap-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group`}>
      
      {/* Icon Container: Khdemna b gradient khfif o shadow naqi */}
      <div className={`p-4 rounded-2xl bg-[#f8fafc] ${color} shadow-sm group-hover:scale-110 transition-transform duration-300 flex items-center justify-center`}>
        {icon}
      </div>

      <div>
        {/* Title: Text sghir o black (slate-500) */}
        <p className="text-[#64748b] text-[10px] uppercase font-black tracking-[0.15em] mb-1">
          {title}
        </p>
        
        {/* Value: Text kbir o k7al (slate-900) */}
        <h3 className="text-2xl font-black text-[#0f172a] tracking-tight">
          {value}
        </h3>
      </div>
    </div>
  );
};

export default memo(TopCard);