import { 
  FaFileInvoice, 
  FaSearch, 
  FaUserTie 
} from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

function FactureVentes() {
  //Get User 
const { user, role,token,loading } = useSelector(state => state.LoginAdmin);
const { Employe } = useSelector(state => state.Employe);
let AllFacture = []
if(role=="admin"){
//Get Facture Admin
const AdminFacture = user?.Facture
//Get Employe Facture
const EmployeFacture = Employe?.flatMap(e=>e.Facture ||[])
 AllFacture = [...AdminFacture, ...EmployeFacture]
}else{
 AllFacture = user?.Facture || []
}
const Daye  = new Date().toLocaleDateString() 
const Facture = (AllFacture ||[]).filter((t)=> new Date(t.DateFacture).toLocaleDateString()===Daye)


  return (
    <div className="p-6 bg-[#0f172a] min-h-screen text-white space-y-6">

      {/* TOP CARDS */}
      <div className="flex flex-wrap gap-6">

        {/* TOTAL FACTURES */}
        <div className="flex-1 min-w-60 p-5 rounded-2xl bg-[#1e293b] border border-slate-700 shadow-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/20">
            <FaFileInvoice size={32} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-slate-400 text-sm">Total Factures</h1>
            <h1 className="text-3xl font-bold text-indigo-400">{Facture.length}</h1>
          </div>
        </div>

        {/* TOTAL MONTANT */}
        <div className="flex-1 min-w-60 p-5 rounded-2xl bg-[#1e293b] border border-slate-700 shadow-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/20">
            <FaFileInvoice size={32} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-slate-400 text-sm">Total Montant</h1>
            <h1 className="text-3xl font-bold text-emerald-400">-- DH</h1>
          </div>
        </div>

      </div>

      {/* FILTERS */}
      <div className="flex gap-4 items-end">

        {/* SELECT EMPLOYEE */}
        <div className="flex-1">
          <label className="block text-slate-400 mb-1">
            Sélection Employé
          </label>
          <div className="relative">
            <FaRegUserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select className="w-full pl-10 p-2 rounded-lg bg-[#1e293b] border border-slate-700 text-white">
              <option>All</option>
            {Employe.map((t)=>{
              return(
                <option value={t.name}>{t.name}</option>
              )
            })}
            </select>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex-1">
          <label className="block text-slate-400 mb-1">
            Search Facture
          </label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="N° facture / client..."
              className="w-full pl-10 p-2 rounded-lg bg-[#1e293b] border border-slate-700 text-white placeholder-slate-400"
            />
          </div>
        </div>

      </div>

      {/* FACTURE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* CARD */}
      {Facture?.map((t) => (
  <div 
    key={t._id} 
    className="group relative bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-2xl hover:shadow-indigo-500/10 hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
  >
    {/* Decoration: Light glow effect on hover */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 blur-3xl group-hover:bg-indigo-500/15 transition-all"></div>

    {/* Header: ID & Date */}
    <div className="flex justify-between items-start mb-6">
      <div className="space-y-1">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Référence</p>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white tracking-tight">
            #{String(t._id).slice(-5)}
          </h2>
          <button 
            onClick={() => alert(t._id)}
            className="p-1 hover:bg-slate-800 rounded-md text-slate-500 hover:text-indigo-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="Ref 8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
        <span className="text-[11px] font-medium text-slate-400">
          {new Date(t.DateFacture).toLocaleDateString('fr-FR')}
        </span>
      </div>
    </div>

    {/* Content: Client & Staff */}
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500 font-medium">Client</span>
        <span className="text-sm text-slate-200 font-semibold">Passager</span>
      </div>

      <div className="p-3 bg-slate-800/30 rounded-2xl border border-slate-700/30 flex items-center gap-3">
        {t.nameEmp ? (
          <>
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <FaRegUserCircle size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 leading-none mb-1">Vendeur</span>
              <span className="text-sm text-slate-300 font-medium">{t.nameEmp}</span>
            </div>
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
              <FaUserTie size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-amber-500/70 leading-none mb-1">Administrateur</span>
              <span className="text-sm text-slate-200 font-bold">{user.name}</span>
            </div>
          </>
        )}
      </div>
    </div>

    {/* Footer: Price & Action */}
    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
      <div>
        <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-widest">Total à payer</span>
        <span className="text-2xl font-black text-emerald-400 tracking-tighter">
          {t.TotalPrix} <span className="text-sm font-normal text-emerald-500/70">DH</span>
        </span>
      </div>

      <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500/50 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
        Détails
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
))}


        {/* DUPLICATE CARD */}
   

      </div>

    </div>
  );
}

export default FactureVentes;
