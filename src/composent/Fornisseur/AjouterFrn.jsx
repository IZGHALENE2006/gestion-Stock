import React, { useState } from 'react';
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

export default function AjouterFrn() {
  const Dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateCreate: new Date(),
    status: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await Dispatch(AddFournisseur(formData)).unwrap();

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        dateCreate: new Date(),
        status: true
      });

      toast.success("Fournisseur ajouté avec succès", {
        style: {
          border: '1px solid #00d435',
          padding: '16px',
          color: '#00d435',
          backgroundColor: "#fffffe",
        }
      });

    } catch (err) {
      toast.error(err?.message || "Erreur lors de l'ajout", {
        style: {
          border: '1px solid #e22620',
          padding: '16px',
          color: '#e22620',
          backgroundColor: "#fffffe",
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-white p-2">
      <form className="space-y-6" onSubmit={handleSubmit}>

        {/* Infos */}
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
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Email
              </label>
              <div className="relative mt-1">
                <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-3 pl-12 pr-4"
                  placeholder="contact@fournisseur.com"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Téléphone
              </label>
              <div className="relative mt-1">
                <IoCallOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-3 pl-12 pr-4"
                  placeholder="+212 6..."
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="relative">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
              Adresse
            </label>
            <div className="relative mt-1">
              <IoLocationOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-3 pl-12 pr-4"
                placeholder="Ville, Pays"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-700/50">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black transition-all
              ${isSubmitting ? 'bg-gray-500' : 'bg-[#2C74B3] hover:bg-blue-500 active:scale-95'}`}
          >
            <IoSaveOutline size={20} />
            {isSubmitting ? "ENREGISTREMENT..." : "ENREGISTRER LE FOURNISSEUR"}
          </button>
        </div>
      </form>

      <Toaster />
    </div>
  );
}
