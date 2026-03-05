import { 
  IoSearchOutline, IoAddOutline, IoFilterOutline, 
  IoLayersOutline, IoCameraOutline, IoClose 
} from "react-icons/io5"; 
import Dialog from "../Dialog/Dialog";
import { useEffect, useState, useRef } from "react"; 
import AddProductForm from "./AddProductForm";
import ProdTable from "./ProdTable";
import { useDispatch, useSelector } from "react-redux";
import { GetAllCatefory } from "../../slices/SilceCategory";
import Quagga from "quagga"; 
import toast from "react-hot-toast";

export default function ProductList() {
  const Dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openScanner, setOpenScanner] = useState(false); 
  const scannerRef = useRef(null);
  
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

  // --- LOGIC SCANNER ---
  const startScan = () => setOpenScanner(true);
  const stopScan = () => {
    try { Quagga.stop(); } catch (e) { console.log("Scanner already stopped"); }
    setOpenScanner(false);
  };

  useEffect(() => {
    if (!openScanner) return;
    Quagga.init({
      inputStream: { 
        type: "LiveStream", 
        target: scannerRef.current, 
        constraints: { facingMode: "environment" } 
      },
      decoder: { readers: ["ean_reader", "code_128_reader", "code_39_reader"] },
      locate: true,
    }, (err) => {
      if (err) { toast.error("Erreur de caméra"); return; }
      Quagga.start();
    });
    Quagga.onDetected((result) => {
      setSearchTerm(result.codeResult.code); 
      stopScan();
    });
    return () => { stopScan(); Quagga.offDetected(); };
  }, [openScanner]);

  // --- RECHERCHE MULTI-CRITÈRES (NAME, BARCODE, CATEGORY) ---
  const filteredProducts = Produts?.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    
    // 1. Search by Name or Barcode
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchLower) || 
      product.barcode?.toString().includes(searchTerm);

    // 2. Search by Category (SelectedCat)
    // Note: khass t-checki smiya d-category kif-makhdma 3ndek f l-backend (categorie)
    const matchesCategory = selectedCat === "" || product.categorie.name === selectedCat;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === "quantity") return b.quantite - a.quantite;
    if (sortBy === "Price") return b.prix_vente - a.prix_vente;
    if (sortBy === "date") return new Date(b.datecreate) - new Date(a.datecreate);
    return 0;
  });

  return (
    <div className="space-y-4">
      {/* TOOLBAR */}
      <div className="mt-7 p-4 px-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-4xl flex flex-wrap justify-between items-center gap-4 shadow-sm">
        
        <div className="flex items-center gap-3 flex-wrap flex-1">
          
          {/* 1. Search Bar + Scanner */}
          <div className="flex items-center flex-1 min-w-[250px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-1 focus-within:ring-2 focus-within:ring-emerald-100 dark:focus-within:ring-emerald-900/30 transition-all">
            <IoSearchOutline className="text-slate-400 dark:text-slate-500 mr-2" size={18} />
            <input
              type="text"
              placeholder="Rechercher par Nom ou Code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-sm text-slate-700 dark:text-slate-200 outline-none flex-1 py-2 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <button 
              onClick={startScan}
              className="ml-2 p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all active:scale-90"
            >
              <IoCameraOutline size={20} />
            </button>
          </div>

          {/* 2. Category Filter (Updated) */}
          <div className="relative group min-w-[180px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none transition-colors group-hover:text-emerald-500">
              <IoLayersOutline size={16} />
            </div>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full appearance-none bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 rounded-2xl pl-10 pr-8 py-2.5 text-xs font-black uppercase tracking-tight outline-none hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 transition-all cursor-pointer"
            >
              <option value="">Toutes les Catégories</option>
              {Category?.map((cat, i) => (
                <option key={i} value={cat.name} className="dark:bg-slate-900">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Sort Filter */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none group-hover:text-emerald-500">
              <IoFilterOutline size={16} />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 rounded-2xl pl-10 pr-8 py-2.5 text-xs font-black uppercase tracking-tight outline-none hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 transition-all cursor-pointer"
            >
              <option value="">Trier par...</option>
              <option value="quantity">Quantité</option>
              <option value="Price">Prix</option>
              <option value="date">Date</option>
            </select>
          </div>
        </div>

        {/* ADD BUTTON */}
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

      {/* SCANNER MODAL UI */}
      {openScanner && (
        <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-6 w-full max-w-md relative shadow-2xl border border-white/20">
            <button onClick={stopScan} className="absolute -top-14 right-0 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all">
              <IoClose size={28} />
            </button>
            <div ref={scannerRef} className="w-full h-80 overflow-hidden rounded-[2.5rem] bg-black border-4 border-emerald-500 shadow-2xl shadow-emerald-500/20" />
            <div className="text-center mt-6 text-white uppercase tracking-widest font-black text-xs">
               Scanning...
            </div>
          </div>
        </div>
      )}

      {/* DIALOG ADD FORM */}
      <Dialog 
        bgcolor={document.documentElement.classList.contains('dark') ? "#0f172a" : "#ffffff"}
        width="550px" 
        isOpen={open} 
        onClose={() => setOpen(false)} 
        title="Nouveau Produit"
      >
        <AddProductForm close={() => setOpen(false)} />
      </Dialog>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <ProdTable products={filteredProducts} />
      </div>
    </div>
  );
}