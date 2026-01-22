import { useState } from "react";
import { IoSearchOutline, IoAddOutline } from "react-icons/io5";
import AddEmploye from "./AddEmploye";

export default function EmployeeSearch() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-8 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 flex flex-wrap justify-between items-center gap-4 shadow-sm transition-colors duration-300">
      
      {/* LEFT: Search Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search input group */}
        <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
          <span className="pl-3 text-slate-400 dark:text-slate-500">
            <IoSearchOutline size={18} />
          </span>
          <input
            type="text"
            placeholder="Search employee..."
            className="bg-transparent text-sm text-slate-700 dark:text-slate-200 px-3 py-2.5 outline-none w-48 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Action button - Neutrally Dark */}
        <button className="px-5 py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 dark:hover:bg-slate-600 transition-all active:scale-95 shadow-md">
          Search
        </button>
      </div>

      {/* RIGHT: Add Button - Emerald Theme */}
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-2.5 rounded-xl bg-emerald-600 dark:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 dark:hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
      >
        <IoAddOutline size={18} />
        Add Employee
      </button>

      {/* Modal Component */}
      <AddEmploye open={open} onClose={() => setOpen(false)} />
    </div>
  );
}