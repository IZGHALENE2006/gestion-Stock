import { useState, useEffect } from "react";
import { IoBarcodeOutline, IoSaveOutline, IoPricetagOutline, IoCubeOutline, IoBusinessSharp, IoLayersOutline, IoRefreshOutline } from "react-icons/io5";
import { AddProduct, GetAllProduct } from "../../slices/SliceProduct";
import { useDispatch, useSelector } from "react-redux";
import { GetAllCatefory } from "../../slices/SilceCategory";
import Barcode from "react-barcode"; 
import toast, { Toaster } from 'react-hot-toast';
import { GetAllEmploye } from "../../slices/sliceEmploye";
import { GetAllFournisseur } from "../../slices/SliceFournisseur.jsx";


// Barcode logic
const generateEAN13 = () => {
  let code = "6"; 
  for (let i = 0; i < 11; i++) {
    code += Math.floor(Math.random() * 10);
  }
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(code[i]) * (i % 2 === 0 ? 1 : 3);
  }
  const checksum = (10 - (sum % 10)) % 10;
  return code + checksum;
};

// Input Wrapper with Dark Mode and Emerald Focus
const InputWrapper = ({ label, children, icon: Icon, action }) => (
  <div className="flex flex-col flex-1 mb-4 group">
    <label className="text-sm font-semibold text-gray-600 dark:text-slate-400 mb-1 flex justify-between">
      {label}
      {action}
    </label>
    <div className="relative flex items-center">
      {children}
      <div className="absolute right-3 flex items-center pointer-events-none text-gray-400 dark:text-slate-500 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors">
        <Icon size={18} />
      </div>
    </div>
  </div>
);

export default function AddProductForm() {
  
  const { Fournisseur } = useSelector((state) => state.Fournisseur);
  const Dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Datalist States & Data ---
  const [showDatalist, setShowDatalist] = useState(false);
  const fournissecursArray = Fournisseur.map(e=>e.name);
  const [formData, setFormData] = useState(() => ({
    name: "",
    quantite: "",
    barcode: generateEAN13(), 
    prix_achat: "",
    prix_vente: "",
    categorie: "",
    fournisseur: "",
    datecreate: new Date(),
    status: true
  }));

  const { Category = [] } = useSelector((state) => state.category);

  useEffect(() => {
    Dispatch(GetAllCatefory());
    Dispatch(GetAllFournisseur());
  }, [Dispatch]);

  // Filter Logic
  const filteredFournisseurs = fournisseursArray.filter((f) =>
    f.toLowerCase().includes(formData.fournisseur.toLowerCase())
  );

  const HandlegetCategort = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, categorie: val}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await Dispatch(AddProduct(formData)).unwrap();

      setFormData({
        name: "",
        prix_achat: "",
        prix_vente: "",
        categorie: "",
        quantite: "",
        barcode: generateEAN13(),
        fournisseur: "",
        datecreate: new Date(),
        status: true
      });
    
      toast.success('Product Added Successfully', {
        style: {
          border: '1px solid #10b981',
          padding: '16px',
          color: '#059669',
          backgroundColor: "#ffffff",
        },
        iconTheme: { primary: '#10b981', secondary: '#fff' },
      });
        Dispatch(GetAllProduct()) 

    } catch (err) {
      toast.error(err?.message || 'Failed to add product.', {
        style: {
          border: '1px solid #ef4444',
          padding: '16px',
          color: '#dc2626',
          backgroundColor: "#ffffff",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const profit = (Number(formData.prix_vente) - Number(formData.prix_achat)).toFixed(2);
  const inputStyles = "w-full border p-2.5 pr-10 rounded-xl border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm";

  return (
    <div className="mx-auto rounded-2xl p-6 max-w-4xl">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          
          <InputWrapper label="Product Name" icon={IoCubeOutline}>
            <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Laptop Pro" className={inputStyles} />
          </InputWrapper>

          <InputWrapper label="Stock Quantity" icon={IoSaveOutline}>
            <input type="number" value={formData.quantite} onChange={(e) => setFormData({ ...formData, quantite: e.target.value })} placeholder="0" className={inputStyles} />
          </InputWrapper>

          <InputWrapper label="Purchase Price" icon={IoPricetagOutline}>
            <input required type="number" value={formData.prix_achat} onChange={(e) => setFormData({ ...formData, prix_achat: e.target.value })} placeholder="0.00" className={inputStyles} />
          </InputWrapper>

          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 dark:text-slate-400 mb-1 flex justify-between">
              Selling Price 
              <span className={Number(profit) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'}>
                ({profit} Dh)
              </span>
            </label>
            <div className="relative flex items-center group">
              <input required type="number" value={formData.prix_vente} onChange={(e) => setFormData({ ...formData, prix_vente: e.target.value })} placeholder="0.00" className={inputStyles} />
              <div className="absolute right-3 text-gray-400 group-focus-within:text-emerald-500"><IoPricetagOutline size={18} /></div>
            </div>
          </div>

          <InputWrapper label="Category" icon={IoLayersOutline}>
            <select onChange={HandlegetCategort} className={`${inputStyles} appearance-none cursor-pointer`}>
              <option value="" className="dark:bg-slate-900">Select category</option>
              {Category.map((t) => (<option key={t._id} value={t._id} className="dark:bg-slate-900">{t.name}</option>))}
            </select>
          </InputWrapper>

          {/* --- Fournisseur Datalist Section --- */}
          <div className="relative">
            <InputWrapper label="Fournisseur" icon={IoBusinessSharp}>
              <input 
                value={formData.fournisseur} 
                onFocus={() => setShowDatalist(true)}
                onBlur={() => setTimeout(() => setShowDatalist(false), 200)}
                onChange={(e) => setFormData({ ...formData, fournisseur: e.target.value })} 
                placeholder="Nom du fournisseur" 
                className={inputStyles} 
              />
            </InputWrapper>

            {showDatalist && filteredFournisseurs.length > 0 && (
              <ul className="absolute z-50 w-full -mt-3 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl max-h-48 overflow-y-auto shadow-2xl">
                {filteredFournisseurs.map((fourn, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setFormData({ ...formData, fournisseur: fourn });
                      setShowDatalist(false);
                    }}
                    className="px-4 py-3 hover:bg-emerald-600 hover:text-white cursor-pointer text-sm border-b border-gray-100 dark:border-slate-700/50 last:border-none transition-colors text-gray-700 dark:text-slate-200"
                  >
                    {fourn}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Barcode Section */}
        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <InputWrapper 
            label="Visual Barcode" 
            icon={IoBarcodeOutline}
            action={
              <button type="button" onClick={() => setFormData({ ...formData, barcode: generateEAN13() })} className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 font-bold transition-colors">
                <IoRefreshOutline /> Regenerate
              </button>
            }
          >
            <input value={formData.barcode} readOnly className="text-center font-mono font-bold tracking-widest text-slate-600 dark:text-slate-300 w-full border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl bg-white dark:bg-slate-800" />
          </InputWrapper>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className={`mt-8 w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-white shadow-lg shadow-emerald-500/20 transition-all ${
            isSubmitting 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
          }`}
        >
          {isSubmitting ? (
            "Processing..."
          ) : (
            <>
              <IoSaveOutline size={20} /> 
              Confirm & Save Product
            </>
          )}
        </button>
      </form>
      <Toaster position="top-right" />
    </div>
  );
}