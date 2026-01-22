import { IoSearchOutline, IoAddOutline, IoFilterOutline, IoLayersOutline } from "react-icons/io5";
import Dialog from "../Dialog/Dialog";
import { useEffect, useState } from "react";
import AddProductForm from "./AddProductForm"
import ProdTable from "./ProdTable"
import { useDispatch, useSelector } from "react-redux";
import { GetAllCatefory } from "../../slices/SilceCategory";

export default function ProductList() {
  const Dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { Category } = useSelector((state) => state.category);
  const { role } = useSelector(state => state.LoginAdmin);

  useEffect(() => {
    Dispatch(GetAllCatefory());
  }, [Dispatch]);

  return (
    <div className="space-y-4">
      {/* --- HEADER ACTIONS --- */}
      <div className="mt-7 p-4 px-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-4xl flex flex-wrap justify-between items-center gap-4 shadow-sm">
        
        {/* LEFT: Search & Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Search Input Group */}
          <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-100 dark:focus-within:ring-emerald-900/30 transition-all">
            <IoSearchOutline className="text-slate-400 dark:text-slate-500 mr-2" size={18} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="bg-transparent text-sm text-slate-700 dark:text-slate-200 outline-none w-48 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Category Select */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none transition-colors group-hover:text-emerald-500">
              <IoLayersOutline size={16} />
            </div>
            <select
              defaultValue=""
              className="appearance-none bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 rounded-2xl pl-10 pr-8 py-2.5 text-xs font-black uppercase tracking-tight outline-none hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 transition-all cursor-pointer"
            >
              <option value="" disabled className="dark:bg-slate-900">Catégories</option>
              {Category.map((cat, i) => (
                <option key={i} value={cat.name} className="dark:bg-slate-900">{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Filter Select */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none group-hover:text-emerald-500">
              <IoFilterOutline size={16} />
            </div>
            <select
              defaultValue=""
              className="appearance-none bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 rounded-2xl pl-10 pr-8 py-2.5 text-xs font-black uppercase tracking-tight outline-none hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 transition-all cursor-pointer"
            >
              <option value="" disabled className="dark:bg-slate-900">Trier par</option>
              <option value="quantite" className="dark:bg-slate-900">Quantité</option>
              <option value="prix" className="dark:bg-slate-900">Prix</option>
              <option value="date" className="dark:bg-slate-900">Date</option>
            </select>
          </div>
        </div>

        {/* RIGHT: Add Button */}
        {role === 'admin' && (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-[#19b393] dark:text-[#19b393] border border-emerald-300 dark:border-emerald-800/50 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm"
          >
            <IoAddOutline size={20} className="text-[#19b393] dark:text-[#19b393]" />
            Ajouter Produit
          </button>
        )}
      </div>

      {/* --- FORM DIALOG --- */}
      {/* Passing a dynamic hex for dark mode if your Dialog component supports it, 
          otherwise, usually Dialogs use internal dark:bg-slate-900 classes */}
      <Dialog 
        bgcolor={document.documentElement.classList.contains('dark') ? "#0f172a" : "#ffffff"}
        width="550px" 
        isOpen={open} 
        onClose={() => setOpen(false)} 
        title="Nouveau Produit"
      >
        <AddProductForm close={() => setOpen(false)} />
      </Dialog>

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <ProdTable />
      </div>
    </div>
  );
}