import { IoCreateOutline, IoTrashOutline, IoInformationCircleOutline, IoCalendarOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

function CardCategories(props) {
  const { name, Datee,btn ,id,update} = props;
  const { user, role,token,loading } = useSelector(state => state.LoginAdmin);

  // Format Date to a readable format
  const formattedDate = new Date(Datee).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="ProductsCard relative p-5 rounded-2xl bg-[#1e293b]
                 border border-slate-700 shadow-lg hover:border-[#2C74B3]
                 transition-all duration-300 "
    >
      <h2 className="text-lg font-semibold text-white mb-2">{name}</h2>

      {/* Date */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
        <IoCalendarOutline size={18} className="text-blue-400" />
        <span className="text-white font-medium">{formattedDate}</span>
      </div>

      <p className="text-sm text-slate-400 mb-4">
        Products: <span className="text-white font-semibold">00</span>
      </p>

      {/* Actions */}
{role=="admin"&&
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition"
        onClick={()=>update(id)}
        >
          <IoCreateOutline size={18} />
          Edit
        </button>

        <button className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition"
        onClick={()=>btn(id)}
        >
          <IoTrashOutline size={18} />
          Delete
        </button>

    
      </div>}
    </div>
  );
}

export default CardCategories;
