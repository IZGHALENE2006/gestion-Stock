import { 
  IoMailOutline, 
  IoCallOutline, 
  IoLocationOutline, 
  IoCreateOutline, 
  IoTrashOutline,
  IoChevronForwardOutline,
  IoShieldCheckmarkOutline
} from "react-icons/io5";

const SupplierCard = ({ supplier, onEdit, onDelete, role }) => {
  const firstLetter = supplier.name ? supplier.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="group relative bg-[#1e293b]/50 backdrop-blur-xl border border-slate-700/50 rounded-4xl p-1 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(44,116,179,0.2)] hover:border-[#2C74B3]/50 overflow-hidden">
      
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-700" />

      <div className="relative p-6 z-10">
        
        <div className="flex justify-between items-start mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#2C74B3] to-[#123456] flex items-center justify-center shadow-lg transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 border border-white/10">
              <span className="text-2xl font-black text-white tracking-tighter">
                {firstLetter}
              </span>
            </div>
            
          </div>
          
          <span className="flex items-center gap-1 text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            <IoShieldCheckmarkOutline size={12} />
            Verified
          </span>
        </div>

        {/* Identity */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white group-hover:text-[#2C74B3] transition-colors duration-300">
            {supplier.name}
          </h3>
          <p className="text-slate-500 text-xs font-medium flex items-center gap-1 mt-1 uppercase tracking-tighter">
            <IoLocationOutline size={14} className="text-slate-400" />
            {supplier.Ville}
          </p>
        </div>

        {/* Contact Actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 group/row hover:bg-slate-800 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <IoMailOutline size={18} />
              </div>
              <span className="text-sm text-slate-300 truncate max-w-35 font-medium">{supplier.email}</span>
            </div>
            <IoChevronForwardOutline className="text-slate-600 group-hover/row:translate-x-1 transition-transform" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 group/row hover:bg-slate-800 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <IoCallOutline size={18} />
              </div>
              <span className="text-sm text-slate-300 font-medium">{supplier.phone}</span>
            </div>
            <IoChevronForwardOutline className="text-slate-600 group-hover/row:translate-x-1 transition-transform" />
          </div>
        </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-slate-700/50">
            <button 
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2C74B3]/10 text-[#2C74B3] hover:bg-[#2C74B3] hover:text-white font-bold text-[10px] tracking-widest transition-all duration-300 active:scale-95"
            >
              <IoCreateOutline size={16} />
              MODIFIER
            </button>
            <button 
              onClick={onDelete}
              className="w-12 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              <IoTrashOutline size={18} />
            </button>
          </div>
      </div>
    </div>
  );
};

export default SupplierCard;