import { Outlet } from "react-router-dom";
import NaveProfite from "./NaveProfite";

export default function Profite() {
  return (
    <div className="flex flex-col gap-4 p-4 min-h-screen bg-slate-50 dark:bg-[#1e293b] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <NaveProfite />
      <div>
        <Outlet />
      </div>
    </div>
  );
}