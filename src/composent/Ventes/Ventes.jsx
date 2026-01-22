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

  const [openInfo, setopenInfo] = useState(false);
  const [selectedVente, setselectedVente] = useState({});
  function HandleopeneDailog(item) {
    setselectedVente(item);
    setopenInfo(true);
  }

  return (
    /* Background bddeltu l-gray-50 (fate7 bzzaf) o text l-slate-900 */
    <div className="p-2 min-h-screen text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Tableau des Ventes</h1>
            <p className="text-slate-500 text-sm">Suivi des performances d'aujourd'hui</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="px-4 py-1.5 rounded-xl bg-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider">
              En direct
            </span>
            <span className="pr-4 text-sm font-medium text-slate-600">{Daye}</span>
          </div>
        </div>

        {/* Stats Cards - Bddelt l-gradient o l-border */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden group p-6 rounded-[2rem] bg-white border border-slate-200 shadow-xl shadow-slate-100 transition-all hover:shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <IoWalletOutline size={80} className="text-emerald-600" />
            </div>
            <div className="relative z-10 flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <IoWalletOutline size={32} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Profit Total</p>
                <h2 className="text-4xl font-black text-slate-800">{TotalProfite.toLocaleString()} <span className="text-lg text-emerald-600 font-medium">DH</span></h2>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden group p-6 rounded-[2rem] bg-white border border-slate-200 shadow-xl shadow-slate-100 transition-all hover:shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <TbBrandShopee size={80} className="text-blue-600" />
            </div>
            <div className="relative z-10 flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                <TbBrandShopee size={32} className="text-blue-600" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Volume de Ventes</p>
                <h2 className="text-4xl font-black text-slate-800">{TotalVentes} <span className="text-lg text-blue-600 font-medium">Produits</span></h2>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search - Bddelt background l-white */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          {role === 'admin' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">Filtrer par Employé</label>
              <div className="relative">
                <FaRegUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <select className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer text-sm text-slate-700">
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
              <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm text-slate-700"
                onChange={HnadleSearcheVetes}
              />
            </div>
            <button className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all active:scale-95">
              <FaPrint size={20} />
            </button>
          </div>
        </div>

        {/* Table Section - Background white o header fate7 */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500">
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest">Employé</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest">Produit</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest">Prix</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-center">Qté</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-right">Profit</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <div className="flex flex-col items-center opacity-20 text-slate-900">
                        <IoFileTrayStackedOutline size={50} />
                        <p className="mt-2 font-medium">Aucune donnée disponible</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayData.map((t) => (
                    <tr key={t._id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {t.nameEmp ? (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-bold">
                                {t.nameEmp.charAt(0)}
                              </div>
                              <span className="font-semibold text-sm text-slate-700">{t.nameEmp}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                                <FaUserTie size={14} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-amber-600">{user.name}</span>
                                <span className="text-[10px] uppercase tracking-tighter text-slate-400 italic">Admin</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">{t.name}</td>
                      <td className="px-6 py-4 font-mono text-slate-500">{t.price} DH</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">{t.quantite}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-emerald-600 font-black tracking-tight">+{t.profite} DH</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                        <button className="px-5 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
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
      {/* L-bgcolor dial Dialog bddeltu l-white */}
      <Dialog isOpen={openInfo} onClose={() => setopenInfo(false)} width="650px" title={"Détails de vente"} bgcolor='white'>
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