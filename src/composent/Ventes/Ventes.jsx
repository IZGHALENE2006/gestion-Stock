import { IoFileTrayStackedOutline, IoWalletOutline, IoSearchOutline } from "react-icons/io5";
import { FaUserTie, FaRegUserCircle, FaPrint } from "react-icons/fa";
import { TbBrandShopee } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { GetAllEmploye } from "../../slices/sliceEmploye";
import { useEffect, useState } from "react";
import { getMe } from "../../slices/SliceLoginAdmin";
import DailogInfoVentes from "./Dailoginfoventes";
import Dialog from "../Dialog/Dialog";
import { generateFactureVentesPDF } from "./FactureVentes";

function Ventes() {
  const { user, role, token, loading } = useSelector(state => state.LoginAdmin);
  const { Employe } = useSelector(state => state.Employe);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) dispatch(getMe());
    dispatch(GetAllEmploye());
  }, [dispatch, token]);

  const [ListSearche, setSaerchList] = useState([]);

  // --- LOGIC DIAL L-SMIYA (nameEmp) ---
  let allVentes = [];
  if (role === "admin") {
    const adminVentes = user?.ventes || [];
    // Hna fin kanzido l-smiya dial l-khdam l-koll vente dyalo
    const employeVentes = Employe?.flatMap(e => 
      (e.ventes || []).map(v => ({ ...v, nameEmp: e.name }))
    ) || [];
    allVentes = [...adminVentes, ...employeVentes];
  } else {
    allVentes = user?.ventes || [];
  }

  const Daye = new Date().toLocaleDateString();
  const VentesDujour = allVentes.filter((t) => new Date(t.DateVante).toLocaleDateString() === Daye);

  function HnadleSearcheVetes(e) {
    const value = e.target.value.toLowerCase();
    if (value === "") {
      setSaerchList([]);
      return;
    }
    setSaerchList(VentesDujour.filter((t) => t.name?.toLowerCase().includes(value)));
  }

  const TotalProfite = VentesDujour.reduce((somme, t) => (somme += t.profite), 0);
  const TotalVentes = VentesDujour.reduce((somme, t) => (somme += Number(t.quantite || 0)), 0);

  const displayData = ListSearche.length === 0 && !loading ? VentesDujour : ListSearche;

  const [openInfo, setopenInfo] = useState(false);
  const [selectedVente, setselectedVente] = useState({});

  function HandleopeneDailog(item) {
    setselectedVente(item);
    setopenInfo(true);
  }

  return (
    <div className="p-4 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Ventes du Jour</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Analyse des performances en temps réel</p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> Direct
            </span>
            <span className="pr-4 text-sm font-black text-slate-700 dark:text-slate-300">{Daye}</span>
          </div>
        </div>

        {/* Stats Cards (Style Dialk) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative overflow-hidden group p-8 rounded-[3rem] transition-all hover:scale-[1.02] bg-linear-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-200/50 dark:shadow-none dark:from-slate-700/50 dark:to-slate-900 dark:border dark:border-slate-700">
            <div className="relative z-10 flex items-center gap-6">
              <div className="p-5 rounded-3xl bg-white/20 dark:bg-emerald-500 backdrop-blur-md text-white shadow-xl shadow-black/5">
                <IoWalletOutline size={35} />
              </div>
              <div>
                <p className="text-emerald-50/80 dark:text-emerald-300/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Bénéfice Net</p>
                <h2 className="text-5xl font-black text-white tracking-tighter">
                  {TotalProfite.toLocaleString()} <span className="text-xl text-emerald-200 dark:text-emerald-400 font-bold ml-1">DH</span>
                </h2>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden group p-8 rounded-[3rem] transition-all hover:scale-[1.02] bg-linear-to-br from-blue-400 to-blue-600 shadow-xl shadow-blue-200/50  dark:shadow-none dark:from-slate-700/50 dark:to-slate-900 dark:border dark:border-slate-700">
            <div className="relative z-10 flex items-center gap-6">
              <div className="p-5 rounded-3xl bg-white/20 dark:bg-blue-500 backdrop-blur-md text-white shadow-xl shadow-black/5">
                <TbBrandShopee size={35} />
              </div>
              <div>
                <p className="text-blue-50/80 dark:text-blue-300/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Volume de Ventes</p>
                <h2 className="text-5xl font-black text-white tracking-tighter">
                  {TotalVentes} <span className="text-xl text-blue-200 dark:text-blue-400 font-bold ml-1">Items</span>
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Control Bar */}
        <div className="flex flex-col lg:flex-row gap-4 bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          {role === 'admin' && (
            <div className="relative flex-1 lg:max-w-xs">
              <FaRegUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
              <select className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                <option value="All">Tous les vendeurs</option>
                {Employe?.map((t) => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
            </div>
          )}
          
          <div className="flex-1 flex gap-3">
            <div className="relative flex-1">
              <IoSearchOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="RECHERCHER UN PRODUIT..."
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:border-emerald-500 outline-none transition-all text-[11px] font-bold tracking-widest uppercase"
                onChange={HnadleSearcheVetes}
              />
            </div>
            <button className="px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]"
            onClick={()=>generateFactureVentesPDF(VentesDujour)}
            >
              <FaPrint size={18} /> Imprimer
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500">
                  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em]">Vendeur</th>
                  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em]">Produit</th>
                  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-center">Quantité</th>
                  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-right">Profit</th>
                  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {displayData.map((t) => (
                  <tr key={t._id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        {/* HNA FIN T-Y-TLE3 SMIYT L-KHEDDAM L-ADMIN */}
                        {t.nameEmp ? (
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-black border border-emerald-200 shadow-sm uppercase">
                              {t.nameEmp.charAt(0)}
                            </div>
                            <span className="font-black text-xs text-slate-700 dark:text-slate-200 uppercase tracking-tight">{t.nameEmp}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 border border-amber-100 dark:border-amber-500/20 shadow-sm">
                              <FaUserTie size={16} />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-xs text-slate-800 dark:text-slate-100 uppercase tracking-tight">{user.name}</span>
                              <span className="text-[8px] font-black uppercase text-amber-600 tracking-widest leading-none">Admin</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-black text-xs text-slate-700 dark:text-slate-200 uppercase tracking-tight">{t.name}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black border border-slate-200">
                        {t.quantite}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm tracking-tight">+{t.profite} DH</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <button 
                          className="px-6 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-[9px] font-black uppercase border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm"
                          onClick={() => HandleopeneDailog(t)}
                        >
                          Détails
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog 
        bgcolor={document.documentElement.classList.contains('dark') ? "#0f172a" : "#ffffff"}
      
      isOpen={openInfo} onClose={() => setopenInfo(false)} width="650px" title={"Détails de vente"}>
        <DailogInfoVentes vente={selectedVente} onClose={() => setopenInfo(false)} />
      </Dialog>
    </div>
  );
}

export default Ventes;