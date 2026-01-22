import { IoSearchOutline, IoCartOutline, IoCameraOutline, IoClose } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import gsap from "gsap";
import { useDispatch, useSelector } from "react-redux";
import { getMe, addVentes } from "../../slices/SliceLoginAdmin";
import { GetAllProduct } from "../../slices/SliceProduct";
import LiveClock from "./DateTime";
import ProductCard from "./ProductCard";
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

  const cashValues = [
    { label: "20 DH", value: 20, img: "/20dh.png", color: "#661a99" },
    { label: "50 DH", value: 50, img: "/50dh.png", color: "#128512" },
    { label: "100 DH", value: 100, img: "/100dh.png", color: "#994d1a" },
    { label: "200 DH", value: 200, img: "/200dh.png", color: "#1a8099" },
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
    gsap.fromTo(".amount-display", { scale: 1.2, color: color }, { scale: 1, color: "#2563eb", duration: 0.5 });
  };

  return (
    <div ref={sectionRef} className="flex-1 bg-white rounded-[2.5rem] border border-[#e2e8f0] shadow-sm flex flex-col overflow-hidden">
      
      {/* HEADER: Light style */}
      <div className="p-6 border-b border-[#e2e8f0] bg-[#f8fafc] flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-tight">
            Caissier: <span className="text-blue-600">{user?.name || "User"}</span>
          </h2>
          <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest mt-1">
            {user?.role} • <LiveClock />
          </p>
        </div>
        <div className="p-3 bg-white rounded-2xl border border-[#e2e8f0] text-blue-600 shadow-sm relative">
          <IoCartOutline size={24} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-rose-500 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full text-white">
              {cart.length}
            </span>
          )}
        </div>
      </div>

      {/* SEARCH & SCANNER */}
      <div className="p-4 flex gap-3 bg-white">
        <div className="relative flex-1">
          <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]" />
          <input 
            type="text" 
            placeholder="Scanner ou rechercher un produit..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-400 transition-all text-sm font-bold text-[#334155]" 
          />
        </div>
        <button onClick={startScan} className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
          <IoCameraOutline size={24} />
        </button>
      </div>

      {/* PRODUCTS AREA */}
   {/* PRODUCTS AREA - Styled as a Clean List */}
