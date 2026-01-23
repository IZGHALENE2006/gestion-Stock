import { 
  FaFileInvoice, 
  FaSearch, 
  FaUserTie, 
  FaThLarge, 
  FaListUl,
  FaRegUserCircle 
} from "react-icons/fa";
import { useSelector } from "react-redux";
import DailloginfoFacture from "./DailoginfoFacture"; // Corrected naming
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
  const FacturesToday = (AllFacture || []).filter((t) => new Date(t.DateFacture).toLocaleDateString() === Daye);
  
  const totalAmount = FacturesToday.reduce((acc, curr) => acc + (curr.TotalPrix || 0), 0);

  function Handleopeninfo(item) {
    setData(item);
    setOpen(true);
  }

  return (
    <div className="p-4 bg-slate-50 dark:bg-[#1e293b] min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  
  {/* Card 1: Total Factures (Red Theme) */}
  <div className={`relative overflow-hidden group
      flex-1 min-w-60 p-6 rounded-[2.5rem] transition-all duration-500 border flex items-center gap-5
      hover:shadow-xl hover:-translate-y-2 
      /* Light Mode */
      bg-linear-to-br from-orange-400 to-orange-600 shadow-lg border-gray-300
      /* Dark Mode */
      dark:bg-none dark:bg-slate-900/40 dark:border-slate-700 dark:shadow-none
    `}>
    
    {/* Icon Container */}
    <div className={`p-4 rounded-[1.8rem] 
      /* Light: White overlay */
      bg-white/20 text-white border border-white/30
      /* Dark: Themed tint */
      dark:bg-slate-800 dark:text-orange-400 dark:border-slate-700
      backdrop-blur-md shadow-sm transition-transform group-hover:scale-110`}>
      <FaFileInvoice size={30} />
    </div>

    {/* Animated Glow (Dark Mode Only) */}
    <div className={`duration-700 absolute -right-12 -top-12 w-32 h-32 bg-linear-to-br from-orange-600 to-transparent 
        opacity-20 dark:opacity-[0.85] blur-3xl rounded-full group-hover:-right-1 group-hover:-top-1`} />
      
    {/* Text Content */}
    <div className="relative z-10">
      <p className="text-[10px] font-black uppercase tracking-widest mb-1 
        text-white/80 dark:text-slate-500">
        Total Factures
      </p>
      <h2 className="text-3xl font-black tracking-tight 
        text-white dark:text-slate-100">
        {FacturesToday.length}
      </h2>
    </div>
  </div>

  {/* Card 2: Chiffre d'Affaire (Indigo Theme) */}
  <div className={`relative overflow-hidden group
      flex-1 min-w-60 p-6 rounded-[2.5rem] transition-all duration-500 border flex items-center gap-5
       hover:shadow-xl hover:-translate-y-2 
      /* Light Mode */
      bg-linear-to-br from-indigo-600 to-indigo-800 shadow-lg border-gray-300
      /* Dark Mode */
      dark:bg-none dark:bg-slate-900/40 dark:border-slate-700 dark:shadow-none
    `}>
    
    {/* Icon Container */}
    <div className={`p-4 rounded-[1.8rem] 
      /* Light: White overlay */
      bg-white/20 text-white border border-white/30
      /* Dark: Themed tint */
      dark:bg-slate-800 dark:text-indigo-400 dark:border-slate-700
      backdrop-blur-md shadow-sm transition-transform group-hover:scale-110`}>
      <FaFileInvoice size={30} />
    </div>

    {/* Animated Glow (Dark Mode Only) */}
    <div className={`duration-700 absolute -right-12 -top-12 w-32 h-32 bg-linear-to-br from-indigo-600 to-transparent 
        opacity-20 dark:opacity-[0.85] blur-3xl rounded-full group-hover:-right-1 group-hover:-top-1`} />
      
    {/* Text Content */}
    <div className="relative z-10">
      <p className="text-[10px] font-black uppercase tracking-widest mb-1 
        text-white/80 dark:text-slate-500">
        Total Montant
      </p>
      <h2 className="text-3xl font-black tracking-tight 
        text-white dark:text-slate-100">
        {totalAmount.toLocaleString()} <span className="text-sm opacity-70">DH</span>
      </h2>
    </div>
  </div>

</div>

      
        <div className="flex flex-col lg:flex-row gap-5 items-center justify-between bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row flex-1 gap-5 w-full">
            <div className="relative flex-1">
              <FaRegUserCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" />
              <select className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 outline-none appearance-none cursor-pointer">
                <option>Tous les vendeurs</option>
                {Employe?.map((t) => <option key={t._id} value={t.name}>{t.name}</option>)}
              </select>
            </div>

            <div className="relative flex-1">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="RECHERCHER UNE FACTURE..."
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[11px] font-black tracking-widest text-slate-700 dark:text-slate-200 placeholder:opacity-40 outline-none"
              />
            </div>
          </div>

          <div className="flex bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <button 
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm border border-slate-100 dark:border-slate-700' : 'text-slate-400'}`}
            >
              <FaThLarge /> Grille
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm border border-slate-100 dark:border-slate-700' : 'text-slate-400'}`}
            >
              <FaListUl /> Liste
            </button>
          </div>
        </div>

        {/* Content Section */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {FacturesToday?.map((t) => (
              <div key={t._id} className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-8 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
                
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-1">RÉFÉRENCE</p>
                    <h2 className="text-2xl font-black  dark:text-white">#{String(t._id).slice(-5).toUpperCase()}</h2>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase">{new Date(t.DateFacture).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Client</span>
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-black italic">Client Passager</span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                    {t.nameEmp ? (
                      <>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">{t.nameEmp.charAt(0)}</div>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Vendeur</span>
                          <span className="text-xs text-slate-700 dark:text-slate-200 font-black">{t.nameEmp}</span>
                        </div>
                      </>
                    ) : (
                      <>
                    <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-900/20 text-amber-500 border border-amber-500/20 flex items-center justify-center shadow-sm">
          <FaUserTie size={18} />
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] text-amber-500 font-black uppercase tracking-widest leading-none mb-1">Administrateur</span>
          <span className="text-xs text-slate-900 dark:text-white font-black">{user.name}</span>
        </div>
      </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Net à Payer</span>
                    <span className="text-3xl font-black text-emerald-600 dark:text-emerald-500 tracking-tighter">{t.TotalPrix} <span className="text-sm font-bold opacity-60">DH</span></span>
                  </div>
                  <button onClick={() => Handleopeninfo(t)} className="px-6 py-4 rounded-2xl bg-slate-900 dark:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-600 dark:hover:bg-emerald-500 shadow-xl shadow-slate-200 dark:shadow-none transition-all active:scale-95">
                    Détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List Mode */
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {FacturesToday?.map((t) => (
                <div key={t._id} className="group flex items-center justify-between p-8 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                  <div className="flex items-center gap-8">
                    <div className="p-4 bg-emerald-500 text-white rounded-2xl group-hover:rotate-6 transition-transform shadow-lg shadow-emerald-500/20">
                      <FaFileInvoice size={22} />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] leading-none mb-2">Facture No.</p>
                      <p className="font-black text-slate-900 dark:text-white text-xl tracking-tight">#{String(t._id).slice(-5).toUpperCase()}</p>
                    </div>
                    <div className="hidden lg:block border-l border-slate-100 dark:border-slate-800 pl-8">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] leading-none mb-2">Responsable</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-black uppercase tracking-tighter">{t.nameEmp || user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] leading-none mb-2">Montant TTC</p>
                      <p className="text-3xl font-black text-emerald-600 dark:text-emerald-500 tracking-tighter">{t.TotalPrix} <span className="text-xs opacity-50">DH</span></p>
                    </div>
                    <button 
                      onClick={() => Handleopeninfo(t)}
                      className="px-8 py-4 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-300 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95"
                    >
                      Consulter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {FacturesToday.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
            <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-full mb-6">
              <FaFileInvoice size={60} className="text-slate-200 dark:text-slate-700" />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Aucun mouvement de caisse aujourd'hui</p>
          </div>
        )}

        {/* Modal */}
        <DailloginfoFacture data={data} onClose={() => setOpen(false)} open={open} />
      </div>
    </div>
  );
}

export default FactureVentes;