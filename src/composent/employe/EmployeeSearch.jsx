import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import AddEmploye from "./AddEmploye";

export default function EmployeeSearch() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-8 w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 flex flex-wrap justify-between items-center gap-4 shadow-sm">
      
      {/* LEFT */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search input */}
        <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          <span className="px-3 text-slate-400">
            <IoSearchOutline />
          </span>
          <input
            type="text"
            placeholder="Search employee..."
            className="bg-transparent text-sm text-slate-700 px-2 py-2 outline-none w-48"
          />
        </div>

        {/* Search button */}
        <button className="px-5 py-2 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 transition">
          Search
        </button>
      </div>

      {/* RIGHT */}
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2"
      >
        <span className="text-lg leading-none">+</span>
        Add Employee
      </button>

      <AddEmploye open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
