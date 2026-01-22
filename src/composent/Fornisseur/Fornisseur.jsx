import React, { useEffect, useState } from 'react';
import { 
  IoSearchOutline, IoAddOutline, IoPeopleOutline, 
  IoGridOutline, IoListOutline 
} from "react-icons/io5";
import FrnCard from './FrnCard';
import AjouterFrn from './AjouterFrn.jsx';
import Dialog from '../Dialog/Dialog';
import { GetAllFournisseur } from "../../slices/SliceFournisseur.jsx";
import { useDispatch, useSelector } from 'react-redux';

const Fornisseur = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState("grid"); // 'grid' or 'list'
  
  const { Fournisseur } = useSelector((state) => state.Fournisseur);
  const Dispatch = useDispatch();

  useEffect(() => {
    Dispatch(GetAllFournisseur());
  }, [Dispatch]);

  const filteredSuppliers = Fournisseur.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          <div className="flex-1 min-w-[280px] p-6 rounded-[2.5rem] bg-white border border-[#e2e8f0] shadow-sm flex items-center gap-5">
            <div className="p-4 rounded-[1.8rem] bg-indigo-50 text-indigo-500">
              <IoPeopleOutline size={32} />
            </div>
            <div>
              <p className="text-[#64748b] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Fournisseurs</p>
              <h1 className="text-3xl font-black text-[#0f172a]">{Fournisseur.length}</h1>
            </div>
          </div>

          <div className="flex-[2] flex flex-col md:flex-row items-center gap-4 bg-white border border-[#e2e8f0] rounded-[2.5rem] p-4 shadow-sm">
            <div className="relative flex-1 w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]">
                <IoSearchOutline size={20} />
              </span>
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl py-3 pl-12 pr-4 outline-none text-[#334155] font-bold text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* TOGGLE VIEW SWITCH */}
            <div className="flex bg-[#f8fafc] p-1 rounded-xl border border-[#e2e8f0]">
               <button 
                onClick={() => setViewType('grid')}
                className={`p-2 rounded-lg transition-all ${viewType === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
               >
                 <IoGridOutline size={20} />
               </button>
               <button 
                onClick={() => setViewType('list')}
                className={`p-2 rounded-lg transition-all ${viewType === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
               >
                 <IoListOutline size={20} />
               </button>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
            >
              <IoAddOutline size={20} /> Nouveau
            </button>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className={viewType === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-2"}>
          {filteredSuppliers.map(f => (
            <FrnCard 
              key={f.id} 
              supplier={f} 
              viewType={viewType}
              onEdit={() => console.log("Edit", f.id)} 
              onDelete={() => console.log("Delete", f.id)} 
            />
          ))}
        </div>

        {filteredSuppliers.length === 0 && (
          <div className="text-center py-24 text-[#64748b] font-bold uppercase text-xs tracking-widest opacity-40">
             Aucun résultat trouvé
          </div>
        )}
      </div>

      <Dialog bgcolor={"#FFFFFF"} width="550px" isOpen={open} onClose={() => setOpen(false)} title="Ajouter Fournisseur">
          <AjouterFrn close={() => setOpen(false)} />
      </Dialog>
    </div>
  );
};

export default Fornisseur;