import "./Product.css"
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

  const Total = Produts.reduce((somme, item) => {
    return somme += item.prix_achat;
  }, 0);

  const lowStockCount = Produts.filter(item => item.quantite > 0 && item.quantite < 10).length;

  const outOfStockCount = Produts.filter(item => item.quantite <= 0).length;

  return (
    <div className="p-6 bg-[#0f172a] min-h-screen text-white">
      <div className="flex flex-wrap gap-6 mb-8">
        
        <div className="ProductsCard flex-1 min-w-60 p-5 rounded-2xl bg-[#1e293b] border border-slate-700 shadow-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/20">
            <IoFileTrayStackedOutline size={35} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-slate-400 text-sm font-medium">Count Product</h1>
            <h1 className="text-3xl font-bold">{Produts.length}</h1>
          </div>
        </div>

        <div className="ProductsCard flex-1 min-w-60 p-5 rounded-2xl bg-[#1e293b] border border-slate-700 shadow-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/20">
            <IoBagRemoveOutline size={35} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-slate-400 text-sm font-medium">Low Stock</h1>
            <h1 className="text-3xl font-bold text-amber-500">{lowStockCount}</h1>
          </div>
        </div>

        <div className={`flex-1 min-w-60 p-5 rounded-2xl border shadow-xl flex items-center gap-4 transition-all duration-300 ${
          outOfStockCount > 0 
          ? "bg-red-900/20 border-red-500 animate-pulse" 
          : "bg-[#1e293b] border-slate-700 ProductsCard"
        }`}>
          <div className={`p-3 rounded-xl ${outOfStockCount > 0 ? "bg-red-500/30" : "bg-slate-700/30"}`}>
            <IoBanOutline size={35} className={outOfStockCount > 0 ? "text-red-500" : "text-slate-400"} />
          </div>
          <div>
            <h1 className="text-slate-400 text-sm font-medium">Out Of Stock</h1>
            <h1 className={`text-3xl font-bold ${outOfStockCount > 0 ? "text-red-500" : "text-white"}`}>
              {outOfStockCount}
            </h1>
          </div>
        </div>

        <div className="ProductsCard flex-1 min-w-60 p-5 rounded-2xl bg-[#1e293b] border border-slate-700 shadow-xl flex items-center gap-4 hover:border-emerald-500 transition-all duration-300">
          <div className="p-3 rounded-xl bg-emerald-500/20">
            <IoWalletOutline size={37} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-slate-400 text-sm font-medium">Total Inventory Value</h1>
            <h1 className="text-3xl font-bold text-emerald-400">
              {Total.toLocaleString()} <span className="text-sm font-normal text-slate-400">dh</span>
            </h1>
          </div>
        </div>

      </div>

      <div className="overflow-hidden">
        <ProductList />
      </div>
    </div>
  );
}