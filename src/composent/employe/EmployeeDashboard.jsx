import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/dist/Draggable';
import { IoTrashOutline } from "react-icons/io5";
import { EmployeeCard } from "./EmployeeCard";
import "./emp.css"
import EmployeeSearch from "./EmployeeSearch"
import { useDispatch, useSelector } from 'react-redux';
import { GetAllEmploye } from '../../slices/sliceEmploye';
gsap.registerPlugin(Draggable);

export const EmployeeDashboard = () => {
  
  const [deleteopen , setdeleteopen] = useState(false)
//Get Dispatch
 const dispatch = useDispatch()
//get state 

useEffect(()=>{
  dispatch(GetAllEmploye())
},[dispatch])
//List Enploye
const {Employe} = useSelector((state)=>state.Employe)

// map ayoube {Employe}

//Logic delete 
const [iddelete,setiddelete] = useState("")
function Handelegetiddletecard(id){
setiddelete(id)
}
console.log(iddelete);

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
              
            } else {
              gsap.to(this.target, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.75)" });
              card.style.zIndex = 1;

            }
          }
        });
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, [Employe]);

  const handleDelete = (id) => {
    const target = containerRef.current.querySelector(`[data-id='${id}']`);
    gsap.to(target, { scale: 0, opacity: 0, duration: 0.3, onComplete: () => {
      setEmployees(prev => prev.filter(emp => emp.id !== parseInt(id)));
    }});
  };

  return (
    







    <div className="flex flex-col items-center p-2">
      
      <EmployeeSearch />

    

      <div 
        ref={containerRef} 
        className="flex flex-wrap justify-center gap-8 max-w-6xl w-full"
      >
        {Employe.map((emp) => (
          <div key={emp.id} className="card-wrapper" data-id={emp.id} onClick={()=>Handelegetiddletecard(emp._id)}>
             <EmployeeCard employee={emp} />
          </div>
        ))}
      </div>

      <div 
      id='deletezone'
        ref={deleteZoneRef} 
        className="fixed p-5 -bottom-45 -right-45 w-70 h-70 flex items-end justify-end opacity-0 transition-colors pointer-events-none"
      >
        {deleteopen ? <IoTrashOutline size={30} color="white" />: <IoTrashOutline size={35} color="white" />}
      </div>
    </div>
  );
};