import React, { useState } from 'react';
import { 
  IoArrowBackOutline, IoWalletOutline, IoCartOutline, 
  IoCashOutline, IoCheckmarkCircleOutline, IoCalendarOutline,
  IoAddCircleOutline, IoCloseOutline, IoPricetagOutline
} from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
// import { addProductCredit } from '../redux/slices/CreditSlice'; // Smiya dyal l-action dyalk
const UserCreditDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
// ... wast l-component
const dispatch = useDispatch();
const { Produts } = useSelector((state) => state.Product); // Ga3 l-produits li f-stock

const [outrechose, setOutrechose] = useState(false);
const [Produitcridi, setProduitcridi] = useState({
  id: "",
  nom: "",
  prix: 0,
  Paiement: 0,
  quantite: 1
});

// Handlers
const handleSelectProduct = (e) => {
  const idItem = e.target.value;
  const item = Produts.find((t) => t._id === idItem);
  setProduitcridi({
    ...Produitcridi,
    id: idItem,
    nom: item?.name || "",
    prix: item?.SellingPrice || 0
  });
};

const handleConfirm = async (e) => {
  e.preventDefault();
  
  let finalData = { ...Produitcridi };
  if (outrechose) {
    finalData.id = uuidv4();
  }

  // Hna kat-dispatchi l-action dyal Redux
  // dispatch(addProductCredit({ userId: idUseradd, product: finalData }));
  
  console.log("Data sent:", finalData);
  setIsModalOpen(false);
  // Reset state
  setProduitcridi({ id: "", nom: "", prix: 0, Paiement: 0, quantite: 1 });
  setOutrechose(false);
};
  return (
    <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500 space-y-8 pb-10">
      
      {/* 1. TOP STATS (Total, Paid, Balance) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Debt</p>
          <h3 className="text-3xl font-black text-rose-500">4,500 DH</h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Paid</p>
          <h3 className="text-3xl font-black text-emerald-500">1,200 DH</h3>
        </div>

        <div className="bg-emerald-600 p-8 rounded-[2.5rem] shadow-xl shadow-emerald-600/20 text-white relative overflow-hidden">
          <IoWalletOutline className="absolute -right-4 -bottom-4 opacity-20" size={100} />
          <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest mb-2">Remaining</p>
          <h3 className="text-4xl font-black">3,300 DH</h3>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 2. PRODUCT TABLE WITH "ADD PRODUCT" BUTTON */}
        <div className="flex-[2] bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <IoCartOutline className="text-emerald-500" size={24} />
                <h3 className="font-black uppercase text-sm tracking-widest italic">Credit History</h3>
            </div>
            
            {/* BUTTON TO ADD NEW PRODUCT TO CREDIT */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-lg"
            >
              <IoAddCircleOutline size={18} /> Add Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Product Name</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Price</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Qty</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-8 py-5 font-bold text-slate-700 dark:text-slate-200 italic">Smartphone S24</td>
                  <td className="px-8 py-5 font-black text-slate-500">3,300 DH</td>
                  <td className="px-8 py-5 font-black text-slate-500">x1</td>
                  <td className="px-8 py-5 font-black text-emerald-600 text-right">3,300 DH</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. QUICK PAYMENT ACTION (Same as before) */}
        <div className="flex-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <IoCashOutline className="text-emerald-500" size={24} />
                    <h3 className="font-black uppercase text-sm tracking-widest italic">New Payment</h3>
                </div>
                <input 
                    type="number" 
                    placeholder="Amount (DH)"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-5 mb-4 outline-none text-xl font-black text-slate-700 dark:text-white focus:border-emerald-500 transition-all"
                />
                <button className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-600/20">
                    Register Payment
                </button>
            </div>
        </div>
      </div>

      {/* --- ADD PRODUCT MODAL --- */}
    {isModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
    <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black uppercase tracking-tight italic flex items-center gap-2 text-slate-800 dark:text-white">
          <IoPricetagOutline className="text-emerald-500" /> Nouveau Crédit Produit
        </h3>
        <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <IoCloseOutline size={24} className="text-slate-400" />
        </button>
      </div>

      <form onSubmit={handleConfirm} className="space-y-6">
        
        {/* SECTION: SELECT FROM STOCK */}
        <div className={`p-5 rounded-3xl border-2 transition-all ${!outrechose ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/5' : 'border-slate-100 dark:border-slate-800 opacity-50'}`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🛒</span>
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-600 dark:text-slate-300">Produit en Stock</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select 
              disabled={outrechose}
              onChange={handleSelectProduct}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none font-bold text-sm focus:border-emerald-500"
            >
              <option value="">Choisir un produit...</option>
              {Produts?.map((p) => (
                <option key={p._id} value={p._id}>{p.name} - {p.SellingPrice} DH</option>
              ))}
            </select>

            <input 
              type="number" 
              placeholder="Paiement anticipé"
              disabled={outrechose}
              value={!outrechose ? Produitcridi.Paiement : ''}
              onChange={(e) => setProduitcridi({...Produitcridi, Paiement: e.target.value})}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none font-bold text-sm focus:border-emerald-500"
            />
          </div>
        </div>

        {/* CHECKBOX: AUTRE CHOSE */}
        <label className="flex items-center gap-3 cursor-pointer group w-fit">
          <input 
            type="checkbox" 
            checked={outrechose}
            onChange={(e) => setOutrechose(e.target.checked)}
            className="w-5 h-5 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500" 
          />
          <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-emerald-500 transition-colors">Autre produit (Hors Stock)</span>
        </label>

        {/* SECTION: MANUAL INPUT (COLLAPSE) */}
        {outrechose && (
          <div className="p-5 rounded-3xl border-2 border-dashed border-emerald-500 bg-emerald-50/10 animate-in slide-in-from-top-2 duration-300">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Nom du produit"
                  onChange={(e) => setProduitcridi({...Produitcridi, nom: e.target.value})}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none font-bold text-sm"
                />
                <input 
                  type="number" 
                  placeholder="Prix"
                  onChange={(e) => setProduitcridi({...Produitcridi, prix: e.target.value})}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none font-bold text-sm"
                />
                <input 
                  type="number" 
                  placeholder="Paiement anticipé"
                  onChange={(e) => setProduitcridi({...Produitcridi, Paiement: e.target.value})}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none font-bold text-sm"
                />
                <input 
                  type="number" 
                  placeholder="Quantité"
                  defaultValue="1"
                  onChange={(e) => setProduitcridi({...Produitcridi, quantite: e.target.value})}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none font-bold text-sm"
                />
             </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex gap-3 pt-4">
          <button 
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="flex-1 py-4 border-2 border-slate-100 dark:border-slate-800 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            Annuler
          </button>
          <button 
            type="submit"
            className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <IoCheckmarkCircleOutline size={18} /> Valider le Crédit
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default UserCreditDetails;