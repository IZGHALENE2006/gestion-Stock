import { useEffect } from "react";
import { IoCreateOutline, IoTrashOutline, IoCalendarOutline, IoLayersOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {GetAllProduct } from "../../slices/SliceProduct";

function CardCategories({ name, Datee, btn, id, update }) {
  const { role } = useSelector(state => state.LoginAdmin);
  const { Produts } = useSelector((state) => state.Product);
  const Dispatch = useDispatch();
    useEffect(() => {
      Dispatch(GetAllProduct());
    }, [Dispatch]);

  const productCount = Produts?.filter(item => item.categorie === name).length || 0;

  const formattedDate = Datee 
    ? new Date(Datee).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Non spécifiée";

  return (
    <div className="group w-full md:w-80 p-6 rounded-2xl bg-[#1e293b] border border-slate-700 
                    hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/20 
                    transition-all duration-300">
      
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
          <IoLayersOutline size={24} />
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
          ID: {id.slice(-5)}
        </span>
      </div>

      <h2 className="text-xl font-bold text-white mb-1">{name}</h2>
      
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <IoCalendarOutline size={16} />
        <span>Créé le {formattedDate}</span>
      </div>

      {/* PRODUCT COUNT BADGE */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 mb-6">
        <span className="text-slate-400 text-sm font-medium">Nombre de produits</span>
        <span className="text-white font-bold text-lg bg-blue-600 px-3 py-0.5 rounded-lg shadow-lg shadow-blue-600/20">
          {productCount}
        </span>
      </div>

      {role === "admin" && (
        <div className="flex items-center gap-3 border-t border-slate-700 pt-5">
          <button 
            onClick={() => update(id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium 
                       text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
          >
            <IoCreateOutline size={18} />
            Modifier
          </button>
          
          <button 
            onClick={() => btn(id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium 
                       text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <IoTrashOutline size={18} />
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}

export default CardCategories;