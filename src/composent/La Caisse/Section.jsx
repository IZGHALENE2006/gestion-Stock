import React, { useState, useRef, useEffect, memo } from "react";
import { IoSearchOutline, IoCartOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import gsap from "gsap";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../../slices/SliceLoginAdmin";
import LiveClock from "./DateTime";

// Move static data outside to prevent recreation on re-render
const CASH_VALUES = [
  { label: "20 DH", value: 20, img: "/20dh.png", color: "#661a99" },
  { label: "50 DH", value: 50, img: "/50dh.png", color: "#128512" },
  { label: "100 DH", value: 100, img: "/100dh.png", color: "#994d1a" },
  { label: "200 DH", value: 200, img: "/200dh.png", color: "#1a8099" },
];

const CaisseSection = ({ cart = [] }) => {
  const { user, token } = useSelector((state) => state.LoginAdmin);
  const dispatch = useDispatch();
  const [amountPaid, setAmountPaid] = useState("");
  const sectionRef = useRef(null);

  useEffect(() => {
    if (token && !user) {
      dispatch(getMe());
    }
  }, [token, dispatch, user]);

  const totalOrder = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const changeToReturn = amountPaid ? parseFloat(amountPaid) - totalOrder : 0;

  const handleQuickPay = (val, target, color) => {
    setAmountPaid(val.toString());
    
    // Efficient GSAP animation
    gsap.fromTo(".amount-display", 
      { scale: 1.1, color: color }, 
      { scale: 1, color: "#2C74B3", duration: 0.4, ease: "back.out(2)" }
    );

    gsap.to(target, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
  };

  return (
    <div ref={sectionRef} className="ticket-section flex-1 bg-[#1e293b] rounded-2xl border border-slate-700 shadow-xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-700 bg-[#2C74B3]/10 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider">
            <span className="font-semibold text-slate-400">La Caisse De </span>
             {user?.name || "Session"}
          </h2>
          <div className="text-xs text-slate-400 flex gap-1 items-center">
            <span className="text-[#2C74B3] font-bold">{user?.role?.toUpperCase()}</span>
            <span>• {new Date().toLocaleDateString()} •</span>
            <LiveClock />
          </div>
        </div>
        <div className="relative p-2 bg-[#0f172a] rounded-full">
          <IoCartOutline size={24} className="text-[#2C74B3]" />
          {cart.length > 0 && (
             <span className="absolute -top-1 -right-1 bg-rose-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
               {cart.length}
             </span>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative group">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#2C74B3] transition-colors" />
          <input 
            type="text" 
            placeholder="Rechercher des produits (F1)..." 
            className="w-full bg-[#0f172a] border border-slate-700 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-[#2C74B3] transition-all text-sm" 
          />
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto max-h-[300px] scrollbar-hide">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 italic opacity-50 py-10">
            <IoCartOutline size={40} className="mb-2" />
            <p>Panier vide</p>
          </div>
        ) : (
          cart.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-[#0f172a]/50 rounded-lg border border-slate-800 hover:border-slate-600 transition-colors">
               <span className="font-medium text-slate-200">{item.name} <span className="text-xs text-slate-500">x{item.qty}</span></span>
               <span className="font-bold text-[#2C74B3]">{item.price * item.qty} DH</span>
            </div>
          ))
        )}
      </div>

      {/* Payment Inputs */}
      <div className="p-6 bg-[#0f172a]/80 border-t border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Espèces Reçues</p>
            <input 
                type="number" 
                value={amountPaid} 
                onChange={(e) => setAmountPaid(e.target.value)}
                className="no-spinner amount-display bg-transparent text-4xl font-black text-[#2C74B3] outline-none w-full placeholder:text-slate-800"
                placeholder="0.00"
            />
          </div>
          <div className="text-right pl-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Rendu</p>
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

      {/* Quick Cash Buttons */}
      <div className="p-4 grid grid-cols-4 gap-3 border-t border-slate-700 bg-slate-800/20">
        {CASH_VALUES.map((cash) => (
          <button
            key={cash.value}
            onClick={(e) => handleQuickPay(cash.value, e.currentTarget, cash.color)}
            className="cash-btn relative overflow-hidden h-16 rounded-xl border border-slate-700 transition-all duration-200 group bg-slate-900"
          >
            <div
              className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-500 opacity-40 group-hover:opacity-40 group-hover:scale-110"
              style={{ backgroundImage: `url(${cash.img})` }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
            <span className="relative z-10 text-sm font-black text-white drop-shadow-md uppercase">
              {cash.label}
            </span>
          </button>
        ))}
      </div>
      
      <div className="p-4 pt-0">
        <button 
            onClick={() => {
                if(totalOrder === 0) return toast.error("Le panier est vide");
                toast.success("Vente enregistrée");
                setAmountPaid("");
            }} 
            className="w-full bg-[#2C74B3] hover:bg-[#3b82f6] py-4 rounded-xl font-black text-white tracking-widest active:scale-[0.98] shadow-lg transition-all"
        >
            CONFIRMER LA VENTE
        </button>
      </div>
    </div>
  );
};

export default memo(CaisseSection);