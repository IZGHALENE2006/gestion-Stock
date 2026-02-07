import React, { useState, useRef, useEffect } from 'react';
import { 
  IoBusinessOutline, 
  IoMailOutline, 
  IoCallOutline, 
  IoLocationOutline, 
  IoSaveOutline,
  IoInformationCircleOutline 
} from "react-icons/io5";
import { useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { AddFournisseur } from '../../slices/SliceFournisseur';
import cities from "./cities.json"

const VILLES_DATA = cities.cities.data.map(c => c.names.fr)

export default function AjouterFrn({ close }) { // Added close prop to match common modal behavior
  const Dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatalist, setShowDatalist] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    Ville: "",
    dateCreate: new Date(),
    status: true
  });

  const filteredVilles = VILLES_DATA.filter(ville => 
    ville.toLowerCase().includes(formData.Ville.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDatalist(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await Dispatch(AddFournisseur(formData)).unwrap();
      toast.success("Fournisseur ajouté avec succès");
      if(close) close(); // Auto close if prop provided
    } catch (err) {
      toast.error(err?.message || "Erreur lors de l'ajout");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = "w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none text-slate-700 dark:text-slate-100 font-semibold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all duration-300 shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-600";
  const labelStyle = "text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 block ml-1";

  return (
    <div className="p-1">
      <form className="space-y-6" onSubmit={handleSubmit}>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-500 mb-4 bg-emerald-50 dark:bg-emerald-500/10 w-fit px-4 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-500/20">
            <IoInformationCircleOutline size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              General Information
            </span>
          </div>

          {/* Nom */}
          <div className="relative group">
            <label className={labelStyle}>Establishment Name</label>
            <div className="relative mt-1">
              <IoBusinessOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 z-10" size={18} />
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputStyle}
                placeholder="Ex: Samsung Electronics"
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className={labelStyle}>Email Address</label>
              <div className="relative mt-1">
                <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 z-10" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputStyle}
                  placeholder="contact@company.com"
                />
              </div>
            </div>

            <div className="relative">
              <label className={labelStyle}>Phone Number</label>
              <div className="relative mt-1">
                <IoCallOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 z-10" size={18} />
                <input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={inputStyle}
                  placeholder="06 -- -- -- --"
                />
              </div>
            </div>
          </div>

          {/* City Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <label className={labelStyle}>Location (City)</label>
            <div className="relative mt-1">
              <IoLocationOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 z-10" size={18} />
              <input
                value={formData.Ville}
                onFocus={() => setShowDatalist(true)}
                onChange={(e) => {
                  setFormData({ ...formData, Ville: e.target.value });
                  setShowDatalist(true);
                }}
                className={inputStyle}
                placeholder="Search city..."
              />
              
              {showDatalist && filteredVilles.length > 0 && (
                <ul className="absolute z-[60] w-full mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl max-h-56 overflow-y-auto shadow-2xl animate-in slide-in-from-top-2 duration-200">
                  {filteredVilles.map((ville, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setFormData({ ...formData, Ville: ville });
                        setShowDatalist(false);
                      }}
                      className="px-5 py-3.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-3 transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-none"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      {ville}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-[2] py-4 px-6 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2
              ${isSubmitting 
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 hover:shadow-emerald-500/40'}`}
          >
            <IoSaveOutline size={18} />
            {isSubmitting ? "Processing..." : "Save Supplier"}
          </button>
        </div>
      </form>

      <Toaster position="top-right" />
    </div>
  );
}