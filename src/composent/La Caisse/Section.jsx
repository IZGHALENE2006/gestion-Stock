import { IoSearchOutline, IoCartOutline } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import gsap from "gsap";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../../slices/SliceLoginAdmin";
import { GetAllProduct } from "../../slices/SliceProduct";
import LiveClock from "./DateTime"
import ProductCard from "./ProductCard";
import { addVentes } from "../../slices/SliceLoginAdmin"; 

//import BareCode
import { useEffect, useRef, useState } from "react";
import Quagga from "quagga";
import { IoCameraOutline, IoClose } from "react-icons/io5";
import FacturePrint from "../Facture/FacturePrintachat";
import { useReactToPrint } from "react-to-print";

export default function CaisseSection({ cart, onAddToCart, onClearCart }) {

  //LogicBarecode@@@@@@@@@@@@@@@@@@@@@@@@@

    const [open, setOpen] = useState(false);
  const scannerRef = useRef(null);
const [barcode,setBarecode] = useState('')
  const startScan = () => {
    setOpen(true);
  };

  const stopScan = () => {
    Quagga.stop();
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;

 Quagga.init(
  {
    inputStream: {
      type: "LiveStream",
      target: scannerRef.current,
      constraints: {
        facingMode: "user",
      },
    },
    decoder: {
      readers: ["ean_reader", "code_128_reader"], 
    },
    locate: true,
  },
  (err) => {
    if (err) {
      console.error("Quagga init error:", err);
      return;
    }
    Quagga.start();
  }
);

    Quagga.onDetected((result) => {
      const code = result.codeResult.code;
      console.log("SCANNED:", code);
      setSearchTerm(code)
      stopScan();
    });

    return () => {
      stopScan();
      Quagga.offDetected();
    };
  }, [open]);
  //////////////////@@@@@@@@@@@@@@@@@@@@@@@@2
  const { user, token } = useSelector((state) => state.LoginAdmin);
  const { Produts, loading } = useSelector((state) => state.Product); 
  const dispatch = useDispatch();
  const [amountPaid, setAmountPaid] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 
  const sectionRef = useRef(null);

  useEffect(() => {
    if (token && !user) {
      dispatch(getMe());
    }
    dispatch(GetAllProduct());
  }, [token, dispatch, user]);

  const cashValues = [
    { label: "20 DH", value: 20, img: "/20dh.png", color: "#661a99" },
    { label: "50 DH", value: 50, img: "/50dh.png", color: "#128512" },
    { label: "100 DH", value: 100, img: "/100dh.png", color: "#994d1a" },
    { label: "200 DH", value: 200, img: "/200dh.png", color: "#1a8099" },
  ];

  const filteredProducts = Produts?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.barcode?.includes(searchTerm)
  );

  const totalOrder = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const changeToReturn = amountPaid ? parseFloat(amountPaid) - totalOrder : 0;
const [Facture,setFacture] = useState(null)
async function Khless() {
  if (cart?.length === 0) return toast.error("Le panier est vide");
  if (changeToReturn < 0) return toast.error("Montant insuffisant");

try {
  const res = await dispatch(
    addVentes({ cart, totalOrder, changeToReturn })
  ).unwrap();

  toast.success("Vente enregistrée avec succès");

  setFacture(res.facture); 
  onClearCart();
  setAmountPaid("");

} catch (err) {
  toast.error(
    typeof err === "string" ? err : err?.message || "Erreur serveur"
  );
}}
    
