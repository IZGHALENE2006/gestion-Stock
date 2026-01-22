import { 
  IoMailOutline, 
  IoCallOutline, 
  IoLocationOutline, 
  IoCreateOutline, 
  IoTrashOutline,
  IoShieldCheckmarkOutline
} from "react-icons/io5";

const FrnCard = ({ supplier, onEdit, onDelete, viewType }) => {
  const firstLetter = supplier.name ? supplier.name.charAt(0).toUpperCase() : "?";

  if (viewType === 'list') {
    // --- VIEW LIST STYLE ---
    return (
      <div className="bg-white border border-[#e2e8f0] p-4 rounded-2xl flex items-center justify-between hover:bg-[#f1f5f9] transition-all group shadow-sm mb-3">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-indigo-600 flex items-center justify-center font-black text-lg border border-indigo-100">
            {firstLetter}
          </div>
          <div>
            <h3 className="text-[#0f172a] font-bold text-sm uppercase tracking-tight">{supplier.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] text-[#64748b] flex items-center gap-1 font-bold">
                <IoCallOutline /> {supplier.phone}
              </span>
              <span className="text-[10px] text-[#64748b] flex items-center gap-1 font-bold uppercase">
                <IoLocationOutline /> {supplier.Ville}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-2 text-indigo-500 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-indigo-100">
            <IoCreateOutline size={18} />
          </button>
          <button onClick={onDelete} className="p-2 text-rose-500 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-rose-100">
            <IoTrashOutline size={18} />
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW GRID STYLE ---
  return (
    <div className="group relative bg-white border border-[#e2e8f0] rounded-[2.5rem] p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-200 overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 rounded-2xl bg-[#0f172a] flex items-center justify-center shadow-lg transform group-hover:rotate-3 transition-transform border border-slate-100">
          <span className="text-xl font-black text-white">{firstLetter}</span>
        </div>
        <span className="flex items-center gap-1 text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
          <IoShieldCheckmarkOutline size={12} /> Verified
        </span>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-black text-[#0f172a] uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
          {supplier.name}
        </h3>
        <p className="text-[#64748b] text-[10px] font-black flex items-center gap-1 mt-1 uppercase tracking-widest">
          <IoLocationOutline size={14} /> {supplier.Ville || "No Location"}
        </p>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]">
          <IoMailOutline className="text-indigo-500" />
          <span className="text-xs text-[#334155] font-bold truncate">{supplier.email}</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]">
          <IoCallOutline className="text-emerald-500" />
          <span className="text-xs text-[#334155] font-bold">{supplier.phone}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-[#e2e8f0]">
        <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white font-black text-[10px] tracking-widest transition-all">
          <IoCreateOutline size={16} /> MODIFIER
        </button>
        <button onClick={onDelete} className="px-4 py-3 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
          <IoTrashOutline size={18} />
        </button>
      </div>
    </div>
  );
};

export default FrnCard;