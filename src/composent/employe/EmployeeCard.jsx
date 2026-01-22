import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { UpdateEmploye } from "../../slices/sliceEmploye";
import toast, { Toaster } from "react-hot-toast";
import {
  IoPencil,
  IoEyeOutline,
  IoEyeOffOutline,
  IoCallOutline,
  IoMailOutline,
  IoFingerPrintOutline,
  IoCalendarOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

export const EmployeeCard = ({ employee }) => {
  const dispatch = useDispatch();
  const innerRef = useRef(null);

  const employeeFromRedux = useSelector((state) =>
    state.Employe.Employe.find((emp) => emp._id === employee._id)
  );

  const [newinfoEmp, setNewInfoEmp] = useState(employeeFromRedux || employee);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (employeeFromRedux) setNewInfoEmp(employeeFromRedux);
  }, [employeeFromRedux]);

  const { loading } = useSelector((state) => state.Employe);

  // ================= UPDATE =================
  const HandleUpdateEmploye = (id) => {
    dispatch(UpdateEmploye({ id, newinfoEmp }))
      .unwrap()
      .then(() => {
        toast.success("Employé mis à jour avec succès");
        setIsFlipped(false);
        gsap.to(innerRef.current, {
          rotateY: 0,
          duration: 0.6,
          ease: "power2.inOut",
        });
      })
      .catch(() => toast.error("Erreur serveur"));
  };

  // ================= FLIP =================
  const toggleFlip = (e) => {
    e.stopPropagation();
    const rotation = isFlipped ? 0 : 180;
    gsap.to(innerRef.current, {
      rotateY: rotation,
      duration: 0.6,
      ease: "power2.inOut",
    });
    setIsFlipped(!isFlipped);
  };

  const togglePassword = (e) => {
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-72 h-[420px]" style={{ perspective: "1000px" }}>
      <div
        ref={innerRef}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* ================= FRONT ================= */}
        <div
          className="absolute inset-0 bg-white border border-slate-200 shadow-xl rounded-3xl p-6 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div
                className="w-12 h-1.5 rounded-full"
                style={{ backgroundColor: employee.color }}
              />
              <div className="flex items-center gap-1">
                {employee.isActive ? (
                  <IoCheckmarkCircleOutline className="text-green-500" />
                ) : (
                  <IoCloseCircleOutline className="text-red-500" />
                )}
                <span
                  className={`text-[10px] font-bold ${
                    employee.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {employee.isActive ? "ACTIVE" : "OFFLINE"}
                </span>
              </div>
            </div>

            {/* Name */}
            <h3 className="text-slate-900 font-bold text-xl flex items-center gap-2">
              <IoPersonOutline style={{ color: employee.color }} />
              {employee.name}
            </h3>

            <p
              className="text-xs font-semibold ml-7 mb-6 uppercase tracking-wider"
              style={{ color: employee.color }}
            >
              {employee.role}
            </p>

            {/* Infos */}
            <div className="space-y-4 mt-6">
              <div className="flex items-center gap-3 text-slate-700">
                <IoMailOutline className="text-slate-400" />
                <span className="text-xs truncate">{employee.email}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-700">
                <IoCallOutline className="text-slate-400" />
                <span className="text-xs">{employee.phone}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-700">
                <IoFingerPrintOutline className="text-slate-400" />
                <span className="text-xs font-mono">
                  {employee.cin.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="space-y-4">
            {/* Password */}
            <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-slate-500 font-bold uppercase">
                  Access Key
                </span>
                <div className="text-xs font-mono text-slate-800">
                  {showPassword ? employee.password : "••••••••"}
                </div>
              </div>
              <button
                onClick={togglePassword}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            </div>

            {/* Date + Edit */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-500">
                <IoCalendarOutline size={14} />
                <span className="text-[11px] font-semibold">
                  {new Date(employee.datecreate).toLocaleDateString("fr-FR")}
                </span>
              </div>

              <button
                onClick={toggleFlip}
                className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl border border-slate-200 text-slate-700"
              >
                <IoPencil />
              </button>
            </div>
          </div>
        </div>

        {/* ================= BACK ================= */}
        <div
          className="absolute inset-0 bg-white border border-slate-200 rounded-3xl p-6 shadow-xl"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-700 mb-6">
            Update Profile
          </h4>

          <div className="space-y-4">
            {["name", "email", "phone", "cin", "password"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.toUpperCase()}
                value={newinfoEmp[field]}
                onChange={(e) =>
                  setNewInfoEmp({ ...newinfoEmp, [field]: e.target.value })
                }
                className="w-full border-b-2 border-slate-200 py-1 text-sm font-semibold outline-none focus:border-slate-900"
              />
            ))}
          </div>

          <button
            onClick={() => HandleUpdateEmploye(employee._id)}
            className="mt-6 w-full py-3 rounded-2xl text-xs font-bold text-white shadow-md hover:brightness-105"
            style={{ backgroundColor: employee.color }}
          >
            {loading ? "CONFIRMING..." : "CONFIRM CHANGES"}
          </button>
        </div>
      </div>

      <Toaster />
    </div>
  );
};