useEffect(() => {
  if(Facture){
    handlePrint();
  }
}, [Facture])  

  
  const handleQuickPay = (val, target, color) => {
    setAmountPaid(val.toString());
    gsap.fromTo(".amount-display", 
      { scale: 1.15, color: color }, 
      { scale: 1, color: "#2C74B3", duration: 0.5, ease: "elastic.out(1, 0.3)" }
    );

    gsap.to(target, {
      scale: 0.92,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
  };

  //Logic Print
  const printRef = useRef();

const handlePrint = useReactToPrint({
  contentRef: printRef,
});

  return (
    <div ref={sectionRef} className="ticket-section flex-1 bg-[#1e293b] rounded-2xl border border-slate-700 shadow-xl flex flex-col overflow-hidden">
      <div className="p-5 border-b border-slate-700 bg-[#2C74B3]/10 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider">
            <span className="font-semibold text-white">La Caisse De : </span>
            <span className="text-white">{user?.name || "User"}</span>
          </h2>
          <p className="text-xs text-slate-400">{user?.role?.toUpperCase()} {" "}• {new Date().toLocaleDateString()}{" "}• <LiveClock /></p>
        </div>
        <div className="relative">
          <IoCartOutline size={30} className="text-[#2C74B3]" />
          {Produts?.length > 0 && (
             <span className="absolute -top-2 -right-2 bg-rose-500 text-[10px] font-bold px-1.5 rounded-full text-white">
               {Produts.length}
             </span>
          )}
        </div>
      </div>
{/* ///////////serache */}

     <div className="p-4 flex items-center gap-3">
  
  {/* input */}
  <div className="relative flex-1">
    <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
    <input 
      type="text" 
      placeholder="Rechercher des produits..." 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full bg-[#0f172a] border border-slate-600 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-[#2C74B3] transition-all text-sm text-white" 
    />
  </div>

  {/* scanner */}
  <div className="flex items-center">
 {/* // Logic BareCode */}
      <button
        onClick={startScan}
        className="h-[48px] bg-green-600 hover:bg-green-700 text-white px-4 rounded-lg flex items-center gap-2"
      >
        <IoCameraOutline size={20} />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-[#0f172a] rounded-xl p-3 w-[360px] relative">
            
            {/* Close */}
            <button
              onClick={stopScan}
              className="absolute top-2 right-2 text-white hover:text-red-500"
            >
              <IoClose size={22} />
            </button>

            {/* Camera */}
            <div
              ref={scannerRef}
              className="w-full h-[240px] overflow-hidden rounded-lg"
            />
          </div>
        </div>
      )}
  </div>

</div>


      <div className="flex-1 p-4 space-y-2 max-h-120 min-h-75 overflow-y-scroll">
        {searchTerm.length > 0 ? (
          filteredProducts?.map((product) => (
            <div 
              key={product._id} 
              onClick={() => { onAddToCart(product); setSearchTerm(""); }}
              className="flex justify-between items-center p-3 bg-slate-800 hover:bg-[#2C74B3]/20 rounded-lg border border-slate-600 cursor-pointer transition-colors"
            >
                <div className="flex flex-col">
                 <span className="font-medium text-white">{product.name}</span>
                 <span className="text-[10px] text-slate-400">Stock: {product.quantite}</span>
                </div>
                <span className="font-bold text-[#2C74B3]">{product.prix_vente} DH</span>
            </div>
          ))
        ) : Produts?.length === 0 ? ( 
          <div className="h-full overflow-y-scroll flex flex-col items-center justify-center text-slate-500 italic opacity-50">
            <IoCartOutline size={48} className="mb-2" />
            <p>Panier vide</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
             {Produts?.map((item, index) => (
               <ProductCard 
                 key={item._id} 
                 item={item} 
                 click={() => onAddToCart(item)} 
               />
             ))}
          </div>
        )}
      </div>

      <div className="p-6 bg-[#0f172a]/80 border-t border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Espèces Reçues</p>
            <div className="flex items-center">
                <input 
                    type="number" 
                    value={amountPaid} 
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="no-spinner amount-display bg-transparent text-4xl font-black text-[#2C74B3] outline-none w-full placeholder:opacity-20"
                    placeholder="0.00"
                />
            </div>
          </div>
          <div className="text-right pl-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rendu</p>
            <p className={`text-2xl font-black transition-colors duration-300 ${changeToReturn < 0 ? 'text-rose-500' : 'text-emerald-400'}`}>
              {changeToReturn.toFixed(2)} <span className="text-sm">DH</span>
            </p>
          </div>
        </div>
        
        <div className="flex justify-between text-2xl font-black border-t border-slate-700 pt-4 text-white">
          <span className="opacity-50 text-lg uppercase tracking-tighter">Total à Payer</span>
          <span className="text-white">{totalOrder.toFixed(2)} DH</span>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-700 bg-slate-800/30">
        {cashValues.map((cash) => (
          <button
            key={cash.value}
            onClick={(e) => handleQuickPay(cash.value, e.currentTarget, cash.color)}
            className="cash-btn relative overflow-hidden h-20 rounded-xl border border-slate-700 transition-all duration-300 group bg-slate-900"
            style={{ "--hover-color": cash.color }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = cash.color}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = ""}
          >
            <div
              className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-700 ease-out scale-110 group-hover:scale-125"
              style={{ backgroundImage: `url(${cash.img})` }}
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/30 transition-colors duration-300" />
            <span className="relative z-10 text-lg font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase">
              {cash.label}
            </span>
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-70 transition-opacity bg-linear-to-b pointer-events-none" 
              style={{ backgroundImage: `linear-gradient(to top, ${cash.color}66, transparent)` }}
            />
          </button>
        ))}
      </div>
      
      <div className="p-4 pt-0">
        <button 
            onClick={() => {
              Khless()
            }} 
            className="bg-linear-to-r from-[#2C74B3] via-[#fffcf662] to-[#2C74B3] bg-size-[300%_auto] transition-all duration-1000 ease-in-out hover:bg-right w-full py-5 rounded-2xl font-black text-lg tracking-widest active:scale-[0.98] shadow-xl shadow-blue-500/20 text-white"
        >
            CONFIRMER LA VENTE
        </button>
      </div>
      <Toaster />
      <div style={{ display: "none" }}>
  <FacturePrint ref={printRef} facture={Facture} user={user} />
</div>
    </div>
  );
}