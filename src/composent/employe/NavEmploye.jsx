import { NavLink } from "react-router-dom";
import { IoPeopleOutline, IoBarChartOutline } from "react-icons/io5";

export default function NavRow() {
  return (
    <div className="flex gap-4 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm mb-8">
      
      <NavLink
        to="/Home/employees/EmployeeDashboard"
        className={({ isActive }) =>
          `flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm transition
          ${
            isActive
              ? "bg-blue-600 text-white shadow"
              : "text-slate-600 hover:bg-slate-100"
          }`
        }
      >
        <IoPeopleOutline size={20} />
        Employees
      </NavLink>

      <NavLink
        to="/Home/employees/statistique"
        className={({ isActive }) =>
          `flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm transition
          ${
            isActive
              ? "bg-blue-600 text-white shadow"
              : "text-slate-600 hover:bg-slate-100"
          }`
        }
      >
        <IoBarChartOutline size={20} />
        Statistics
      </NavLink>
    </div>
  );
}
