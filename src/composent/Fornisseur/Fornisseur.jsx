import React, { useEffect, useState } from 'react';
import { 
  IoSearchOutline, 
  IoAddOutline, 
  IoPeopleOutline, 
} from "react-icons/io5";
import FrnCard from './FrnCard';
import AjouterFrn from './AjouterFrn.jsx';
import Dialog from '../Dialog/Dialog';
import { DeleteFournisseur, GetAllFournisseur } from "../../slices/SliceFournisseur.jsx";
import { useDispatch, useSelector } from 'react-redux';


const Fornisseur = () => {
  const [open , setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const { Fournisseur } = useSelector((state) => state.Fournisseur);
  console.log(Fournisseur);
  
  const Dispatch =  useDispatch();
  useEffect(() => {
    Dispatch(GetAllFournisseur());
  }, [Dispatch]);

  const filteredSuppliers = Fournisseur.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 lg:p-10 text-slate-200">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          
          <div className="flex-1 min-w-[280px] p-6 rounded-2xl bg-[#1e293b] border border-slate-700 shadow-2xl flex items-center gap-5 group hover:border-blue-500/50 transition-all">
            <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <IoPeopleOutline size={32} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Fournisseurs</p>
              <h1 className="text-4xl font-black text-white">{Fournisseur.length}</h1>
            </div>
          </div>

          <div className="flex-[2] flex flex-col md:flex-row items-center gap-4 bg-[#1e293b] border border-slate-700 rounded-2xl p-4 shadow-xl">
            <div className="relative flex-1 w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <IoSearchOutline size={20} />
              </span>
              <input
                type="text"
                placeholder="Rechercher un fournisseur..."
                className="w-full bg-[#0f172a] border border-slate-600 rounded-xl py-3 pl-12 pr-4 outline-none text-white focus:border-blue-500 transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

              <button
                onClick={() => setOpen(true)}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#2C74B3] hover:bg-blue-500 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/20"
              >
                <IoAddOutline size={22} />
                <span>Nouveau</span>
              </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSuppliers.map(f => (
            <FrnCard 
              key={f.id} 
              supplier={f} 
              onEdit={() => console.log("Edit", f.id)} 
              onDelete={() => console.log("Delete", f.id)} 
            />
          ))}
        </div>

        {filteredSuppliers.length === 0 && (
          <div className="text-center py-20 opacity-50 font-medium">
            Aucun fournisseur trouvé pour "{searchTerm}"
          </div>
        )}
      </div>
        <Dialog bgcolor={"#0f172a"} width="550px" isOpen={open} onClose={() => setOpen(false)} title="Ajouter nouveau Fournisseur">
              <AjouterFrn />
        </Dialog>
      
    </div>
  );
};

export default Fornisseur;