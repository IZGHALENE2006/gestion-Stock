import { Outlet } from "react-router-dom";
import NaveProfite from "./NaveProfite";

export default function Profite() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <NaveProfite />
      <div>
        <Outlet />
      </div>
    </div>
  );
}