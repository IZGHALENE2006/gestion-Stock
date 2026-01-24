import { useSelector } from "react-redux";

export default function ProfileInfo() {
  const { user } = useSelector(state => state.LoginAdmin);

  return (
    <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 col-span-2">
      <h2 className="text-sm font-black uppercase tracking-widest mb-6 text-slate-400">
        Informations personnelles
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <Info label="Nom" value={user?.name} />
        <Info label="Email" value={user?.email} />
        <Info label="Téléphone" value={user?.phone || "—"} />
        <Info label="CIN" value={user?.cin || "—"} />
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="font-bold mt-1">{value || "Non spécifié"}</p>
    </div>
  );
}