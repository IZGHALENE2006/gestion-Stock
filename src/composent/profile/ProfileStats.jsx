import { useSelector } from "react-redux";

export default function ProfileStats() {
  const { user } = useSelector(state => state.LoginAdmin);

  return (
    <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
      <h2 className="text-sm font-black uppercase tracking-widest mb-6 text-slate-400">
        Activité
      </h2>
{/* 
      <Stat label="Ventes" value={user.ventes?.length || 0} />
      <Stat label="Factures" value={user.Facture?.length || 0} />
      <Stat label="Compte créé le" value={new Date(user.datecreate).toLocaleDateString()} /> */}
    </div>
  );
}

// function Stat({ label, value }) {
//   return (
//     <div className="flex justify-between py-2 border-b border-slate-700 last:border-none">
//       <span className="text-slate-400">{label}</span>
//       <span className="font-black">{value}</span>
//     </div>
//   );
// }
