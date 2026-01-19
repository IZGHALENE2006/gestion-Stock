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
import cities from "./Cities.json"

// Your list of cities
const VILLES_DATA = cities.cities.data.map(city => city.names.fr);

export default function AjouterFrn() {
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

  // Filter logic: find cities that include the typed text
  const filteredVilles = VILLES_DATA.filter(ville => 
    ville.toLowerCase().includes(formData.Ville.toLowerCase())
  );

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await Dispatch(AddFournisseur(formData)).unwrap();
      setFormData({
        name: "", email: "", phone: "", Ville: "",
        dateCreate: new Date(), status: true
      });
      toast.success("Fournisseur ajouté avec succès");
    } catch (err) {
      toast.error(err?.message || "Erreur lors de l'ajout");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-white p-2">
      <form className="space-y-6" onSubmit={handleSubmit}>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <IoInformationCircleOutline size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">
              Informations Générales
            </span>
          </div>

          {/* Nom */}
          <div className="relative group">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
              Nom du Fournisseur
            </label>
            <div className="relative mt-1">
              <IoBusinessOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500"
                placeholder="Ex: Global Tech SARL"
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
              <div className="relative mt-1">
                <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500"
                  placeholder="contact@fournisseur.com"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Téléphone</label>
              <div className="relative mt-1">
                <IoCallOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500"
                  placeholder="+212 6..."
                />
              </div>
            </div>
          </div>

          {/* Custom Searchable Input (Datalist Replacement) */}
          <div className="relative" ref={dropdownRef}>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
              Ville
            </label>
            <div className="relative mt-1">
              <IoLocationOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
              <input
                value={formData.Ville}
                onFocus={() => setShowDatalist(true)}
                onChange={(e) => {
                  setFormData({ ...formData, Ville: e.target.value });
                  setShowDatalist(true);
                }}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500"
                placeholder="Rechercher une ville..."
              />
              
              {/* Custom Dropdown List */}
              {showDatalist && filteredVilles.length > 0 && (
                <ul className="absolute z-50 w-full mt-2 bg-[#1e293b] border border-slate-700 rounded-xl max-h-48 overflow-y-auto shadow-2xl">
                  {filteredVilles.map((ville, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setFormData({ ...formData, Ville: ville });
                        setShowDatalist(false);
                      }}
                      className="px-4 py-3 hover:bg-blue-600 cursor-pointer text-sm border-b border-slate-700/50 last:border-none transition-colors"
                    >
                      {ville}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-700/50">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black transition-all
              ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#2C74B3] hover:bg-blue-500 active:scale-95'}`}
          >
            <IoSaveOutline size={20} />
            {isSubmitting ? "ENREGISTREMENT..." : "ENREGISTRER LE FOURNISSEUR"}
          </button>
        </div>
      </form>

      <Toaster position="top-right" />
    </div>
  );
}