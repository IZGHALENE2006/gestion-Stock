import { 
  IoFileTrayStackedOutline, 
  IoWalletOutline, 
  IoBagRemoveOutline, 
  IoBanOutline 
} from "react-icons/io5";
import ProductList from "./ProductList";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect } from "react";
export default function ProductPg() {
  const { Produts, loading } = useSelector((state) => state.Product);
  const { role,token } = useSelector(state => state.LoginAdmin);
 const navigate= useNavigate()
  const Total = Produts.reduce((somme, item) => {
    return somme += item.prix_vente * item.quantite;
  }, 0);

  const lowStockCount = Produts.filter(item => item.quantite > 0 && item.quantite < 10).length;
  const outOfStockCount = Produts.filter(item => item.quantite <= 0).length;

  // Reusable Stat Card Component for Light Mode
const StatCard = ({ icon, label, value, gradientLight, darkIconColor }) => (
    <div className={`relative overflow-hidden group
      flex-1 min-w-60 p-6 rounded-[2.5rem] transition-all duration-500 border flex items-center gap-5 group
      shadow-sm hover:shadow-xl hover:-translate-y-2 
      /* Light Mode */
      bg-linear-to-br ${gradientLight} shadow-lg border-gray-300
      
      /* Dark Mode */
      dark:bg-none dark:bg-slate-900/40 dark:border-slate-700 dark:shadow-none
    `}>
    {/* Icon Container */}
    <div className={`p-4 rounded-[1.8rem] 
      /* Light: White overlay */
      bg-white/20 text-white border border-white/30
      /* Dark: Themed tint */
      dark:bg-slate-800 ${darkIconColor} dark:border-slate-700
      backdrop-blur-md shadow-sm transition-transform group-hover:scale-110`}>
      {icon}
    </div>

        <div className={`duration-700 absolute -right-12 -top-12 w-32 h-32 bg-linear-to-br ${gradientLight} to-transparent 
        opacity-20 dark:opacity-[0.85] blur-3xl rounded-full group-hover:-right-1 group-hover:-top-1`} />
      
    
    {/* Text Content */}
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest mb-1 
        text-white/80 dark:text-slate-500">
        {label}
      </p>
      <h2 className="text-2xl font-black tracking-tight 
        text-white dark:text-slate-100">
        {value}
      </h2>
    </div>
  </div>
);
useEffect(() => {
  if (!token) {
    navigate("/LoginChoise");
  }
}, [token, navigate]);
  return (
    <div className="p-8 bg-gray-100 dark:bg-[#1e293b] min-h-screen">
      {/* --- STATS SECTION --- */}
<div className="flex flex-wrap gap-6 mb-10">
  
  {/* Total Produits - Indigo */}
  <StatCard 
    icon={<IoFileTrayStackedOutline size={28} />}
    label="Total Product"
    value={Produts.length}
    gradientLight="from-indigo-500 to-blue-600"
    darkIconColor="dark:text-indigo-400"
  />

  {/* Stock Faible - Amber */}
  <StatCard 
    icon={<IoBagRemoveOutline size={28} />}
    label="Low Stock"
    value={lowStockCount}
    gradientLight="from-orange-400 to-amber-600"
    darkIconColor="dark:text-amber-400"
  />

  {/* Rupture Stock - Rose */}
  <StatCard 
    icon={<IoBanOutline size={28} />}
    label="Out Of Stock"
    value={outOfStockCount}
    gradientLight={outOfStockCount > 0 ? "from-rose-500 to-red-700" : "from-slate-400 to-slate-500"}
    darkIconColor={outOfStockCount > 0 ? "dark:text-rose-400" : "dark:text-slate-500"}
  />

  {/* Valeur Inventaire - Emerald */}
  <StatCard 
    icon={<IoWalletOutline size={28} />}
    label="Inventory Value"
    value={role === 'admin' ? (
      <div className="flex items-baseline gap-1">
        {Total.toLocaleString()} <span className="text-xs font-bold opacity-60 uppercase">dh</span>
      </div>
    ) : "**** DH"}
    gradientLight="from-emerald-400 to-teal-600"
    darkIconColor="dark:text-emerald-400"
  />

</div>

      {/* --- LIST SECTION --- */}
      <div className="rounded-[3rem]">
        <ProductList />
      </div>
    </div>
  );
}