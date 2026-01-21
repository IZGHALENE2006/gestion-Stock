import { 
  FaFileInvoice, 
  FaSearch, 
  FaUserTie, 
  FaThLarge, 
  FaListUl,
  FaRegUserCircle 
} from "react-icons/fa";
import { useSelector } from "react-redux";
import DailloginfoFacture from "./DailoginfoFacture";
import { useState } from "react";


function FactureVentes() {
  const { user, role } = useSelector(state => state.LoginAdmin);
  const { Employe } = useSelector(state => state.Employe);
  
  const [viewMode, setViewMode] = useState('grid');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});

  let AllFacture = [];
  if (role === "admin") {
    const AdminFacture = user?.Facture || [];
    const EmployeFacture = Employe?.flatMap(e => e.Facture || []) || [];
    AllFacture = [...AdminFacture, ...EmployeFacture];
  } else {
    AllFacture = user?.Facture || [];
  }

  const Daye = new Date().toLocaleDateString();
  const Facture = (AllFacture || []).filter((t) => new Date(t.DateFacture).toLocaleDateString() === Daye);
  
  const totalAmount = Facture.reduce((acc, curr) => acc + (curr.TotalPrix || 0), 0);

  function Handleopeninfo(item) {
    setOpen(true);
    setData(item);
  }

  return (
    <div className="p-6 bg-[#0f172a] min-h-screen text-white space-y-6">

      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-60 p-5 rounded-2xl bg-[#1e293b] border border-slate-700 shadow-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/20">
            <FaFileInvoice size={32} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-slate-400 text-sm font-medium">Total Factures</h1>
            <h1 className="text-3xl font-bold text-indigo-400">{Facture.length}</h1>
          </div>
        </div>

        <div className="flex-1 min-w-60 p-5 rounded-2xl bg-[#1e293b] border border-slate-700 shadow-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/20">
            <FaFileInvoice size={32} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-slate-400 text-sm font-medium">Total Montant</h1>
            <h1 className="text-3xl font-bold text-emerald-400">{totalAmount} <span className="text-lg">DH</span></h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-end justify-between">
        <div className="flex flex-1 gap-4 w-full">
          <div className="flex-1">
            <label className="block text-slate-400 mb-1 text-xs font-bold uppercase tracking-wider">Sélection Employé</label>
            <div className="relative">
              <FaRegUserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <select className="w-full pl-10 p-2.5 rounded-xl bg-[#1e293b] border border-slate-700 text-white focus:border-indigo-500 outline-none transition-all">
                <option>All</option>
                {Employe.map((t) => <option key={t._id} value={t.name}>{t.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-slate-400 mb-1 text-xs font-bold uppercase tracking-wider">Search Facture</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="N° facture / client..."
                className="w-full pl-10 p-2.5 rounded-xl bg-[#1e293b] border border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex bg-[#1e293b] p-1 rounded-xl border border-slate-700 shadow-inner">
          <button 
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <FaThLarge /> Cards
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <FaListUl /> List
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Facture?.map((t) => (
            <div key={t._id} className="group relative bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-2xl hover:shadow-indigo-500/10 hover:border-blue-500/50 transition-all duration-300 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 blur-3xl group-hover:bg-indigo-500/15 transition-all"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Référence</p>
                  <h2 className="text-xl font-bold text-white tracking-tight">#{String(t._id).slice(-5)}</h2>
                </div>
                <div className="bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                  <span className="text-[11px] font-medium text-slate-400">{new Date(t.DateFacture).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 font-medium">Client</span>
                  <span className="text-sm text-slate-200 font-semibold">Passager</span>
                </div>
                <div className="p-3 bg-slate-800/30 rounded-2xl border border-slate-700/30 flex items-center gap-3">
                  {t.nameEmp ? (
                    <>
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400"><FaRegUserCircle size={20} /></div>
                      <div className="flex flex-col"><span className="text-[10px] text-slate-500 leading-none mb-1">Vendeur</span><span className="text-sm text-slate-300 font-medium">{t.nameEmp}</span></div>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400"><FaUserTie size={18} /></div>
                      <div className="flex flex-col"><span className="text-[10px] text-amber-500/70 leading-none mb-1">Administrateur</span><span className="text-sm text-slate-200 font-bold">{user.name}</span></div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-widest">Total à payer</span>
                  <span className="text-2xl font-black text-emerald-400 tracking-tighter">{t.TotalPrix} <span className="text-sm font-normal text-emerald-500/70">DH</span></span>
                </div>
                <button onClick={() => Handleopeninfo(t)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                  Détails
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {Facture?.map((t) => (
            <div key={t._id} className="group flex flex-wrap md:flex-nowrap items-center justify-between bg-[#1e293b]/40 border border-slate-800 p-4 rounded-2xl hover:bg-[#1e293b]/60 hover:border-indigo-500/40 transition-all duration-300">
              <div className="flex items-center gap-6 flex-1">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                  <FaFileInvoice size={20} />
                </div>
                <div className="min-w-[120px]">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Référence</p>
                  <p className="font-bold text-white">#{String(t._id).slice(-5)}</p>
                </div>
                <div className="hidden lg:block min-w-[140px]">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Vendeur</p>
                  <p className="text-sm text-slate-300 font-medium">{t.nameEmp || user.name}</p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Date</p>
                  <p className="text-sm text-slate-300">{new Date(t.DateFacture).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              <div className="flex items-center gap-8 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Montant</p>
                  <p className="text-xl font-black text-emerald-400">{t.TotalPrix} <span className="text-xs">DH</span></p>
                </div>
                <button 
                  onClick={() => Handleopeninfo(t)}
                  className="px-6 py-2 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 hover:bg-indigo-600 hover:text-white font-bold text-sm transition-all active:scale-95"
                >
                  Détails
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {Facture.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-[#1e293b]/20 rounded-3xl border-2 border-dashed border-slate-800">
           <FaFileInvoice size={48} className="text-slate-700 mb-4" />
           <p className="text-slate-500 font-medium">Aucune facture enregistrée aujourd'hui</p>
        </div>
      )}

      <DailloginfoFacture data={data} onClose={() => setOpen(false)} open={open} />

    </div>
  );
}

export default FactureVentes;