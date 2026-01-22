import { 
  IoCartOutline, 
  IoCalendarOutline, 
  IoCloseCircleOutline,
  IoReceiptOutline,
  IoCloudDownloadOutline,
  IoPersonOutline, 
  IoShieldCheckmarkOutline 
} from "react-icons/io5";
import { FaUserTie, FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { MdOutlineNumbers } from "react-icons/md";
import { useRef } from "react";
import FacturePrint from "../Facture/FacturePrintachat";
import { useSelector } from "react-redux";
import { generateFacturePDF } from "./facure";

function DailloginfoFacture({ open, data, onClose }) {
  const printRef = useRef();
  const { user } = useSelector(state => state.LoginAdmin);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-hidden">
      {/* Overlay fate7 b glass effect */}
      <div 
        className="absolute inset-0 bg-slate-400/20 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      />

      <div 
        className="relative bg-white text-slate-800 p-8 rounded-[3rem] border border-slate-100 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.1)] max-w-2xl w-full max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in duration-300"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{` div::-webkit-scrollbar { display: none; } `}</style>
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
              <IoReceiptOutline size={30} />
            </div>
            <div>
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Détails Facture</h2>
              <p className="text-3xl font-black text-slate-800 tracking-tighter leading-none mt-1 uppercase">
                #{String(data?._id).slice(-8)}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-300 hover:text-rose-500 transition-all hover:scale-110 active:rotate-90 duration-300"
          >
            <IoCloseCircleOutline size={42} />
          </button>
        </div>

        {/* Action & Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-3">
            {/* Date Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
              <IoCalendarOutline className="text-indigo-500" />
              <span className="text-xs font-black text-slate-600">
                {new Date(data?.DateFacture).toLocaleDateString('fr-FR')}
              </span>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
              {data?.nameEmp ? (
                <>
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <IoPersonOutline size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-black uppercase leading-none">Vendeur</span>
                    <span className="text-xs text-slate-700 font-black">{data.nameEmp}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                    <FaUserTie size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-amber-600 font-black uppercase leading-none">Admin</span>
                    <span className="text-xs text-slate-700 font-black">{user?.name || 'Admin'}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 hover:border-indigo-600/30 text-slate-600 text-xs font-black uppercase tracking-widest transition-all active:scale-95 group shadow-sm"
              onClick={() => generateFacturePDF(data)}
            >
              <IoCloudDownloadOutline size={18} className="group-hover:text-indigo-600 transition-colors" />
              PDF
            </button>
            
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all active:scale-95 group"
            >
              <FaPrint size={16} className="group-hover:animate-bounce" />
              Imprimer
            </button>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden mb-8 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Désignation</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 text-center tracking-widest">P.U</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 text-center tracking-widest">Qté</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 text-right tracking-widest">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data?.Product?.map((prod, index) => (
                <tr key={index} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-4 text-sm font-black text-slate-700 group-hover:text-indigo-600 transition-colors">{prod.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-400 text-center font-mono italic">{Number(prod.price).toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-black border border-slate-200">
                      {prod.quantite}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-slate-800 text-right font-mono">
                    {Number(prod.TotalPrix).toFixed(2)} <span className="text-[10px] opacity-40 font-sans">DH</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-7 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col justify-center space-y-4 shadow-inner">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-slate-100 text-indigo-600 shadow-sm"><MdOutlineNumbers size={20} /></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Articles</span>
              </div>
              <b className="text-slate-800 text-xl font-black tracking-tight">{data?.TotalQauntite}</b>
            </div>
            
            <div className="flex items-center justify-between px-2 pt-2 border-t border-slate-200/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-slate-100 text-indigo-600 shadow-sm"><IoCartOutline size={20} /></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Brut</span>
              </div>
              <b className="text-slate-800 text-xl font-black tracking-tight">{data?.totalOrder}</b>
            </div>
          </div>

          <div className="bg-white p-7 rounded-[2.5rem] border border-emerald-100 flex flex-col items-center shadow-xl shadow-emerald-50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 blur-3xl rounded-full"></div>
            
            <div className="w-full flex justify-between items-center mb-5 px-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retour Client</p>
              <p className="text-sm font-black text-rose-500 font-mono italic">-{data?.PrixReture} DH</p>
            </div>
            
            <div className="pt-5 border-t border-slate-100 w-full text-center">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-2 group-hover:scale-110 transition-transform duration-500">Net à Payer</p>
              <p className="text-5xl font-black text-slate-900 tracking-tighter">
                {data?.TotalPrix} <span className="text-xl font-bold text-emerald-500/80 font-sans">DH</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden">
        <FacturePrint ref={printRef} facture={data} user={user} />
      </div>
    </div>
  );
}

export default DailloginfoFacture;