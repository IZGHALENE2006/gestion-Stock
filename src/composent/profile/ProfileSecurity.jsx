import { IoLockClosedOutline } from "react-icons/io5";

export default function ProfileSecurity() {
  return (
    <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
      <h2 className="text-sm font-black uppercase tracking-widest mb-6 text-slate-400">
        Sécurité
      </h2>

      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                         bg-[#0f172a] hover:bg-[#2C74B3] transition">
        <IoLockClosedOutline />
        Changer le mot de passe
      </button>
    </div>
  );
}
