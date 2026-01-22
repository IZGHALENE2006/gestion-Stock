import { IoSearchOutline, IoCartOutline, IoCameraOutline, IoClose } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import gsap from "gsap";
import { useDispatch, useSelector } from "react-redux";
import { getMe, addVentes } from "../../slices/SliceLoginAdmin";
import { GetAllProduct } from "../../slices/SliceProduct";
import LiveClock from "./DateTime";
import { useEffect, useRef, useState } from "react";
import Quagga from "quagga";
import FacturePrint from "../Facture/FacturePrintachat";
import { useReactToPrint } from "react-to-print";

export default function CaisseSection({ cart, onAddToCart, onClearCart }) {
  const [open, setOpen] = useState(false);
  const scannerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, token } = useSelector((state) => state.LoginAdmin);
  const { Produts } = useSelector((state) => state.Product);
  const dispatch = useDispatch();
  const [amountPaid, setAmountPaid] = useState("");
  const [Facture, setFacture] = useState(null);
  const printRef = useRef();
  const sectionRef = useRef(null);
  const listRef = useRef(null);

  // --- LOGIC SCANNER ---
  const startScan = () => setOpen(true);
  const stopScan = () => { Quagga.stop(); setOpen(false); };

  useEffect(() => {
    if (!open) return;
    Quagga.init({
      inputStream: { type: "LiveStream", target: scannerRef.current, constraints: { facingMode: "user" } },
      decoder: { readers: ["ean_reader", "code_128_reader"] },
      locate: true,
    }, (err) => {
      if (err) return;
      Quagga.start();
    });
    Quagga.onDetected((result) => {
      setSearchTerm(result.codeResult.code);
      stopScan();
    });
    return () => { stopScan(); Quagga.offDetected(); };
  }, [open]);

  useEffect(() => {
    if (token && !user) dispatch(getMe());
    dispatch(GetAllProduct());
  }, [token, dispatch, user]);

  // GSAP Animation for the list
  useEffect(() => {
    if (Produts?.length > 0) {
      gsap.fromTo(
        ".product-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [Produts, searchTerm]);

  const cashValues = [
    { label: "20 DH", value: 20, img: "/20dh.png", color: "#10b981" },
    { label: "50 DH", value: 50, img: "/50dh.png", color: "#059669" },
    { label: "100 DH", value: 100, img: "/100dh.png", color: "#047857" },
    { label: "200 DH", value: 200, img: "/200dh.png", color: "#065f46" },
  ];

  const filteredProducts = Produts?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode?.includes(searchTerm)
  );

  const totalOrder = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const changeToReturn = amountPaid ? parseFloat(amountPaid) - totalOrder : 0;

  async function Khless() {
    if (cart?.length === 0) return toast.error("Le panier est vide");
    if (changeToReturn < 0) return toast.error("Montant insuffisant");
    try {
      const res = await dispatch(addVentes({ cart, totalOrder, changeToReturn })).unwrap();
      toast.success("Vente enregistrée");
      setFacture(res.facture); 
      onClearCart();
      setAmountPaid("");
    } catch (err) {
      toast.error(err?.message || "Erreur");
    }
  }

  const handlePrint = useReactToPrint({ contentRef: printRef });
  useEffect(() => { if (Facture) handlePrint(); }, [Facture]);

  const handleQuickPay = (val, target, color) => {
    setAmountPaid(val.toString());
    gsap.fromTo(".amount-display", 
      { scale: 1.1, color: color }, 
      { scale: 1, color: "#059669", duration: 0.4 }
    );
  };

  return (
    <div ref={sectionRef} className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
      
      {/* HEADER */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Caissier: <span className="text-emerald-600">{user?.name || "Admin"}</span>
          </h2>
          <div className="flex items-center gap-2 mt-1">
             <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded-md uppercase">{user?.role}</span>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"><LiveClock /></p>
          </div>
        </div>
        <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-emerald-600 shadow-sm relative">
          <IoCartOutline size={24} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-rose-500 text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full text-white border-4 border-white dark:border-slate-800">
              {cart.length}
            </span>
          )}
        </div>
      </div>

      {/* SEARCH & SCANNER */}
      <div className="p-4 flex gap-3 bg-white dark:bg-slate-900">
        <div className="relative flex-1 group">
          <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Rechercher un produit..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-bold text-slate-700 dark:text-slate-200" 
          />
        </div>
        <button onClick={startScan} className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all active:scale-95">
          <IoCameraOutline size={26} />
        </button>
      </div>

      {/* PRODUCTS AREA */}
      <div className="flex-1 p-4 overflow-y-auto min-h-87.5 bg-slate-50/50 dark:bg-slate-950/20">
        <div ref={listRef} className="flex flex-col gap-3">
          {(searchTerm.length > 0 ? filteredProducts : Produts)?.map((item) => (
            <div 
              key={item._id} 
              onClick={() => { onAddToCart(item); if(searchTerm) setSearchTerm(""); }}
              className="product-item flex justify-between items-center p-4 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer transition-all group shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-lg">
                  {item.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-slate-900 dark:text-slate-100 text-sm uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-md ${item.quantite > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {item.quantite > 0 ? 'DISPONIBLE' : 'EPUISE'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Stock: {item.quantite}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-black text-slate-900 dark:text-white text-lg">{item.prix_vente} <span className="text-[10px]">DH</span></p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Prix TTC</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-active:scale-90">
                   <IoCartOutline size={20} />
                </div>
              </div>
            </div>
          ))}

          {(!Produts || Produts.length === 0) && (
            <div className="flex flex-col items-center justify-center py-24 opacity-20 dark:text-white">
              <IoCartOutline size={80} />
              <p className="font-black uppercase tracking-[0.3em] text-[10px] mt-4">Aucun produit</p>
            </div>
          )}
        </div>
      </div>

      {/* PAYMENT INFO */}
      <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-end mb-6">
          <div className="flex-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Total Reçu</p>
            <input 
              type="number" 
              value={amountPaid} 
              onChange={(e) => setAmountPaid(e.target.value)}
              className="amount-display bg-transparent text-5xl font-black text-emerald-600 outline-none w-full placeholder:text-slate-100 dark:placeholder:text-slate-800"
              placeholder="0.00"
            />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Rendu Client</p>
            <p className={`text-3xl font-black ${changeToReturn < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
              {changeToReturn.toFixed(2)} <span className="text-sm font-bold">DH</span>
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center py-5 border-t border-dashed border-slate-200 dark:border-slate-700">
          <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Net à Payer</span>
          <span className="text-4xl font-black text-slate-900 dark:text-white">{totalOrder.toFixed(2)} <span className="text-sm">DH</span></span>
        </div>
      </div>

      {/* QUICK CASH */}
<div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 
  bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 backdrop-blur-xl">
  
  {cashValues.map((cash) => (
    <button
      key={cash.value}
      onClick={(e) => handleQuickPay(cash.value, e.currentTarget, cash.color)}
      className="group relative h-28 rounded-4xl transition-all duration-500 overflow-hidden border
        /* Light Mode */
        bg-white/50 border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-2xl hover:-translate-y-2
        /* Dark Mode */
        dark:bg-slate-900/40 dark:border-slate-800 dark:shadow-none"
    >
      {/* 1. The Image Layer - Fixed & Fitted */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-center bg-no-repeat bg-cover opacity-30 dark:opacity-30 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
          style={{ backgroundImage: `url(${cash.img})` }}
        />
        {/* Gradient Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
      </div>

      {/* 2. Floating Glow (Themed to Cash Color) */}
      <div 
        className="absolute -right-4 -bottom-4 w-24 h-24 blur-3xl rounded-full opacity-0 group-hover:opacity-60 transition-all duration-700"
        style={{ backgroundColor: cash.color }}
      />

      {/* 3. Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-1">
        {/* Value Badge */}
        <div 
          className="px-3 py-1 rounded-full text-[10px] font-black text-white mb-1 shadow-lg"
          style={{ backgroundColor: cash.color }}
        >
          {cash.value} DH
        </div>
        
        {/* Big Label */}
        <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter uppercase 
          group-hover:scale-110 transition-transform duration-500 drop-shadow-sm">
          {cash.label}
        </span>

        {/* Animated Selection Bar */}
        <div 
          className="w-0 h-1.5 rounded-full transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:w-12"
          style={{ 
            backgroundColor: cash.color,
            boxShadow: `0 0 15px ${cash.color}` 
          }}
        />
      </div>

      {/* 4. Active Selection Indicator (Corner) */}
      <div 
        className="absolute top-0 right-0 w-12 h-12 bg-linear-to-bl from-white/20 to-transparent translate-x-12 -translate-y-12 group-hover:translate-x-6 group-hover:-translate-y-6 transition-all duration-500 rotate-45"
        style={{ backgroundColor: cash.color }}
      />
    </button>
  ))}
</div>
      
      {/* CONFIRM BUTTON */}
      <div className="p-6 bg-white dark:bg-slate-900">
        <button 
          onClick={Khless} 
          className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-4xl font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-2xl shadow-emerald-500/20"
        >
          Confirmer la vente
        </button>
      </div>

      {/* SCANNER MODAL */}
      {open && (
        <div className="fixed inset-0 z-200 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-6 w-full max-w-md relative shadow-2xl border border-white/20">
            <button onClick={stopScan} className="absolute -top-14 right-0 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all">
              <IoClose size={28} />
            </button>
            <div ref={scannerRef} className="w-full h-80 overflow-hidden rounded-[2.5rem] bg-black border-4 border-emerald-500 shadow-2xl shadow-emerald-500/20" />
            <div className="text-center mt-6">
               <p className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest">Scanner en cours...</p>
               <p className="text-slate-400 font-bold text-[9px] mt-2 uppercase">Veuillez centrer le code-barres</p>
            </div>
          </div>
        </div>
      )}

      <Toaster position="bottom-right" />
      <div style={{ display: "none" }}>
        <FacturePrint ref={printRef} facture={Facture} user={user} />
      </div>
    </div>
  );
}