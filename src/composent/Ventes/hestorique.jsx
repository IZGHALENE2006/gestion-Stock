import { useEffect, useState } from 'react';
import { 
  IoCalendarOutline, IoFilterOutline, IoReceiptOutline, 
  IoCartOutline, IoChevronDownOutline, IoSearchOutline,
  IoFileTrayStackedOutline 
} from "react-icons/io5";
import { FaUserTie } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { generateFactureVentesPDF } from './FactureVentes';
import Dialog from '../Dialog/Dialog';
import DailogInfoVentes from './Dailoginfoventes';
import DailloginfoFacture from './DailoginfoFacture';
import { useNavigate } from 'react-router';

function HestoriqueProfit() {
  const [viewType, setViewType] = useState('ventes'); 
  const [filterType, setFilterType] = useState('jour'); 
  const { user, role ,token} = useSelector(state => state.LoginAdmin);
  const { Employe } = useSelector(state => state.Employe); 

  // --- 1. JME3 DATA (ADMIN + EMPLOYE) ---
  let allVentes = [];
  let AllFacture = [];

  const today = new Date();
  const currentDay = today.toISOString().split("T")[0]; 
  const currentMonth = today.toISOString().slice(0, 7); 
  const currentYear = today.getFullYear().toString();

  // Initialize searchValue with currentDay so it's not empty on first render
  const [searchValue, setSearchValue] = useState(currentDay);
  const [ListFilterVentes, SetListFilterVentes] = useState([]);
  const [ListFilterFacture, SetListFilterFacture] = useState([]);

  if (role === "admin") {
    const adminVentes = user?.ventes || [];
    const employeVentes = Employe?.flatMap(e => 
      (e.ventes || []).map(v => ({ ...v, nameEmp: e.name }))
    ) || [];
    allVentes = [...adminVentes, ...employeVentes];

    const AdminFacture = user?.Facture || [];
    const EmployeFacture = Employe?.flatMap(e => 
      (e.Facture || []).map(f => ({ ...f, nameEmp: e.name }))
    ) || [];
    AllFacture = [...AdminFacture, ...EmployeFacture];
  } else {
    allVentes = user?.ventes || [];
    AllFacture = user?.Facture || [];
  }

  // --- 2. SEARCH LOGIC ---
  // Optimized to use direct parameters or current state
  const handleSearch = (value) => {
    if (!value) {
      SetListFilterVentes([]);
      SetListFilterFacture([]);
      return;
    }

    if (filterType === 'jour') {
      SetListFilterVentes(allVentes.filter((t) => t.DateVante?.split('T')[0] === value));
      SetListFilterFacture(AllFacture.filter((t) => t.DateFacture?.split('T')[0] === value));
    } else if (filterType === 'mois') {
      SetListFilterVentes(allVentes.filter((t) => t.DateVante?.substring(0, 7) === value));
      SetListFilterFacture(AllFacture.filter((t) => t.DateFacture?.substring(0, 7) === value));
    } else if (filterType === 'anne') {
      SetListFilterVentes(allVentes.filter((t) => t.DateVante?.substring(0, 4) === value));
      SetListFilterFacture(AllFacture.filter((t) => t.DateFacture?.substring(0, 4) === value));
    }
  };

  const displayData = viewType === 'ventes' ? ListFilterVentes : ListFilterFacture;

  const TotalProfit = displayData.reduce((somme, item) => {
    const p = viewType === 'ventes' ? (item.profite || 0) : (item.TotalPrix || 0);
    return somme + Number(p);
  }, 0);

  const [openInfo, setopenInfo] = useState(false);
  const [selectedVente, setselectedVente] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});

  function HandeleOpneInfo(item){
    if(viewType=='ventes'){
      setopenInfo(true);
      setselectedVente(item); 
    } else {
      setData(item);
      setOpen(true);
    }
  }

  // Effect to update the search input based on filter type
  useEffect(() => {
    if (filterType === "jour") setSearchValue(currentDay);
    if (filterType === "mois") setSearchValue(currentMonth);
    if (filterType === "anne") setSearchValue(currentYear);
  }, [filterType]);

  // Effect to trigger search whenever searchValue OR the source data changes
  // This ensures that when the component first mounts and "allVentes" is loaded, 
  // it automatically filters by the initial currentDay.
  useEffect(() => {
    handleSearch(searchValue);
  }, [searchValue, allVentes.length, AllFacture.length]);
