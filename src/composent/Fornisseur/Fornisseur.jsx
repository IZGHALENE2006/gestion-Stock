import React, { useEffect, useRef, useState } from 'react';
import { 
  IoSearchOutline, IoAddOutline, IoPeopleOutline, 
  IoLocationOutline, 
  IoGridOutline, IoListOutline ,
  IoMailOutline,  
  IoCallOutline
} from "react-icons/io5";
import FrnCard from './FrnCard';
import AjouterFrn from './AjouterFrn.jsx';
import Dialog from '../Dialog/Dialog';
import { GetAllFournisseur,DeleteFournisseur, UpdateFournisseur } from "../../slices/SliceFournisseur.jsx";
import { useDispatch, useSelector } from 'react-redux';
import {  IoWarningOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cities from "./cities.json"
import { useNavigate } from 'react-router';
const Fornisseur = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState("grid"); // 'grid' or 'list'
const VILLES_DATA = cities.cities.data.map(c => c.names.fr)
    const dropdownRef = useRef(null);
  const { role, user, token } = useSelector((state) => state.LoginAdmin);
  
  const { Fournisseur,loading, error } = useSelector((state) => state.Fournisseur);
  const Dispatch = useDispatch();
const navigate = useNavigate()
  useEffect(() => {
    Dispatch(GetAllFournisseur());
  }, [Dispatch]);

  const filteredSuppliers = Fournisseur.filter(s => 
   s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
const [confirmOpen,setconfirmOpen] = useState(false)
const [idDelete,setIdDelete] = useState("")
  function HandleopenDelete(id){
   setIdDelete(id)
   setconfirmOpen(true)
  }
  
//Confireme delete 
function confirmDelete() {
  Dispatch(DeleteFournisseur(idDelete))
    .unwrap()
    .then(() => {
  toast.success(`Fournisseur supprimé avec succès `,{
    position:"top-right",
    duration:1000
  })
   setconfirmOpen(false);
    })
    .catch(() => {
      toast.error("Erreur lors de la suppression ");
    });
}
//ClosseDelete 
function cancelDelete(){
setconfirmOpen(false)
}
//Logic Edite 
//Get curent Value
const [selectedSupplier,setselectedSupplier] = useState({
     name: " ",
    email: "",
    phone: "",
    Ville: ""
})

  const [showDatalist, setShowDatalist] = useState(false);
    // Filter logic: find cities that include the typed text
      // Close dropdown when clicking outside
      useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDatalist(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);
  const filteredVilles = VILLES_DATA.filter(ville => 
    ville.toLowerCase().includes((selectedSupplier.Ville||"").toLowerCase())
  );
const [cureentUser,setCurrentUser] = useState({})


useEffect(()=>{
  setselectedSupplier({
   name: cureentUser.name,
    email: cureentUser.email,
    phone: cureentUser.phone,
    Ville: cureentUser.ville,
  })
},[cureentUser])
const [editOpen,setEditOpen] = useState(false)
const [IdUpdate,setIdUpdate] = useState("")
function HandleopenUpdate(id){
  setCurrentUser(Fournisseur.find((t)=>t._id == id))
  setIdUpdate(id)
  setEditOpen(true)
}
function  HandleUpdateFornisseur(){
  Dispatch(UpdateFournisseur({selectedSupplier,IdUpdate}))
  setEditOpen(false)
  
}
useEffect(() => {
  if (!token) {
    navigate("/LoginChoise");
  }
}, [token, navigate]);
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
                placeholder="Search by name..."
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
                <IoAddOutline size={20} /> New
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
              onEdit={() => HandleopenUpdate(f._id)} 
              onDelete={() => HandleopenDelete(f._id)} 
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
No supplier found
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
            {confirmOpen && (
              <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 w-full max-w-sm border border-slate-100 dark:border-slate-800 text-center transform animate-in zoom-in-95 duration-200">
                  <div className="mx-auto w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center text-rose-600 mb-6">
                    <IoWarningOutline size={32} />
                  </div>
                  
                  <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-2">
                              Deletion

                  </h2>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          Do you really want to delete this supplier? This action is irreversible.
                  </p>
      
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={confirmDelete}
                      className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-rose-600/20 transition-all active:scale-95"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={cancelDelete}
                      className="w-full py-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            <ToastContainer/>
            {/* Dialog for Editing Supplier */}
<Dialog 
  bgcolor={document.documentElement.classList.contains('dark') ? "#0f172a" : "#ffffff"}
  width="600px" 
  isOpen={editOpen} 
  onClose={() => setEditOpen(false)} 
  title="Modifier Fournisseur"
>
  <div className="animate-in fade-in zoom-in-95 duration-300 p-1">
    <div className="space-y-6">
      
      {/* SECTION: Basic Info */}
      <div className="relative group">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 block ml-1">
            Establishment Name
        </label>
        <div className="relative">
          <input 
            type="text" 
            value={selectedSupplier?.name}
            onChange={(e) => setselectedSupplier({...selectedSupplier, name: e.target.value})}
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 outline-none text-slate-700 dark:text-slate-100 font-semibold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all duration-300 shadow-sm"
            placeholder="Ex: Samsung Electronics"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
            <IoPeopleOutline className="text-emerald-500" size={20} />
          </div>
        </div>
      </div>

      {/* SECTION: Location & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ville with Modern Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 block ml-1">
Location (City)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600">
              <IoLocationOutline size={18} />
            </span>
            <input
              value={selectedSupplier.Ville}
              onFocus={() => setShowDatalist(true)}
              onChange={(e) => {
                setselectedSupplier({ ...selectedSupplier, Ville: e.target.value });
                setShowDatalist(true);
              }}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none text-slate-700 dark:text-slate-100 font-semibold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all duration-300"
              placeholder="Search..."
            />
          </div>
          
          {/* Enhanced Dropdown List */}
          {showDatalist && filteredVilles.length > 0 && (
            <div className="absolute z-[60] w-full mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl max-h-56 overflow-y-auto shadow-2xl shadow-emerald-900/10 animate-in slide-in-from-top-2 duration-200">
              {filteredVilles.map((ville, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setselectedSupplier({ ...selectedSupplier, Ville: ville });
                    setShowDatalist(false);
                  }}
                  className="px-5 py-3.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-3 transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-none"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                  {ville}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Téléphone */}
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 block ml-1">
Direct Contact
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600">
              <IoCallOutline size={18} />
            </span>
            <input 
              type="tel" 
              value={selectedSupplier.phone}
              onChange={(e) => setselectedSupplier({...selectedSupplier, phone: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none text-slate-700 dark:text-slate-100 font-semibold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all duration-300"
              placeholder="06 -- -- -- --"
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="relative">
        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 block ml-1">
         Professional Email Address
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600">
            <IoMailOutline size={18} />
          </span>
          <input 
            type="email" 
            value={selectedSupplier?.email}
            onChange={(e) => setselectedSupplier({...selectedSupplier, email: e.target.value})}
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none text-slate-700 dark:text-slate-100 font-semibold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all duration-300"
            placeholder="contact@company.com"
          />
        </div>
      </div>

      {/* ACTION BUTTONS: The Signature */}
      <div className="flex items-center gap-4 pt-6">
        <button
          onClick={() => setEditOpen(false)}
          className="flex-1 py-4 px-6 rounded-2xl text-slate-500 dark:text-slate-400 font-bold text-[11px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 bg-red-50"
        >
          Cancel
        </button>
        <button
          className="flex-[2] py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all active:scale-95 flex items-center justify-center gap-2"
          onClick={HandleUpdateFornisseur}
        >
          {loading ?'.....' :"Update Profile"}
        </button>
      </div>
    </div>
  </div>
</Dialog>
    </div>
  );
};

export default Fornisseur;