<div className="flex-1 p-4 overflow-y-auto min-h-[400px] bg-[#f8fafc]/50">
  <div className="flex flex-col gap-2"> {/* Container List */}
    
    {searchTerm.length > 0 ? (
      /* SEARCH RESULTS LIST */
      filteredProducts?.map((product) => (
        <div 
          key={product._id} 
          onClick={() => { onAddToCart(product); setSearchTerm(""); }}
          className="flex justify-between items-center p-4 bg-white hover:bg-blue-50 rounded-2xl border border-[#e2e8f0] cursor-pointer transition-all group shadow-sm hover:border-blue-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
              {product.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="font-black text-[#0f172a] text-sm uppercase tracking-tight">{product.name}</span>
              <span className="text-[10px] font-bold text-[#64748b] uppercase">Stock: {product.quantite} Unités</span>
            </div>
          </div>
          <div className="text-right">
            <span className="block font-black text-blue-600 text-md">{product.prix_vente} DH</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Prix Unitaire</span>
          </div>
        </div>
      ))
    ) : (
      /* ALL PRODUCTS LIST (instead of Grid) */
      Produts?.map((item) => (
        <div 
          key={item._id} 
          onClick={() => onAddToCart(item)}
          className="flex justify-between items-center p-4 bg-white hover:bg-blue-50 rounded-2xl border border-[#e2e8f0] cursor-pointer transition-all group shadow-sm hover:border-blue-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-blue-100">
              {item.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="font-black text-[#0f172a] text-sm uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                {item.name}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${item.quantite > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {item.quantite > 0 ? 'EN STOCK' : 'OUT'}
                </span>
                <span className="text-[10px] font-bold text-slate-400">| Qty: {item.quantite}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="font-black text-[#0f172a] text-md">{item.prix_vente} DH</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">TTC</p>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
               <IoCartOutline size={18} />
            </div>
          </div>
        </div>
      ))
    )}

    {/* Empty State */}
    {(!Produts || Produts.length === 0) && (
      <div className="flex flex-col items-center justify-center py-20 opacity-20">
        <IoCartOutline size={60} />
        <p className="font-black uppercase tracking-widest text-xs mt-4">Aucun produit trouvé</p>
      </div>
    )}
  </div>
</div>

      {/* PAYMENT INFO */}
      <div className="p-6 bg-white border-t border-[#e2e8f0]">
        <div className="flex justify-between items-end mb-6">
          <div className="flex-1">
            <p className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em] mb-2">Espèces Reçues</p>
            <input 
              type="number" 
              value={amountPaid} 
              onChange={(e) => setAmountPaid(e.target.value)}
              className="amount-display bg-transparent text-5xl font-black text-blue-600 outline-none w-full placeholder:text-slate-100"
              placeholder="0.00"
            />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em] mb-2">Rendu</p>
            <p className={`text-3xl font-black ${changeToReturn < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
              {changeToReturn.toFixed(2)} <span className="text-sm">DH</span>
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center py-4 border-t border-dashed border-[#e2e8f0]">
          <span className="text-[#64748b] font-black text-xs uppercase tracking-widest">Net à Payer</span>
          <span className="text-3xl font-black text-[#0f172a]">{totalOrder.toFixed(2)} <span className="text-sm">DH</span></span>
        </div>
      </div>

      {/* QUICK CASH */}
{/* QUICK CASH - Clean Money Images */}
<div className="p-4 grid grid-cols-4 gap-3 bg-[#f8fafc] border-t border-[#e2e8f0]">
  {cashValues.map((cash) => (
    <button
      key={cash.value}
      onClick={(e) => handleQuickPay(cash.value, e.currentTarget, cash.color)}
      className="relative h-20 rounded-2xl border-2 border-[#e2e8f0] bg-white overflow-hidden group transition-all hover:border-blue-500 hover:shadow-lg active:scale-95 shadow-sm flex flex-col items-center justify-center"
    >
      {/* L-warqa dial l-flouss - Safia o bayna */}
      <div 
        className="absolute inset-0 transition-all duration-300 opacity-90 group-hover:opacity-100 group-hover:scale-110" 
        style={{ 
          backgroundImage: `url(${cash.img})`,
          backgroundSize: 'contain', /* Kat-khalli l-warqa t-ban kamla bla ma t-qte3 */
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))' /* Shadow khfif l-warqa */
        }} 
      />
      
      {/* Label t-ban nqiya ta7t l-warqa aw wast menha */}
      <div className="relative z-10 mt-auto mb-1 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-lg">
        <span className="font-black text-white text-[10px] tracking-tighter uppercase">
          {cash.label}
        </span>
      </div>
    </button>
  ))}
</div>
      
      {/* CONFIRM BUTTON */}
      <div className="p-6 bg-white">
        <button 
          onClick={Khless} 
          className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black text-lg tracking-widest transition-all active:scale-[0.97] shadow-xl shadow-blue-100 uppercase"
        >
          Confirmer la vente
        </button>
      </div>

      {/* MODAL SCANNER */}
      {open && (
        <div className="fixed inset-0 z-[100] bg-[#0f172a]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-4 w-full max-w-md relative shadow-2xl">
            <button onClick={stopScan} className="absolute -top-12 right-0 text-white hover:rotate-90 transition-transform">
              <IoClose size={32} />
            </button>
            <div ref={scannerRef} className="w-full h-72 overflow-hidden rounded-[2rem] bg-black border-4 border-blue-600" />
            <p className="text-center mt-4 text-[#64748b] font-bold text-xs uppercase tracking-widest">Placez le code-barres devant la caméra</p>
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