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
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4 overflow-hidden">
      {/* Glass Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose} 
      />

      <div 
        className="relative bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-8 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in duration-300"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{` div::-webkit-scrollbar { display: none; } `}</style>
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-10">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-3xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
              <IoReceiptOutline size={30} />
            </div>
            <div>
              <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Sales Summary</h2>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mt-1 uppercase">
                #{String(data?._id).slice(-8)}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-300 dark:text-slate-700 hover:text-rose-500 dark:hover:text-rose-400 transition-all hover:scale-110 duration-300"
          >
            <IoCloseCircleOutline size={48} />
          </button>
        </div>

        {/* Action & Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-3">
            {/* Date Badge */}
            <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <IoCalendarOutline className="text-emerald-500" size={16} />
              <span className="text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-tight">
                {new Date(data?.DateFacture).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              {data?.nameEmp ? (
                <>
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <IoPersonOutline size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] text-slate-400 dark:text-slate-500 font-black uppercase leading-none">Seller</span>
                    <span className="text-xs text-slate-700 dark:text-slate-200 font-black">{data.nameEmp}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <FaUserTie size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] text-amber-600 font-black uppercase leading-none">Super Admin</span>
                    <span className="text-xs text-slate-700 dark:text-slate-200 font-black">{user?.name || 'Admin'}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 group shadow-sm"
              onClick={() => generateFacturePDF(data)}
            >
              <IoCloudDownloadOutline size={18} className="group-hover:text-emerald-500 transition-colors" />
              PDF
            </button>
            
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 dark:shadow-emerald-900/20 transition-all active:scale-95 group"
            >
              <FaPrint size={16} className="group-hover:animate-pulse" />
              Print
            </button>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden mb-8 shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-5 text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em]">Item</th>
                <th className="px-6 py-5 text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 text-center tracking-[0.2em]">Unit Price</th>
                <th className="px-6 py-5 text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 text-center tracking-[0.2em]">Qty</th>
                <th className="px-6 py-5 text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 text-right tracking-[0.2em]">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {data?.Product?.map((prod, index) => (
                <tr key={index} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5 transition-colors group">
                  <td className="px-6 py-5 text-sm font-black text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{prod.name}</td>
                  <td className="px-6 py-5 text-sm text-slate-400 dark:text-slate-500 text-center font-bold tracking-tighter">{Number(prod.price).toFixed(2)}</td>
                  <td className="px-6 py-5 text-center">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-xl text-[10px] font-black border border-slate-200 dark:border-slate-700">
                      {prod.quantite}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-slate-900 dark:text-white text-right">
                    {Number(prod.TotalPrix).toFixed(2)} <span className="text-[10px] opacity-40 font-bold">DH</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-[3rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-center space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-emerald-600 shadow-sm"><MdOutlineNumbers size={20} /></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No. of Items</span>
              </div>
              <b className="text-slate-900 dark:text-white text-2xl font-black tracking-tight">{data?.TotalQauntite}</b>
            </div>
            
            <div className="flex items-center justify-between px-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-emerald-600 shadow-sm"><IoCartOutline size={20} /></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Total</span>
              </div>
              <b className="text-slate-900 dark:text-white text-2xl font-black tracking-tight">{data?.totalOrder} <span className="text-xs">DH</span></b>
            </div>
          </div>

          <div className="bg-emerald-50/30 dark:bg-emerald-700 p-8 rounded-[3rem] flex flex-col items-center shadow-2xl shadow-emerald-500/20 relative overflow-hidden group">
            {/* Background Decorative Circle */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="w-full flex justify-between items-center mb-6 px-3 relative z-10">
              <p className="text-[9px] font-black text-emerald-400 dark:text-emerald-200 uppercase tracking-[0.2em]">Customer Return</p>
              <p className="text-sm font-black text-blue-400">{data?.PrixReture} DH</p>
            </div>
            
            <div className="pt-6 border-t border-white/10 w-full text-center relative z-10">
              <p className="text-[10px] font-black text-emerald-400 dark:text-white/60 uppercase tracking-[0.4em] mb-3">Net Payable</p>
              <p className="text-5xl font-black text-emerald-600 dark:text-white tracking-tighter">
                {data?.TotalPrix} <span className="text-xl font-bold opacity-60">DH</span>
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
