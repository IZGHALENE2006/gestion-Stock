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
      <div className="mt-7 p-4 px-6 bg-white border border-slate-100 rounded-[2rem] flex flex-wrap justify-between items-center gap-4 shadow-sm">
        
        {/* LEFT: Search & Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Search Input Group */}
          <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <IoSearchOutline className="text-slate-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="bg-transparent text-sm text-slate-700 outline-none w-48 font-medium placeholder:text-slate-400"
            />
          </div>

          {/* Category Select */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-hover:text-indigo-500">
              <IoLayersOutline size={16} />
            </div>
            <select
              defaultValue=""
              className="appearance-none bg-slate-50 text-slate-600 border border-slate-100 rounded-2xl pl-10 pr-8 py-2.5 text-xs font-black uppercase tracking-tight outline-none hover:bg-white hover:border-indigo-200 transition-all cursor-pointer"
            >
              <option value="" disabled>Catégories</option>
              {Category.map((cat, i) => (
                <option key={i} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Filter Select */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-emerald-500">
              <IoFilterOutline size={16} />
            </div>
            <select
              defaultValue=""
              className="appearance-none bg-slate-50 text-slate-600 border border-slate-100 rounded-2xl pl-10 pr-8 py-2.5 text-xs font-black uppercase tracking-tight outline-none hover:bg-white hover:border-emerald-200 transition-all cursor-pointer"
            >
              <option value="" disabled>Trier par</option>
              <option value="quantite">Quantité</option>
              <option value="prix">Prix</option>
              <option value="date">Date</option>
            </select>
          </div>

        </div>

        {/* RIGHT: Add Button */}
     {role === 'admin' && (
  <button
    onClick={() => setOpen(true)}
    className="flex items-center gap-2 px-6 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm"
  >
    <IoAddOutline size={20} className="text-indigo-600" />
    Ajouter Produit
  </button>
)}
      </div>

      {/* --- FORM DIALOG --- */}
      <Dialog 
        bgcolor={"#FFFFFF"} 
        width="550px" 
        isOpen={open} 
        onClose={() => setOpen(false)} 
        title="Nouveau Produit"
      >
        <AddProductForm close={() => setOpen(false)} />
      </Dialog>

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <ProdTable />
      </div>
    </div>
  );
}