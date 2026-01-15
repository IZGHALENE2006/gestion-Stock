import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/dist/Draggable';
import { IoTrashOutline } from "react-icons/io5";
import { EmployeeCard } from "./EmployeeCard";
import "./emp.css";
import EmployeeSearch from "./EmployeeSearch";
import { useDispatch, useSelector } from 'react-redux';
import { DeleteEmploye, GetAllEmploye } from '../../slices/sliceEmploye';

gsap.registerPlugin(Draggable);

export const EmployeeDashboard = () => {
  const dispatch = useDispatch();

  
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const containerRef = useRef(null);
  const deleteZoneRef = useRef(null);

  const { Employe } = useSelector(state => state.Employe);

  useEffect(() => {
    dispatch(GetAllEmploye());
  }, [dispatch]);

  function confirmDelete() {
    if (!pendingDelete) return;
    gsap.to(pendingDelete.target, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        dispatch(DeleteEmploye(pendingDelete.id));
        setPendingDelete(null);
        setConfirmOpen(false);
      },
    });
  }

  function cancelDelete() {
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
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".card-wrapper");

      cards.forEach(card => {
        Draggable.create(card, {
          type: "x,y",
          edgeResistance: 0.5,
          dragClickables: false,
          onDragStart: function () {
            gsap.to(deleteZoneRef.current, {
              scale: 1,
              opacity: 1,
              duration: 0.3
            });
            this.target.style.zIndex = 50;
          },
          onDrag: function () {
            if (this.hitTest(deleteZoneRef.current, "50%")) {
              setDeleteOpen(false);
              gsap.to(this.target, { scale: 0.6, rotate: "30deg", opacity: 0.3 });
            } else {
              setDeleteOpen(true);
              gsap.to(this.target, { scale: 1, rotate: "0deg", opacity: 1 });
            }
          },
          onDragEnd: function () {
            gsap.to(deleteZoneRef.current, { scale: 0.75, opacity: 0.7, duration: 0.3 });

            if (this.hitTest(deleteZoneRef.current, "50%")) {
              // Store pending delete and open modal
              setPendingDelete({
                id: this.target.getAttribute("data-id"),
                target: this.target
              });
              this.target.style.zIndex = 1;
              setConfirmOpen(true);
            } else {
              gsap.to(this.target, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.75)"
              });
              this.target.style.zIndex = 1;
            }
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [Employe]);

  return (
    <div className="flex flex-col items-center p-4">
      <EmployeeSearch />

      {/* Employee cards */}
      <div ref={containerRef} className="flex flex-wrap justify-center gap-8 max-w-6xl w-full">
        {Employe.map(emp => (
          <div key={emp._id} className="card-wrapper" data-id={emp._id}>
            <EmployeeCard employee={emp} />
          </div>
        ))}
      </div>

      {/* Trash zone */}
      <div
        ref={deleteZoneRef}
        className={`fixed bottom-5 right-5 w-20 h-20 flex items-center justify-center bg-red-600 rounded-full text-white text-2xl shadow-lg transition-all duration-300 ${deleteOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-70'}`}
      >
        <IoTrashOutline />
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[320px] text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Delete Employee</h2>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this employee?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
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
