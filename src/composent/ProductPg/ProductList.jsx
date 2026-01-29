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
  
  // States for filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [sortBy, setSortBy] = useState("");

  const { Category } = useSelector((state) => state.category);
  const { Produts } = useSelector((state) => state.Product);
  const { role } = useSelector(state => state.LoginAdmin);

  useEffect(() => {
    Dispatch(GetAllCatefory());
  }, [Dispatch]);

  // --- SEARCH BY NAME OR BARCODE + CATEGORY + SORT ---
  const filteredProducts = Produts?.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    
    // Check if name matches OR barcode matches
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchLower) || 
      product.barcode?.toString().includes(searchTerm); // Barcode is often numeric/string

    const matchesCategory = selectedCat === "" || product.categorie === selectedCat;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === "quantity") return b.quantite - a.quantite;
    if (sortBy === "Price") return b.prix_vente - a.prix_vente;
    if (sortBy === "date") return new Date(b.datecreate) - new Date(a.datecreate);
    return 0;
  });

  return (
    <div className="space-y-4">
      <div className="mt-7 p-4 px-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-4xl flex flex-wrap justify-between items-center gap-4 shadow-sm">
        
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Input */}
          <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-100 dark:focus-within:ring-emerald-900/30 transition-all">
            <IoSearchOutline className="text-slate-400 dark:text-slate-500 mr-2" size={18} />
            <input
              type="text"
              placeholder="Nom Or Bar-CODE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-sm text-slate-700 dark:text-slate-200 outline-none w-48 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Category Select */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none transition-colors group-hover:text-emerald-500">
              <IoLayersOutline size={16} />
            </div>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="appearance-none bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 rounded-2xl pl-10 pr-8 py-2.5 text-xs font-black uppercase tracking-tight outline-none hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 transition-all cursor-pointer"
            >
              <option value="">All Catégories</option>
              {Category.map((cat, i) => (
                <option key={i} value={cat.name} className="dark:bg-slate-900">{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Sort Select */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none group-hover:text-emerald-500">
              <IoFilterOutline size={16} />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 rounded-2xl pl-10 pr-8 py-2.5 text-xs font-black uppercase tracking-tight outline-none hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 transition-all cursor-pointer"
            >
              <option value="">Filter By</option>
              <option value="quantity">Quantity</option>
              <option value="Price">Price</option>
              <option value="date">Date</option>
            </select>
          </div>
        </div>

        {role === 'admin' && (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-[#19b393] border border-emerald-300 dark:border-emerald-800/50 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm"
          >
            <IoAddOutline size={20} />
            Add Product
          </button>
        )}
      </div>

      <Dialog 
        bgcolor={document.documentElement.classList.contains('dark') ? "#0f172a" : "#ffffff"}
        width="550px" 
        isOpen={open} 
        onClose={() => setOpen(false)} 
        title="New  Produit"
      >
        <AddProductForm close={() => setOpen(false)} />
      </Dialog>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Pass filtered list to table */}
        <ProdTable products={filteredProducts} />
      </div>
    </div>
  );
}