const navigate = useNavigate()
useEffect(() => {
  if (!token) {
    navigate("/LoginChoise");
  }
}, [token, navigate]);
  return (
    <div className="p-4 min-h-screen bg-[#f8fafc] dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase dark:text-white">Profit History</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">Cash Register Archives and Statistics</p>
        </div>

        {/* --- STATS CARDS SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative overflow-hidden group p-6 rounded-[2.5rem] bg-linear-to-br from-emerald-500 to-emerald-700 shadow-xl shadow-emerald-500/20 dark:shadow-none transition-all hover:scale-[1.02]">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30">
                <IoCartOutline size={28} />
              </div>
              <div>
                <p className="text-emerald-100/70 text-[9px] font-black uppercase tracking-[0.2em] mb-0.5">Net Total Profit</p>
                <h3 className="text-3xl font-black text-white tracking-tighter">
                  {TotalProfit.toLocaleString()} <span className="text-sm font-bold opacity-80 ml-1">DH</span>
                </h3>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden group p-6 rounded-[2.5rem] bg-linear-to-br from-amber-400 to-amber-600 shadow-xl shadow-amber-500/20 dark:shadow-none transition-all hover:scale-[1.02]">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30">
                <IoFileTrayStackedOutline size={28} />
              </div>
              <div>
                <p className="text-amber-50/70 text-[9px] font-black uppercase tracking-[0.2em] mb-0.5">Completed Sales</p>
                <h3 className="text-3xl font-black text-white tracking-tighter">
                  {ListFilterVentes.length} <span className="text-sm font-bold opacity-80 ml-1">Items</span>
                </h3>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden group p-6 rounded-[2.5rem] bg-linear-to-br from-blue-500 to-blue-700 shadow-xl shadow-blue-500/20 dark:shadow-none transition-all hover:scale-[1.02]">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30">
                <IoReceiptOutline size={28} />
              </div>
              <div>
                <p className="text-blue-50/70 text-[9px] font-black uppercase tracking-[0.2em] mb-0.5">Edited Invoices</p>
                <h3 className="text-3xl font-black text-white tracking-tighter">
                  {ListFilterFacture.length} <span className="text-sm font-bold opacity-80 ml-1">Documents</span>
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* --- FILTERS BAR --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="relative group">
            <IoFilterOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 z-10" />
            <select 
              value={filterType}
              onChange={(e) => {setFilterType(e.target.value); SetListFilterVentes([]); SetListFilterFacture([]);}}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none appearance-none cursor-pointer text-[11px] font-black uppercase tracking-widest focus:ring-2 ring-emerald-500/20"
            >
             <option value="jour">Daily</option>
<option value="mois">Monthly</option>
<option value="anne">Yearly</option>

            </select>
            <IoChevronDownOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative group">
            <IoCalendarOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 z-10" />
              <input 
                type={filterType === 'jour' ? "date" : filterType === 'mois' ? "month" : "number"}
                placeholder={filterType === 'anne' ? "YYYY" : ""}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none text-[11px] font-black uppercase cursor-pointer"
              />
          </div>

          <div className="relative flex-1">
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="Search in Results..." className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none text-[11px] font-bold tracking-widest uppercase" />
          </div>
        </div>

        {/* --- TABS & ACTIONS --- */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex p-1.5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 w-fit shadow-sm">
            <button onClick={() => setViewType('ventes')} className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${viewType === 'ventes' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400'}`}>
              <IoCartOutline size={18} /> Sale
            </button>
            <button onClick={() => setViewType('factures')} className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${viewType === 'factures' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>
              <IoReceiptOutline size={18} /> Invoices
            </button>
          </div>

          {viewType=='ventes'&&
            <button 
              onClick={() =>generateFactureVentesPDF(ListFilterVentes)}
              className="px-8 py-4 rounded-2xl bg-blue-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white shadow-xl transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <IoReceiptOutline size={20} />Print Invoice
            </button>
          }
        </div>

        {/* --- TABLE SECTION --- */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden min-h-[450px]">
          {displayData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 opacity-20">
              <IoFileTrayStackedOutline size={80} />
              <p className="mt-4 font-black uppercase tracking-[0.3em] text-[10px]">Aucune donnée disponible pour cette période</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                 <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400">
  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em]">Date</th>
  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em]">Person in Charge</th>
  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em]">
    {viewType === 'ventes' ? 'Product' : 'Reference'}
  </th>
  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-center">Quantity</th>
  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-right">
    {viewType === 'ventes' ? 'Profit' : 'Amount'}
  </th>
</tr>

                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {displayData.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
                    onClick={()=>HandeleOpneInfo(t)}
                    >
                      <td className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase">
                        {new Date(t.DateVante || t.DateFacture).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-8 py-5">
                        {t.nameEmp ? (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 text-[10px] font-black border border-emerald-200 uppercase">
                              {t.nameEmp.charAt(0)}
                            </div>
                            <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">{t.nameEmp}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-900/20 text-amber-500 border border-amber-500/20 flex items-center justify-center shadow-sm">
                              <FaUserTie size={14} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[7px] text-amber-500 font-black uppercase tracking-widest leading-none mb-0.5">Admin</span>
                              <span className="text-[11px] text-slate-900 dark:text-white font-black uppercase">{user.name}</span>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        <p className="font-black text-xs text-slate-700 dark:text-slate-200 uppercase tracking-tight">
                          {viewType === 'ventes' ? t.name : `#${String(t._id).slice(-5).toUpperCase()}`}
                        </p>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black">
                          {t.quantite || (t.produits ? t.produits.length : 1)}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right font-black text-sm">
                        <span className={viewType === 'ventes' ? 'text-emerald-600' : 'text-blue-600'}>
                          {viewType === 'ventes' ? (t.profite || 0) : (t.TotalPrix || 0)} DH
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <Dialog 
        bgcolor={document.documentElement.classList.contains('dark') ? "#0f172a" : "#ffffff"}
        isOpen={openInfo} onClose={() => setopenInfo(false)} width="650px" title={"Détails de vente"}>
        <DailogInfoVentes vente={selectedVente} onClose={() => setopenInfo(false)} />
      </Dialog>
      
      <DailloginfoFacture data={data} onClose={() => setOpen(false)} open={open} />
    </div>
  );
}

export default HestoriqueProfit;