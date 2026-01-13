import React, { useState, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/dist/Draggable';
import { IoTrashOutline } from "react-icons/io5";
import { EmployeeCard } from "./EmployeeCard";
import "./emp.css"
gsap.registerPlugin(Draggable);

export const EmployeeDashboard = () => {
  const [deleteopen , setdeleteopen] = useState(false)


  const [employees, setEmployees] = useState([
    { id: 1, name: "Alice Zhang", age: 28 },
    { id: 2, name: "Bob Smith", age: 34 },
    { id: 3, name: "Charlie Day", age: 41 },
    { id: 4, name: "Diana Prince", age: 30 },
  ]);

  const containerRef = useRef(null);
  const deleteZoneRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".card-wrapper");
      
      cards.forEach((card) => {
        Draggable.create(card, {
          type: "x,y",
          edgeResistance: 0.5,
          dragClickables: false, 
          onDragStart: () => {
            gsap.to(deleteZoneRef.current, { scale: 1, opacity: 1, duration: 0.3, rig : "0px", bottom : "0px" , right : "0px" });
            card.style.zIndex = 50;
          },
          onDrag: function() {
            if (this.hitTest(deleteZoneRef.current, "50%")) {
              gsap.to(deleteZoneRef.current, {  scale: 1});
              setdeleteopen(false)
              gsap.to(this.target,{
                scale : 0.6,
                rotate : "30deg",
                opacity : .3
              })
            } else {
              gsap.to(deleteZoneRef.current, {  scale: 1  });
              setdeleteopen(true)

              gsap.to(this.target,{
                scale : 1,
                rotate : "0deg",
                opacity : 1

              })
            }
          },
          onDragEnd: function() {
            gsap.to(deleteZoneRef.current, { bottom : "-65px" , right : "-65px", opacity : 0});
            
            if (this.hitTest(deleteZoneRef.current, "50%")) {
              handleDelete(this.target.getAttribute('data-id'));
              
              // Back End (Maehdi)
              console.log(this.target.getAttribute('data-'));
              
            } else {
              gsap.to(this.target, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.75)" });
              card.style.zIndex = 1;
            }
          }
        });
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, [employees]);

  const handleDelete = (id) => {
    const target = containerRef.current.querySelector(`[data-id='${id}']`);
    gsap.to(target, { scale: 0, opacity: 0, duration: 0.3, onComplete: () => {
      setEmployees(prev => prev.filter(emp => emp.id !== parseInt(id)));
    }});
  };

  return (
    <div className="min-h-screen bg-[#1e293b] flex flex-col items-center py-12 px-6">
      
      <div 
        ref={containerRef} 
        className="flex flex-wrap justify-center gap-8 max-w-6xl w-full"
      >
        {employees.map((emp) => (
          <div key={emp.id} className="card-wrapper" data-id={emp.id}>
             <EmployeeCard employee={emp} />
          </div>
        ))}
      </div>

      <div 
      id='deletezone'
        ref={deleteZoneRef} 
        className="fixed p-5 -bottom-45 -right-45 w-100 h-100 flex items-end justify-end opacity-0 transition-colors pointer-events-none"
      >
        {deleteopen ? <IoTrashOutline size={30} color="white" />: <IoTrashOutline size={35} color="white" />}
      </div>
    </div>
  );
};