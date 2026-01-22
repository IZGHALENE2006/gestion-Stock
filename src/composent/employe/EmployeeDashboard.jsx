import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/dist/Draggable";
import { IoTrashOutline } from "react-icons/io5";
import { EmployeeCard } from "./EmployeeCard";
import EmployeeSearch from "./EmployeeSearch";
import { useDispatch, useSelector } from "react-redux";
import { DeleteEmploye, GetAllEmploye } from "../../slices/sliceEmploye";

gsap.registerPlugin(Draggable);

export const EmployeeDashboard = () => {
  const dispatch = useDispatch();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const containerRef = useRef(null);
  const deleteZoneRef = useRef(null);

  const { Employe } = useSelector((state) => state.Employe);

  useEffect(() => {
    dispatch(GetAllEmploye());
  }, [dispatch]);

  // ================= DELETE =================
  const confirmDelete = () => {
    if (!pendingDelete) return;

    gsap.to(pendingDelete.target, {
      scale: 0,
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        dispatch(DeleteEmploye(pendingDelete.id));
        setPendingDelete(null);
        setConfirmOpen(false);
      },
    });
  };

  const cancelDelete = () => {
    if (pendingDelete?.target) {
      gsap.to(pendingDelete.target, {
        x: 0,
        y: 0,
        scale: 1,
        rotate: "0deg",
        opacity: 1,
        duration: 0.4,
        ease: "elastic.out(1, 0.75)",
      });
      pendingDelete.target.style.zIndex = 1;
    }
    setPendingDelete(null);
    setConfirmOpen(false);
  };

  // ================= DRAG =================
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".card-wrapper");

      cards.forEach((card) => {
        Draggable.create(card, {
          type: "x,y",
          edgeResistance: 0.65,
          dragClickables: false,

          onDragStart() {
            gsap.to(deleteZoneRef.current, {
              scale: 1,
              opacity: 1,
              duration: 0.25,
            });
            this.target.style.zIndex = 50;
          },

          onDrag() {
            if (this.hitTest(deleteZoneRef.current, "50%")) {
              setDeleteOpen(true);
              gsap.to(this.target, {
                scale: 0.65,
                rotate: "20deg",
                opacity: 0.4,
              });
            } else {
              setDeleteOpen(false);
              gsap.to(this.target, {
                scale: 1,
                rotate: "0deg",
                opacity: 1,
              });
            }
          },

          onDragEnd() {
            gsap.to(deleteZoneRef.current, {
              scale: 0.85,
              opacity: 0.8,
              duration: 0.25,
            });

            if (this.hitTest(deleteZoneRef.current, "50%")) {
              setPendingDelete({
                id: this.target.dataset.id,
                target: this.target,
              });
              this.target.style.zIndex = 1;
              setConfirmOpen(true);
            } else {
              gsap.to(this.target, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.75)",
              });
              this.target.style.zIndex = 1;
            }
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [Employe]);

  return (
    <div className="min-h-screen bg-slate-50 ">
      {/* Search */}
      <div className="max-w-6xl mx-auto mb-6">
        <EmployeeSearch />
      </div>

      {/* Cards */}
      <div
        ref={containerRef}
        className="max-w-6xl mx-auto flex flex-wrap gap-10 justify-start"
      >
        {Employe.map((emp) => (
          <div key={emp._id} data-id={emp._id} className="card-wrapper">
            <EmployeeCard employee={emp} />
          </div>
        ))}
      </div>

      {/* Trash zone */}
      <div
        ref={deleteZoneRef}
        className={`fixed bottom-6 right-6 w-20 h-20 flex items-center justify-center rounded-full shadow-xl transition-all duration-300
          ${
            deleteOpen
              ? "bg-red-600 scale-100 opacity-100"
              : "bg-red-500 scale-90 opacity-80"
          }
        `}
      >
        <IoTrashOutline className="text-white text-3xl" />
      </div>

      {/* Confirm modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[340px]">
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Delete employee
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to permanently delete this employee?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
