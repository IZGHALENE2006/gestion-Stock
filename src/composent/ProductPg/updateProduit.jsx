import { useEffect, useState } from "react";
import {
  IoPricetagOutline,
  IoCubeOutline,
  IoCashOutline,
  IoSaveOutline,
  IoLayersOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { GetAllProduct, updateProduit } from "../../slices/SliceProduct";
import toast, { Toaster } from 'react-hot-toast';
import { GetAllFournisseur } from "../../slices/SliceFournisseur.jsx";

function UpdateProduit(props) {
  const dispatch = useDispatch();
  const { idupdate2, close } = props;
  const { Produts, loading } = useSelector((state) => state.Product);
  const { Category = [] } = useSelector((state) => state.category);
  const { Fournisseur } = useSelector((state) => state.Fournisseur);

  // --- Datalist State ---
  const [showDatalist, setShowDatalist] = useState(false);
  const fournisseursList = Fournisseur.map(f=>f.name)

  const currentproduit = Produts.find((t) => t._id == idupdate2);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (currentproduit) {
      setFormData({
        name: currentproduit.name,
        quantite: currentproduit.quantite,
        prix_achat: currentproduit.prix_achat,
        prix_vente: currentproduit.prix_vente,
        categorie: currentproduit.categorie,
        fournisseur: currentproduit.fournisseur,
      });
    }
  }, [currentproduit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Filter logic for datalist
  const filteredFournisseurs = fournisseursList.filter((f) =>
    formData?.fournisseur ? f.toLowerCase().includes(formData.fournisseur.toLowerCase()) : true
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProduit({ formData, idupdate2 })).unwrap();
      
      toast.success('Produit updated successfully', {
        duration: 3000,
        style: {
          border: '1px solid #10b981',
          padding: '16px',
          color: '#059669',
          backgroundColor: "var(--toast-bg, #ffffff)",
        },
      });
      dispatch(GetAllProduct()) 
      dispatch(GetAllFournisseur()) 
      close();
    } catch (err) {
      toast.error('Failed to update produit', {
        duration: 3000,
        style: {
          border: '1px solid #ef4444',
          padding: '16px',
          color: '#dc2626',
          backgroundColor: "var(--toast-bg, #ffffff)",
        },
      });
    }
  };

  if (!currentproduit || !formData) {
    return <p className="p-10 text-center font-bold text-emerald-500 animate-pulse">Chargement du produit...</p>;
  }

  const inputBaseStyle = `
    w-full pl-10 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 
    bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 
    focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all
  `;

  return (
    <div className="rounded-2xl shadow-xl p-1 w-full max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 🔹 Name */}
        <div>
          <label className="text-xs font-bold text-gray-500 dark:text-slate-400 mb-1.5 block uppercase tracking-wider">Nom du produit</label>
          <div className="relative group">
            <IoPricetagOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Clavier Gaming"
              className={inputBaseStyle}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 🔹 Quantité */}
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 mb-1.5 block uppercase tracking-wider">Quantité</label>
            <div className="relative group">
              <IoCubeOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="number"
                name="quantite"
                value={formData.quantite}
                onChange={handleChange}
                placeholder="0"
                className={inputBaseStyle}
              />
            </div>
          </div>

          {/* 🔹 Category */}
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 mb-1.5 block uppercase tracking-wider">Catégorie</label>
            <div className="relative group">
              <IoLayersOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <select
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                className={`${inputBaseStyle} appearance-none cursor-pointer`}
              >
                <option value='' className="dark:bg-slate-900">Sélectionner une catégorie</option>
                {Category.map((t) => (
                  <option key={t._id} value={t._id} className="dark:bg-slate-900">{t.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 🔹 Prices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 mb-1.5 block uppercase tracking-wider">Prix d'achat</label>
            <div className="relative group">
              <IoCashOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="number"
                step="0.01"
                name="prix_achat"
                value={formData.prix_achat}
                onChange={handleChange}
                className={inputBaseStyle}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 mb-1.5 block uppercase tracking-wider">Prix de vente</label>
            <div className="relative group">
              <IoCashOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="number"
                step="0.01"
                name="prix_vente"
                value={formData.prix_vente}
                onChange={handleChange}
                className={inputBaseStyle}
              />
            </div>
          </div>
        </div>

        {/* 🔹 Fournisseur with Datalist */}
        <div className="relative">
          <label className="text-xs font-bold text-gray-500 dark:text-slate-400 mb-1.5 block uppercase tracking-wider">Fournisseur</label>
          <div className="relative group">
            <IoPeopleOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
                name="fournisseur"
                value={formData.fournisseur}
                onFocus={() => setShowDatalist(true)}
                onBlur={() => setTimeout(() => setShowDatalist(false), 200)}
                onChange={handleChange}
                placeholder="Nom du fournisseur"
                className={inputBaseStyle}
                autoComplete="off"
              />
          </div>

          {showDatalist && filteredFournisseurs.length > 0 && (
            <ul className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl max-h-40 overflow-y-auto shadow-2xl">
              {filteredFournisseurs.map((fourn, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setFormData({ ...formData, fournisseur: fourn });
                    setShowDatalist(false);
                  }}
                  className="px-4 py-2.5 hover:bg-emerald-600 hover:text-white cursor-pointer text-sm border-b border-gray-100 dark:border-slate-700/50 last:border-none transition-colors text-gray-700 dark:text-slate-200"
                >
                  {fourn}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🔹 Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2
          ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98]'}
          text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20`}
        >
          <IoSaveOutline size={20} />
          {loading ? "Mise à jour..." : "Enregistrer les modifications"}
        </button>
      </form>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default UpdateProduit;