import { Outlet, useNavigate } from "react-router-dom";
import NaveProfite from "./NaveProfite";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function Profite() {
      const { role, user, token } = useSelector((state) => state.LoginAdmin);
const navigate = useNavigate()
useEffect(() => {
  if (!token) {
    navigate("/LoginChoise");
  }
}, [token, navigate]);
  return (
    <div className="flex flex-col gap-4 p-4 min-h-screen bg-slate-50 dark:bg-[#1e293b] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <NaveProfite />
      <div>
        <Outlet />
      </div>
    </div>
  );
}