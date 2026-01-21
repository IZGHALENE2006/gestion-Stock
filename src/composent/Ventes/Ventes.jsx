import { IoFileTrayStackedOutline, IoWalletOutline, IoSearchOutline } from "react-icons/io5";
import { FaUserTie, FaRegUserCircle, FaPrint } from "react-icons/fa";
import { TbBrandShopee } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { GetAllEmploye } from "../../slices/sliceEmploye";
import { useEffect, useState } from "react";
import { getMe } from "../../slices/SliceLoginAdmin";
import DailogInfoVentes from "./Dailoginfoventes";
import Dialog from "../Dialog/Dialog";

function Ventes() {
  const { user, role, token, loading } = useSelector(state => state.LoginAdmin);
  const { Employe } = useSelector(state => state.Employe);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) dispatch(getMe());
    dispatch(GetAllEmploye());
  }, [dispatch, token]);

  const [ListSearche, setSaerchList] = useState([]);

  let allVentes = [];
  if (role === "admin") {
    const adminVentes = user?.ventes || [];
    const employeVentes = Employe?.flatMap(e => e.ventes || []);
    allVentes = [...adminVentes, ...employeVentes];
  } else {
    allVentes = user?.ventes || [];
  }

  const Daye = new Date().toLocaleDateString();
  const Ventes = allVentes.filter((t) => new Date(t.DateVante).toLocaleDateString() === Daye);

  function HnadleSearcheVetes(e) {
    const value = e.target.value.toLowerCase();
    if (value === "") {
      setSaerchList([]);
      return;
    }
    setSaerchList(Ventes.filter((t) => t.name?.toLowerCase().includes(value)));
  }

  const TotalProfite = Ventes.reduce((somme, t) => (somme += t.profite), 0);
  const TotalVentes = Ventes.reduce((somme, t) => (somme += Number(t.quantite || 0)), 0);

  const displayData = ListSearche.length === 0 && !loading ? Ventes : ListSearche;
//open dailgog info nventes

const [openInfo,setopenInfo] = useState(false)
const [selectedVente,setselectedVente] = useState({}) 
function HandleopeneDailog(item){
  setselectedVente(item)
  setopenInfo(true )
}
  return (
    <div className="p-8 bg-[#0f172a] min-h-screen text-slate-200 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Tableau des Ventes</h1>
            <p className="text-slate-400 text-sm">Suivi des performances d'aujourd'hui</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/40 p-1.5 rounded-2xl border border-slate-700/50">
            <span className="px-4 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              En direct
            </span>
            <span className="pr-4 text-sm font-medium text-slate-300">{Daye}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden group p-6 rounded-[2rem] bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-slate-700/50 shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <IoWalletOutline size={80} className="text-emerald-400" />
            </div>
            <div className="relative z-10 flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <IoWalletOutline size={32} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Profit Total</p>
                <h2 className="text-4xl font-black text-white">{TotalProfite.toLocaleString()} <span className="text-lg text-emerald-500 font-medium">DH</span></h2>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden group p-6 rounded-[2rem] bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-slate-700/50 shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <TbBrandShopee size={80} className="text-blue-400" />
            </div>
            <div className="relative z-10 flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <TbBrandShopee size={32} className="text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Volume de Ventes</p>
                <h2 className="text-4xl font-black text-white">{TotalVentes} <span className="text-lg text-blue-500 font-medium">Produits</span></h2>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end bg-[#1e293b]/30 p-4 rounded-3xl border border-slate-800">
          {role === 'admin' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-2">Filtrer par Employé</label>
              <div className="relative">
                <FaRegUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
                <select className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#0f172a] border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer text-sm">
                  <option value="All">Tous les employés</option>
                  {Employe?.map((t) => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
          <div className="lg:col-span-2 flex gap-3">
            <div className="relative flex-1">
              <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#0f172a] border border-slate-700 focus:border-indigo-500 outline-none transition-all text-sm"
                onChange={HnadleSearcheVetes}
              />
            </div>
            <button className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
              <FaPrint size={20} />
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-[#1e293b] rounded-[2rem] border border-slate-700/50 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400">
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest">Employé</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest">Produit</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest">Prix</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-center">Qté</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-right">Profit</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {displayData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <IoFileTrayStackedOutline size={50} />
                        <p className="mt-2 font-medium">Aucune donnée disponible</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayData.map((t) => (
                    <tr key={t._id} className="hover:bg-slate-700/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {t.nameEmp ? (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 text-xs">
                                {t.nameEmp.charAt(0)}
                              </div>
                              <span className="font-semibold text-sm">{t.nameEmp}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <FaUserTie size={14} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-amber-500">{user.name}</span>
                                <span className="text-[10px] uppercase tracking-tighter opacity-60 italic">Admin</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-white">{t.name}</td>
                      <td className="px-6 py-4 font-mono text-slate-400">{t.price} DH</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-700 text-xs font-bold">{t.quantite}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-emerald-400 font-black tracking-tight">+{t.profite} DH</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                        <button className="px-5 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/30 transition-all"
                        onClick={()=>HandleopeneDailog(t)}
                        >
  Détails
</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
              <Dialog isOpen={openInfo} onClose={() => setopenInfo(false)} width="650px" title={"Détails de vente"} bgcolor='#1e293b'>
   <DailogInfoVentes
      vente={selectedVente} 
      onClose={() => setopenInfo(false)} 
      onViewProduct={(id) => console.log("Navigate to product:", id)} 
   />
</Dialog>
    </div>
  );
}

export default Ventes;