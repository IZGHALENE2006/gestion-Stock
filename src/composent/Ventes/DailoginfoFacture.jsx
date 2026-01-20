import { 
  IoDocumentTextOutline, 
  IoCartOutline, 
  IoCalendarOutline, 
  IoCloseCircleOutline,
  IoPricetagOutline,
  IoReceiptOutline
} from "react-icons/io5";
import { MdOutlineNumbers } from "react-icons/md";

function DailloginfoFacture({ data, onClose }) {
  // ملاحظة: "data" هي الفاتورة اللي غاتوصل من المابينغ
  
  return (
    <div className="bg-[#0f172a] text-slate-200 p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl max-w-2xl mx-auto overflow-hidden relative">
      
      {/* Header: ID & Close */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
            <IoReceiptOutline size={28} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Détails de Facture</h2>
            <p className="text-xl font-black text-white tracking-tight">#{String(data?._id).slice(-8)}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-500 hover:text-red-400 transition-colors"
        >
          <IoCloseCircleOutline size={32} />
        </button>
      </div>

      {/* Date Section */}
      <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-slate-800/30 rounded-xl border border-slate-700/50 w-fit">
        <IoCalendarOutline className="text-blue-400" />
        <span className="text-sm font-medium text-slate-300">
          Date: {new Date(data?.DateFacture).toLocaleDateString('fr-FR')}
        </span>
      </div>

      {/* Table: Products */}
      <div className="bg-[#1e293b]/50 rounded-3xl border border-slate-800 overflow-hidden mb-8">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-5 py-4 text-[10px] font-black uppercase text-slate-400">Produit</th>
              <th className="px-5 py-4 text-[10px] font-black uppercase text-slate-400 text-center">Prix</th>
              <th className="px-5 py-4 text-[10px] font-black uppercase text-slate-400 text-center">Qté</th>
              <th className="px-5 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {data?.produits?.map((prod, index) => (
              <tr key={index} className="hover:bg-slate-700/20 transition-colors">
                <td className="px-5 py-4 text-sm font-bold text-white">{prod.name}</td>
                <td className="px-5 py-4 text-sm text-slate-400 text-center font-mono">{prod.price} DH</td>
                <td className="px-5 py-4 text-center">
                  <span className="bg-slate-800 text-blue-400 px-2 py-1 rounded-lg text-xs font-bold">
                    x{prod.quantite}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm font-black text-blue-400 text-right">
                  {prod.TotalPrix} DH
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer: Totals Summary */}
      <div className="grid grid-cols-2 gap-4">
        {/* Statistics Grid */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-slate-400">
            <MdOutlineNumbers className="text-blue-500" />
            <span className="text-sm">Total Quantité: <b className="text-white">{data?.TotalQauntite}</b></span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <IoCartOutline className="text-blue-500" />
            <span className="text-sm">Total Commandes: <b className="text-white">{data?.totalOrder}</b></span>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-blue-600/10 p-5 rounded-[2rem] border border-blue-500/20 flex flex-col items-end">
          <div className="text-right mb-2">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Prix Retour</p>
            <p className="text-sm font-bold text-slate-300">-{data?.PrixReture} DH</p>
          </div>
          <div className="text-right pt-2 border-t border-blue-500/20 w-full">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Total Net</p>
            <p className="text-3xl font-black text-emerald-400 tracking-tighter">
              {data?.TotalPrix} <span className="text-sm font-normal">DH</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative Background Blur */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none"></div>
    </div>
  );
}

export default DailloginfoFacture;