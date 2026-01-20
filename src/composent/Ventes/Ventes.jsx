import { 
  IoFileTrayStackedOutline, 
  IoWalletOutline, 
 } from "react-icons/io5";
 import { FaUserTie } from "react-icons/fa";

 import { FaRegUserCircle } from "react-icons/fa";

import { TbBrandShopee } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { GetAllEmploye } from "../../slices/sliceEmploye";
import { useEffect, useState } from "react";
import { FaPrint } from "react-icons/fa";
import { getMe } from "../../slices/SliceLoginAdmin";

function Ventes() {
const { user, role,token,loading } = useSelector(state => state.LoginAdmin);
const dispatch = useDispatch()
  //get me
  useEffect(()=>{
   if(token){
     dispatch(getMe())
   }
  },[dispatch,token])
  //List TOUT Ventes
  const [ventesAdmin,setVentesAdmin] = useState([])
    //get Emp
const { Employe } = useSelector(state => state.Employe);
let allVentes = [];

if (role === "admin") {
  // ventes ديال admin
  const adminVentes = user?.ventes || [];

  // ventes ديال جميع employés
  const employeVentes = Employe?.flatMap(e => e.ventes || []);

  allVentes = [...adminVentes, ...employeVentes];
} else {
  // employé يشوف غير ديالو
  allVentes = user?.ventes || [];
}

//Logic Ventes oujourdhoui
const Daye  = new Date().toLocaleDateString() 
const Ventes = allVentes.filter((t)=> new Date(t.DateVante).toLocaleDateString()===Daye)
 //Logic Saerche 
const [ListSearche,setSaerchList] = useState([])
function HnadleSearcheVetes(e) {
  const value = e.target.value.toLowerCase();

  if (value === "") {
    setSaerchList([]);
    return;
  }

  setSaerchList(
    Ventes.filter((t) =>
      t.name?.toLowerCase().includes(value)
    )
  );
}

const TotalProfite = Ventes.reduce((somme,t)=>somme+=t.profite,0)
const TotalVentes = Ventes.reduce((somme,t)=>somme+=Number(t.quantite||0),0)

  useEffect(() => {
    dispatch(GetAllEmploye());
  }, [dispatch]);
  return (
    <div className="p-6 bg-[#0f172a] min-h-screen text-white space-y-6">
      {/* Top Cards */}
    <div className="flex flex-wrap gap-6">
  {/* Total Profit */}
  <div className="flex-1 min-w-60 p-5 rounded-2xl bg-[#1e293b] border border-slate-700 shadow-xl flex items-center gap-4">
    <div className="p-3 rounded-xl bg-emerald-500/20">
      <IoWalletOutline size={35} className="text-emerald-400" />
    </div>
    <div>
      <h1 className="text-slate-400 text-sm font-medium">Total Profit Ventes</h1>
      <h1 className="text-3xl font-bold text-emerald-400">{TotalProfite} DH</h1>
    </div>
  </div>

  {/* Total Number of Sales */}
 <div className="flex-1 min-w-60 p-5 rounded-2xl bg-[#1e293b] border border-slate-700 shadow-xl flex items-center gap-4">
  <div className="p-3 rounded-xl bg-blue-500/20">
    <TbBrandShopee  size={35} className="text-blue-400" />
  </div>
  <div>
    <h1 className="text-slate-400 text-sm font-medium">Total Nb Ventes</h1>
    <h1 className="text-3xl font-bold text-blue-400">{TotalVentes}</h1>
  </div>
</div>

</div>


      {/* Employee Selection/Search */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
{role=='admin'&&
<>
          <label className="block text-slate-400 mb-1">Select Employee</label>

 <div className="relative">
  <FaRegUserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
  
  <select className="w-full pl-10 p-2 border rounded-lg bg-[#1e293b] border-slate-700 text-white">
    <option value="All">All</option>
    {Employe?.map((t) => (
      <option key={t._id} value={t._id}>
        {t.name}
      </option>
    ))}
  </select>
</div>
</>
}

        </div>
<div className="flex-1">
  <label className="block text-slate-400 mb-1">Search Ventes</label>

  <div className="flex items-center gap-2">
    {/* Search */}
    <input
      type="text"
      placeholder="Search..."
      className="flex-1 p-2 border rounded-lg bg-[#1e293b] border-slate-700 text-white placeholder-slate-400"
      onChange={HnadleSearcheVetes}
    />

    {/* Print Button */}
    <button
      onClick={() => console.log("print")}
      className="p-2 rounded-lg bg-[#1e293b] border border-slate-700 hover:border-blue-400 hover:text-blue-400 transition"
    >
      <FaPrint size={18} />
    </button>
  </div>
</div>


      </div>

      {/* Ventes Map */}
 <div className="bg-[#1e293b] p-4 rounded-2xl border border-slate-700 shadow-xl h-131 overflow-auto">
  <table className="w-full text-sm text-left text-slate-300">
    {/* Header */}
    <thead className="text-xs uppercase text-slate-400 border-b border-slate-700">
      <tr>
        <th className="px-4 py-3">Employé</th>
        <th className="px-4 py-3">nom produit</th>
        <th className="px-4 py-3">Prix de vente</th>
        <th className="px-4 py-3">Quantité</th>
        <th className="px-4 py-3">Profit</th>
        <th className="px-4 py-3">Date vente</th>
        <th className="px-4 py-3 text-center">Actions</th>
      </tr>
    </thead>

    {/* Body */}
<tbody>
  {(ListSearche.length === 0 ? Ventes : ListSearche).length === 0 ? (
    <tr>
      <td colSpan="7" className="text-center py-6 text-slate-400">
        Aucune vente trouvée
      </td>
    </tr>
  ) : (
    (ListSearche.length === 0 ? Ventes : ListSearche).map((t) => (
      <tr
        key={t._id}
        className="border-b border-slate-700 hover:bg-slate-700/30 transition"
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2 text-slate-300">
            {t.nameEmp ? (
              <>
                <FaRegUserCircle className="text-slate-400" />
                <span>{t.nameEmp}</span>
              </>
            ) : (
              <>
                <FaUserTie className="text-amber-400" />
                <div className="flex flex-col leading-tight">
                  <span>{user.name}</span>
                  <span className="text-xs text-amber-400">admin</span>
                </div>
              </>
            )}
          </div>
        </td>

        <td className="px-4 py-3">{t.name}</td>
        <td className="px-4 py-3">{t.price} dh</td>
        <td className="px-4 py-3">{t.quantite}</td>
        <td className="px-4 py-3 text-emerald-400 font-medium">
          +{t.profite} dh
        </td>
        <td className="px-4 py-3">
          {String(t.DateVante).split("T")[0]}
        </td>

        <td className="px-4 py-3">
          <div className="flex justify-center gap-2">
            <button className="px-3 py-1 rounded-md bg-blue-500/20 text-blue-400">
              Voir
            </button>

            <button
              onClick={() => console.log("print")}
              className="p-2 rounded-lg bg-[#1e293b] border border-slate-700 hover:border-blue-400 hover:text-blue-400 transition"
            >
              <FaPrint size={18} />
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
  );
}

export default Ventes;
