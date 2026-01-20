import { 
  FaFileInvoice, 
  FaSearch, 
  FaUserTie 
} from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";

function FactureVentes() {
  return (
    <div className="p-6 bg-[#0f172a] min-h-screen text-white space-y-6">

      {/* TOP CARDS */}
      <div className="flex flex-wrap gap-6">

        {/* TOTAL FACTURES */}
        <div className="flex-1 min-w-60 p-5 rounded-2xl bg-[#1e293b] border border-slate-700 shadow-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/20">
            <FaFileInvoice size={32} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-slate-400 text-sm">Total Factures</h1>
            <h1 className="text-3xl font-bold text-indigo-400">--</h1>
          </div>
        </div>

        {/* TOTAL MONTANT */}
        <div className="flex-1 min-w-60 p-5 rounded-2xl bg-[#1e293b] border border-slate-700 shadow-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/20">
            <FaFileInvoice size={32} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-slate-400 text-sm">Total Montant</h1>
            <h1 className="text-3xl font-bold text-emerald-400">-- DH</h1>
          </div>
        </div>

      </div>

      {/* FILTERS */}
      <div className="flex gap-4 items-end">

        {/* SELECT EMPLOYEE */}
        <div className="flex-1">
          <label className="block text-slate-400 mb-1">
            Sélection Employé
          </label>
          <div className="relative">
            <FaRegUserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select className="w-full pl-10 p-2 rounded-lg bg-[#1e293b] border border-slate-700 text-white">
              <option>All</option>
              <option>Employé 1</option>
              <option>Employé 2</option>
            </select>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex-1">
          <label className="block text-slate-400 mb-1">
            Search Facture
          </label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="N° facture / client..."
              className="w-full pl-10 p-2 rounded-lg bg-[#1e293b] border border-slate-700 text-white placeholder-slate-400"
            />
          </div>
        </div>

      </div>

      {/* FACTURE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* CARD */}
        <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-5 shadow-xl hover:border-indigo-400 transition">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-indigo-400">
              Facture #0001
            </h2>
            <span className="text-sm text-slate-400">12/01/2026</span>
          </div>

          <div className="mt-4 space-y-2 text-slate-300 text-sm">
            <p>
              <span className="text-slate-400">Client :</span> ---
            </p>
            <p className="flex items-center gap-2">
              <FaUserTie className="text-amber-400" />
              <span>Admin</span>
            </p>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span className="text-emerald-400 font-bold text-lg">
              -- DH
            </span>

            <button className="px-4 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition">
              Voir
            </button>
          </div>
        </div>

        {/* DUPLICATE CARD */}
        <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-indigo-400">
              Facture #0002
            </h2>
            <span className="text-sm text-slate-400">12/01/2026</span>
          </div>

          <div className="mt-4 space-y-2 text-slate-300 text-sm">
            <p>
              <span className="text-slate-400">Client :</span> ---
            </p>
            <p className="flex items-center gap-2">
              <FaUserTie className="text-amber-400" />
              <span>Employé</span>
            </p>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span className="text-emerald-400 font-bold text-lg">
              -- DH
            </span>

            <button className="px-4 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              Voir
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default FactureVentes;
