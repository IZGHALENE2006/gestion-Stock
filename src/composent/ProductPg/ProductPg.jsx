import { 
  IoFileTrayStackedOutline, 
  IoWalletOutline, 
  IoBagRemoveOutline, 
  IoBanOutline 
} from "react-icons/io5";
import ProductList from "./ProductList";
import { useSelector } from "react-redux";

export default function ProductPg() {
  const { Produts, loading } = useSelector((state) => state.Product);
  const { role } = useSelector(state => state.LoginAdmin);
 
  const Total = Produts.reduce((somme, item) => {
    return somme += item.prix_achat;
  }, 0);

  const lowStockCount = Produts.filter(item => item.quantite > 0 && item.quantite < 10).length;
  const outOfStockCount = Produts.filter(item => item.quantite <= 0).length;

  // Reusable Stat Card Component for Light Mode
  const StatCard = ({ icon, label, value, colorClass, bgColor, iconColor }) => (
    <div className={`flex-1 min-w-[240px] p-6 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:translate-y-[-5px] hover:shadow-md`}>
      <div className={`p-4 rounded-[1.8rem] ${bgColor} ${iconColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
        <h2 className={`text-2xl font-black ${colorClass || "text-slate-800"}`}>
          {value}
        </h2>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      {/* --- STATS SECTION --- */}
      <div className="flex flex-wrap gap-6 mb-10">
        
        <StatCard 
          icon={<IoFileTrayStackedOutline size={28} />}
          label="Total Produits"
          value={Produts.length}
          bgColor="bg-indigo-50"
          iconColor="text-indigo-500"
        />

        <StatCard 
          icon={<IoBagRemoveOutline size={28} />}
          label="Stock Faible"
          value={lowStockCount}
          colorClass="text-amber-600"
          bgColor="bg-amber-50"
          iconColor="text-amber-500"
        />

        <div className={`flex-1 min-w-[240px] p-6 rounded-[2.5rem] border transition-all duration-300 flex items-center gap-5 ${
          outOfStockCount > 0 
          ? "bg-rose-50 border-rose-100 shadow-rose-100 shadow-lg" 
          : "bg-white border-slate-100 shadow-sm"
        }`}>
          <div className={`p-4 rounded-[1.8rem] ${outOfStockCount > 0 ? "bg-white text-rose-500 shadow-sm" : "bg-slate-50 text-slate-400"}`}>
            <IoBanOutline size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Rupture Stock</p>
            <h2 className={`text-2xl font-black ${outOfStockCount > 0 ? "text-rose-600" : "text-slate-800"}`}>
              {outOfStockCount}
            </h2>
          </div>
        </div>

        <StatCard 
          icon={<IoWalletOutline size={28} />}
          label="Valeur Inventaire"
          value={role === 'admin' ? (
            <div className="flex items-baseline gap-1">
              {Total.toLocaleString()} <span className="text-xs font-bold opacity-40 uppercase">dh</span>
            </div>
          ) : "**** DH"}
          colorClass="text-emerald-600"
          bgColor="bg-emerald-50"
          iconColor="text-emerald-500"
        />

      </div>

      {/* --- LIST SECTION --- */}
      <div className="rounded-[3rem]">
        <ProductList />
      </div>
    </div>
  );
}