import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/dist/Draggable";
import { IoTrashOutline, IoWarningOutline } from "react-icons/io5";
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

  // ================= DELETE LOGIC =================
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

  // ================= GSAP DRAG INTERACTION =================
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
              scale: 1.1,
              opacity: 1,
              duration: 0.25,
            });
            this.target.style.zIndex = 50;
          },

          onDrag() {
            if (this.hitTest(deleteZoneRef.current, "50%")) {
              setDeleteOpen(true);
              gsap.to(this.target, {
                scale: 0.5,
                rotate: "15deg",
                opacity: 0.5,
                duration: 0.2,
              });
            } else {
              setDeleteOpen(false);
              gsap.to(this.target, {
                scale: 1,
                rotate: "0deg",
                opacity: 1,
                duration: 0.2,
              });
            }
          },

          onDragEnd() {
            gsap.to(deleteZoneRef.current, {
              scale: 1,
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
                ease: "power2.out",
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
    <div className="min-h-screen transition-colors duration-300 pb-20 ">
      {/* Header / Search Section */}
      <div className="px-6 md:px-12 mx-auto mb-8">
        <EmployeeSearch />
      </div>

      {/* Cards Grid Container */}
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto flex flex-wrap gap-8 justify-center md:justify-start px-6"
      >
        {Employe.length > 0 ? (
          Employe.map((emp) => (
            <div key={emp._id} data-id={emp._id} className="card-wrapper cursor-grab active:cursor-grabbing z-0">
              <EmployeeCard employee={emp} />
            </div>
          ))
        ) : (
          <div className="w-full py-20 text-center font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">
            Aucun employé trouvé
          </div>
        )}
      </div>

      {/* Dynamic Trash Zone */}
      <div
        ref={deleteZoneRef}
        className={`fixed bottom-10 right-10 w-24 h-24 flex flex-col items-center justify-center rounded-full shadow-2xl transition-all duration-300 z-100
          ${
            deleteOpen
              ? "bg-rose-600 scale-110 opacity-100 ring-4 ring-rose-500/20"
              : "bg-slate-800 dark:bg-rose-800 scale-90 opacity-40 hover:opacity-100"
          }
        `}
      >
        <IoTrashOutline className="text-white text-3xl mb-1" />
      </div>

      {/* Confirm Emerald/Dark Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 w-full max-w-sm border border-slate-100 dark:border-slate-800 text-center transform animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center text-rose-600 mb-6">
              <IoWarningOutline size={32} />
            </div>
            
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-2">
              Suppression
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Voulez-vous vraiment supprimer cet employé ? Cette action est irréversible.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-rose-600/20 transition-all active:scale-95"
              >
                Confirmer
              </button>
              <button
                onClick={cancelDelete}
                className="w-full py-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};