import { useEffect } from "react";
import {
  IoCreateOutline,
  IoTrashOutline,
  IoCalendarOutline,
  IoLayersOutline
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { GetAllProduct } from "../../slices/SliceProduct";

function CardCategories({ name, Datee, btn, id, update }) {
  const { role } = useSelector(state => state.LoginAdmin);
  const { Produts } = useSelector(state => state.Product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetAllProduct());
  }, [dispatch]);

  const productCount =
    Produts?.filter(item => item.categorie === name).length || 0;

  const formattedDate = Datee
    ? new Date(Datee).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Non spécifiée";

  return (
    <div
      className="
        group w-full md:w-80 p-6 rounded-[2rem]
        bg-white border border-[#e2e8f0]
        hover:border-indigo-200 hover:bg-[#f1f5f9]
        hover:shadow-xl hover:shadow-indigo-500/5
        transition-all duration-300 relative overflow-hidden
      "
    >
      {/* SHINE EFFECT (Optional from your CSS logic) */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%]" />

      {/* HEADER */}
      <div className="flex justify-between items-start mb-5">
        <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-500 border border-indigo-100/50">
          <IoLayersOutline size={22} />
        </div>

        <span className="
          text-[10px] font-black px-3 py-1 rounded-lg
          bg-slate-50 text-[#64748b]
          border border-[#e2e8f0] tracking-tighter
        ">
          ID: {id.slice(-5).toUpperCase()}
        </span>
      </div>

      {/* TITLE */}
      <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-tight mb-1">
        {name}
      </h2>

      {/* DATE */}
      <div className="flex items-center gap-2 text-[11px] font-bold text-[#64748b] uppercase tracking-wide mb-6">
        <IoCalendarOutline size={14} className="text-slate-400" />
        <span>Créé le {formattedDate}</span>
      </div>

      {/* PRODUCT COUNT BOX */}
      <div className="
        flex items-center justify-between p-4 rounded-2xl
        bg-[#f8fafc] border border-[#e2e8f0] mb-6
      ">
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase text-[#64748b] tracking-widest">
            Inventaire
          </span>
          <span className="text-[#334155] text-xs font-bold">
            Nombre de produits
          </span>
        </div>

        <span className="
          text-indigo-600 font-black text-xl px-4 py-1 rounded-xl
          bg-white shadow-sm border border-indigo-50
        ">
          {productCount}
        </span>
      </div>

      {/* ACTIONS */}
      {role === "admin" && (
        <div className="flex items-center gap-3 border-t border-[#e2e8f0] pt-5">
          <button
            onClick={() => update(id)}
            className="
              flex-1 flex items-center justify-center gap-2 py-2.5
              text-[11px] font-black uppercase tracking-widest text-indigo-500
              bg-white hover:bg-indigo-50 border border-indigo-50 rounded-xl
              transition-all active:scale-95
            "
          >
            <IoCreateOutline size={16} />
            Modifier
          </button>

          <button
            onClick={() => btn(id)}
            className="
              flex-1 flex items-center justify-center gap-2 py-2.5
              text-[11px] font-black uppercase tracking-widest text-rose-500
              bg-white hover:bg-rose-50 border border-rose-50 rounded-xl
              transition-all active:scale-95
            "
          >
            <IoTrashOutline size={16} />
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}

export default CardCategories;