import { 
  IoCartOutline, 
  IoCalendarOutline, 
  IoCloseCircleOutline,
  IoReceiptOutline,
  IoCloudDownloadOutline
} from "react-icons/io5";
import { FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { MdOutlineNumbers } from "react-icons/md";
import { useRef } from "react";
import FacturePrint from "../Facture/FacturePrintachat";
import { useSelector } from "react-redux";

function DailloginfoFacture({ open, data, onClose }) {
  const printRef = useRef();
  const { user } = useSelector(state => state.LoginAdmin);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop with enhanced blur */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={onClose} 
      />

      {/* Dialog Content */}
      <div 
        className="relative bg-[#0f172a] text-slate-200 p-8 rounded-[2.5rem] border border-slate-800 shadow-[0_0_50px_-12px_rgba(30,64,175,0.3)] max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300 shadow-2xl"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner">
              <IoReceiptOutline size={30} />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Détails Document</h2>
              <p className="text-2xl font-black text-white tracking-tight leading-none mt-1 italic">
                #{String(data?._id).slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-red-400 transition-all hover:scale-110 active:rotate-90 duration-300"
          >
            <IoCloseCircleOutline size={38} />
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/40 rounded-2xl border border-slate-700/50 shadow-sm">
            <IoCalendarOutline className="text-blue-400" />
            <span className="text-sm font-bold text-slate-300 uppercase tracking-tighter">
              {new Date(data?.DateFacture).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 hover:border-blue-500/50 text-slate-300 text-sm font-bold transition-all active:scale-95 group">
              <IoCloudDownloadOutline size={20} className="group-hover:text-blue-400" />
              <span className="hidden sm:block">PDF</span>
            </button>
            
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-black shadow-lg shadow-blue-600/30 transition-all active:scale-95 group"
            >
              <FaPrint size={18} className="group-hover:animate-bounce" />
              Imprimer
            </button>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-[#1e293b]/30 rounded-[2rem] border border-slate-800 overflow-hidden mb-8 shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Désignation</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 text-center tracking-widest">P.U</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 text-center tracking-widest">Qté</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 text-right tracking-widest">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {data?.Product?.map((prod, index) => (
                <tr key={index} className="hover:bg-blue-500/[0.03] transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{prod.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-400 text-center font-mono italic">{Number(prod.price).toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-xs font-black border border-slate-700 group-hover:border-blue-500/30 transition-all">
                      {prod.quantite}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-blue-400 text-right font-mono">
                    {Number(prod.TotalPrix).toFixed(2)} <span className="text-[10px] opacity-50">DH</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-[2rem] bg-slate-800/20 border border-slate-800 flex flex-col justify-center space-y-4 shadow-inner">
            <div className="flex items-center gap-3 text-slate-400 hover:text-slate-200 transition-colors">
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-blue-400 shadow-sm"><MdOutlineNumbers size={18} /></div>
              <span className="text-sm font-medium">Articles Totaux: <b className="text-white ml-1 text-lg">{data?.TotalQauntite}</b></span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 hover:text-slate-200 transition-colors">
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-blue-400 shadow-sm"><IoCartOutline size={18} /></div>
              <span className="text-sm font-medium">Lignes de commande: <b className="text-white ml-1 text-lg">{data?.totalOrder}</b></span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 via-[#0f172a] to-emerald-600/10 p-7 rounded-[2rem] border border-blue-500/20 flex flex-col items-center shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 blur-2xl rounded-full"></div>
            
            <div className="w-full flex justify-between items-center mb-4 px-2">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Retour</p>
              <p className="text-sm font-bold text-red-400/80 font-mono italic">-{data?.PrixReture} DH</p>
            </div>
            
            <div className="pt-4 border-t border-slate-700/50 w-full text-center group">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-1 group-hover:scale-110 transition-transform">Total Net à Payer</p>
              <p className="text-5xl font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                {data?.TotalPrix} <span className="text-xl font-medium opacity-60 font-sans">DH</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      </div>

      {/* Hidden Print Section */}
      <div className="hidden">
        <FacturePrint ref={printRef} facture={data} user={user} />
      </div>
    </div>
  );
}

export default DailloginfoFacture;