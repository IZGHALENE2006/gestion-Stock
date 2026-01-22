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
    <div className="min-h-screen bg-gray-100 dark:bg-[#1e293b] p-6 lg:p-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          
          {/* Stats Card */}
          <div className=" 
              flex-1 p-6 rounded-l-[2.5rem] transition-all duration-500 border flex items-center gap-5 group
              shadow-sm hover:shadow-xl hover:-translate-y-2 
              /* Light Mode */
              bg-linear-to-br ${gradientLight} shadow-lg border-gray-300
              
              /* Dark Mode */
              dark:bg-none dark:bg-slate-900/40 dark:border-slate-700 dark:shadow-noneitems-center gap-5">
            <div className="p-4 rounded-[1.8rem] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">
              <IoPeopleOutline size={32} />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                Total Fournisseurs
              </p>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                {Fournisseur.length}
              </h1>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="
              flex-2 p-6 rounded-r-[2.5rem] transition-all duration-500 border flex items-center gap-5 group
              shadow-sm hover:shadow-xl 
              /* Light Mode */
              bg-linear-to-br ${gradientLight} shadow-lg border-gray-300
              
              /* Dark Mode */
              dark:bg-none dark:bg-slate-900/40 dark:border-slate-700 dark:shadow-noneitems-center gap-5          ">
            <div className="relative flex-1 w-full group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <IoSearchOutline size={20} />
              </span>
              <input
                type="text"
                placeholder="Rechercher par nom..."
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 outline-none text-slate-700 dark:text-slate-200 font-bold text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* TOGGLE VIEW SWITCH */}
              <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button 
                  onClick={() => setViewType('grid')}
                  className={`p-2.5 rounded-xl transition-all ${viewType === 'grid' ? 'bg-white dark:bg-slate-700 shadow-md text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                >
                  <IoGridOutline size={20} />
                </button>
                <button 
                  onClick={() => setViewType('list')}
                  className={`p-2.5 rounded-xl transition-all ${viewType === 'list' ? 'bg-white dark:bg-slate-700 shadow-md text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                >
                  <IoListOutline size={20} />
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={() => setOpen(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
              >
                <IoAddOutline size={20} /> Nouveau
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className={viewType === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
          : "flex flex-col gap-4"}
        >
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

        {/* Empty State */}
        {filteredSuppliers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-full">
                <IoSearchOutline size={40} className="text-slate-300 dark:text-slate-700" />
              </div>
              <p className="text-slate-400 dark:text-slate-600 font-black uppercase text-[10px] tracking-[0.3em]">
                Aucun fournisseur trouvé
              </p>
          </div>
        )}
      </div>

      {/* Dialog for adding Supplier */}
      <Dialog 
        bgcolor={document.documentElement.classList.contains('dark') ? "#0f172a" : "#ffffff"}
        width="600px" 
        isOpen={open} 
        onClose={() => setOpen(false)} 
        title="Ajouter Fournisseur"
      >
        <div className="animate-in zoom-in-95 duration-300">
          <AjouterFrn close={() => setOpen(false)} />
        </div>
      </Dialog>
    </div>
  );
};

export default Fornisseur;