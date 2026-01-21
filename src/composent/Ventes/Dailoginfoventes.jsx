import React from 'react';
import { 
  HiOutlineCube, HiOutlineCash, 
  HiOutlineTrendingUp, HiOutlineCalendar,
  HiOutlineHashtag, HiOutlineEye 
} from "react-icons/hi";
import { IoCloseCircleOutline } from "react-icons/io5";

const DailogInfoVentes = ({ vente, onClose, onViewProduct }) => {
  if (!vente) return null;

  // مكون فرعي للمعلومات باش نسهلو الكود
  const StatCard = ({ icon, label, value, subValue, colorClass }) => (
    <div className="bg-[#0f172a] border border-slate-700/50 p-4 rounded-2xl shadow-inner group hover:border-indigo-500/30 transition-all">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-xl bg-slate-800 ${colorClass}`}>
          {icon}
        </div>
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{label}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-black text-white">{value}</span>
        {subValue && <span className="text-[10px] text-slate-400 font-medium">{subValue}</span>}
      </div>
    </div>
  );

  return (
    <div className="bg-[#1e293b] text-slate-300 p-1 rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
      
 

      <div className="p-6 space-y-6">
        
        {/* صفحة المنتج الرئيسية */}
        <div className="relative group bg-gradient-to-r from-indigo-600/10 to-transparent border border-indigo-500/20 p-5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/20">
                    {vente.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white leading-none mb-1">{vente.name}</h3>
                    <p className="text-xs text-slate-400">Réf Product: {vente.idProduct || '---'}</p>
                </div>
            </div>
            
            {/* Button العين اللي قلتي عليها */}
            <button 
              onClick={() => onViewProduct(vente.idProduct)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-90 group"
            >
              <HiOutlineEye size={18} className="group-hover:animate-pulse" />
              <span>VOIR PRODUIT</span>
            </button>
        </div>

        {/* Grid ديال المعلومات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <StatCard 
              icon={<HiOutlineCash size={20}/>} 
              label="Prix de Vente" 
              value={`${vente.price?.toFixed(2)} DH`}
              subValue="Prix unitaire à la sortie"
              colorClass="text-amber-400"
            />

            <StatCard 
              icon={<HiOutlineCube size={20}/>} 
              label="Quantité Vendue" 
              value={`${vente.quantite} Unités`}
              subValue="Volume de la transaction"
              colorClass="text-blue-400"
            />

            <StatCard 
              icon={<HiOutlineTrendingUp size={20}/>} 
              label="Marge de Profit" 
              value={`${vente.profite?.toFixed(2)} DH`}
              subValue="Gain net généré"
              colorClass="text-emerald-400"
            />

            <StatCard 
              icon={<HiOutlineCalendar size={20}/>} 
              label="Date de Vente" 
              value={new Date(vente.DateVante).toLocaleDateString()}
              subValue={new Date(vente.DateVante).toLocaleTimeString()}
              colorClass="text-purple-400"
            />
        </div>

        {/* Footer فيه ملخص سريع */}
        <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center text-[11px] font-bold text-slate-500">
            <div className="flex items-center gap-2">
                <HiOutlineHashtag />
                <span>STATUS: <span className="text-emerald-500">COMPLÉTÉ</span></span>
            </div>
            <div className="italic">
                Enregistré par le système
            </div>
        </div>

      </div>
    </div>
  );
};

export default DailogInfoVentes;