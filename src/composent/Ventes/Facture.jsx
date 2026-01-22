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
    /* BG Fate7 White/Slate-50 */
    <div className="p-2 bg-gray-50 min-h-screen text-slate-900 space-y-8">
      
      {/* Header & Stats Cards Fate7in */}
      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-60 p-6 rounded-[2rem] bg-white border border-slate-200 shadow-xl shadow-slate-100 flex items-center gap-5">
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
            <FaFileInvoice size={32} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Factures</h1>
            <h1 className="text-4xl font-black text-slate-800">{Facture.length}</h1>
          </div>
        </div>

        <div className="flex-1 min-w-60 p-6 rounded-[2rem] bg-white border border-slate-200 shadow-xl shadow-slate-100 flex items-center gap-5">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
            <FaFileInvoice size={32} className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Montant</h1>
            <h1 className="text-4xl font-black text-slate-800">{totalAmount.toLocaleString()} <span className="text-lg text-emerald-600 font-medium">DH</span></h1>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col lg:flex-row gap-4 items-end justify-between bg-white p-4 rounded-3xl border border-slate-200">
        <div className="flex flex-col md:flex-row flex-1 gap-4 w-full">
          <div className="flex-1">
            <label className="block text-slate-400 mb-2 text-xs font-bold uppercase tracking-wider ml-2">Sélection Employé</label>
            <div className="relative">
              <FaRegUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer text-sm">
                <option>Tous les vendeurs</option>
                {Employe?.map((t) => <option key={t._id} value={t.name}>{t.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-slate-400 mb-2 text-xs font-bold uppercase tracking-wider ml-2">Rechercher Facture</label>
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="N° facture / client..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 placeholder-slate-400 focus:border-indigo-500 outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <FaThLarge /> Grille
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <FaListUl /> Liste
          </button>
        </div>
      </div>

      {/* Content Section */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {Facture?.map((t) => (
            <div key={t._id} className="group relative bg-white border border-slate-200 rounded-[2.5rem] p-7 shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/5 blur-3xl group-hover:bg-indigo-500/10 transition-all"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">RÉFÉRENCE</p>
                  <h2 className="text-2xl font-black text-slate-800">#{String(t._id).slice(-5)}</h2>
                </div>
                <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-500">{new Date(t.DateFacture).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-tight">Client</span>
                  <span className="text-sm text-slate-700 font-bold italic">Passager</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center gap-4">
                  {t.nameEmp ? (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black">{t.nameEmp.charAt(0)}</div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Vendeur</span>
                        <span className="text-sm text-slate-700 font-black">{t.nameEmp}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600"><FaUserTie size={20} /></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-amber-600 font-bold uppercase tracking-tighter">Admin</span>
                        <span className="text-sm text-slate-700 font-black">{user.name}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-black tracking-widest">Total Payé</span>
                  <span className="text-3xl font-black text-emerald-600 tracking-tighter">{t.TotalPrix} <span className="text-sm font-medium">DH</span></span>
                </div>
                <button onClick={() => Handleopeninfo(t)} className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95 transition-all">
                  Détails
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List Mode Fate7 */
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
          <div className="space-y-0 divide-y divide-slate-100">
            {Facture?.map((t) => (
              <div key={t._id} className="group flex items-center justify-between p-6 hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:scale-110 transition-transform border border-indigo-100">
                    <FaFileInvoice size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Facture</p>
                    <p className="font-black text-slate-800 text-lg">#{String(t._id).slice(-5)}</p>
                  </div>
                  <div className="hidden lg:block border-l border-slate-200 pl-6">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Vendeur</p>
                    <p className="text-sm text-slate-700 font-bold">{t.nameEmp || user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-10">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Montant</p>
                    <p className="text-2xl font-black text-emerald-600">{t.TotalPrix} <span className="text-xs">DH</span></p>
                  </div>
                  <button 
                    onClick={() => Handleopeninfo(t)}
                    className="px-6 py-3 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    Voir Détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {Facture.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
           <div className="p-6 bg-white rounded-full shadow-sm mb-4">
              <FaFileInvoice size={48} className="text-slate-300" />
           </div>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Aucune facture pour le moment</p>
        </div>
      )}

      {/* Matsach t-bddel bgcolor f Dailog l 'white' */}
      <DailloginfoFacture data={data} onClose={() => setOpen(false)} open={open} />

    </div>
  );
}

export default FactureVentes;