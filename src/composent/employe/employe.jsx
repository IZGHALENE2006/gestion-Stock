import { Outlet } from "react-router-dom";
import NavRow from "./NavEmploye";

export default function EmployeesPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <NavRow />
      <div className="mt-4">
        {/* هاد المكان غادي يبدل على حسب الروت اللي مختار */}
        <Outlet />
      </div>
    </div>
  );
}
