import { useState, useEffect } from "react";
import { IoBarcodeOutline, IoSaveOutline, IoPricetagOutline, IoCubeOutline, IoBusinessSharp, IoLayersOutline, IoRefreshOutline } from "react-icons/io5";
import { AddProduct } from "../../slices/SliceProduct";
import { useDispatch, useSelector } from "react-redux";
import { GetAllCatefory } from "../../slices/SilceCategory";
import Barcode from "react-barcode"; 
import toast, { Toaster } from 'react-hot-toast';

// bar code looooooooooogic
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

const InputWrapper = ({ label, children, icon: Icon, action }) => (
  <div className="flex flex-col flex-1 mb-4 group">
    <label className="text-sm font-semibold text-gray-600 mb-1 flex justify-between">
      {label}
      {action}
    </label>
    <div className="relative flex items-center">
      {children}
      <div className="absolute right-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
        <Icon size={18} />
      </div>
    </div>
  </div>
);

export default function AddProductForm() {
  const Dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  }, [Dispatch]);

  const HandlegetCategort = (e) => {
    const val = e.target.value;
    const cat = Category.find((t) => t._id === val);
    setFormData((prev) => ({ ...prev, categorie: cat ? cat.name : "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await Dispatch(AddProduct(formData)).unwrap();
      setFormData({
        name: "", prix_achat: "", prix_vente: "",
        categorie: "", quantite: "", barcode: generateEAN13(), 
        fournisseur: "", datecreate: new Date(), status: true
      });
      

    } catch (err) {
      console.error(err);
      alert("Failed to add product");
      toast.error('Failed to add product.', {
      style: {
        border: '1px solid #e22620',
        padding: '16px',
        color: '#e22620',
        backgroundColor : "#fffffe",
        backdropFilter : "blur(10px)",
      },
      iconTheme: {
        primary: '#e22620',
        secondary: '#FFFAEE',
      },
    });

    } finally {
      setIsSubmitting(false);
    toast.success('The Product Added Succefuly', {
      style: {
        border: '1px solid #00d435',
        padding: '16px',
        color: '#00d435',
        backgroundColor : "#fffffe",
        backdropFilter : "blur(10px)",
      },
      iconTheme: {
        primary: '#00d435',
        secondary: '#FFFAEE',
      },
    });
    }
  };

  const profit = (Number(formData.prix_vente) - Number(formData.prix_achat)).toFixed(2);

  return (
    <div className="mx-auto bg-white shadow-md rounded-lg p-6 max-w-4xl">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
          <InputWrapper label="Product Name" icon={IoCubeOutline}>
            <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Product Name" className="w-full border p-2 pr-10 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </InputWrapper>

          <InputWrapper label="Stock Quantity" icon={IoSaveOutline}>
            <input type="number" value={formData.quantite} onChange={(e) => setFormData({ ...formData, quantite: e.target.value })} placeholder="0" className="w-full border p-2 pr-10 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </InputWrapper>

          <InputWrapper label="Purchase Price" icon={IoPricetagOutline}>
            <input required type="number" value={formData.prix_achat} onChange={(e) => setFormData({ ...formData, prix_achat: e.target.value })} placeholder="0.00" className="w-full border p-2 pr-10 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </InputWrapper>

          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1 flex justify-between">
              Selling Price <span className={Number(profit) >= 0 ? 'text-green-600' : 'text-red-600'}>({profit }Dh)</span>
            </label>
            <div className="relative flex items-center group">
              <input required type="number" value={formData.prix_vente} onChange={(e) => setFormData({ ...formData, prix_vente: e.target.value })} placeholder="0.00" className="w-full border p-2 pr-10 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="absolute right-3 text-gray-400 group-focus-within:text-blue-500"><IoPricetagOutline size={18} /></div>
            </div>
          </div>

          <InputWrapper label="Category" icon={IoLayersOutline}>
            <select onChange={HandlegetCategort} className="w-full border p-2 pr-10 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer">
              <option value="">Select category</option>
              {Category.map((t) => (<option key={t._id} value={t._id}>{t.name}</option>))}
            </select>
          </InputWrapper>

          <InputWrapper label="Fournisseur" icon={IoBusinessSharp}>
            <input value={formData.fournisseur} onChange={(e) => setFormData({ ...formData, fournisseur: e.target.value })} placeholder="Fournisseur" className="w-full border p-2 pr-10 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </InputWrapper>
        </div>

        <div className="mt-6 flex flex-col items-center p-0 bg-gray-50 rounded-lg">
          <InputWrapper 
            label="Visual Barcode" 
            icon={IoBarcodeOutline}
            action={
              <button type="button" onClick={() => setFormData({ ...formData, barcode: generateEAN13() })} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold">
                <IoRefreshOutline /> New Code
              </button>
            }
          >
            <input value={formData.barcode} readOnly className="text-center font-mono font-bold text-gray-600 w-full px-15 border p-2 rounded border-gray-300 bg-white" />
          </InputWrapper>

        
        </div>

        <button type="submit" disabled={isSubmitting} className={`mt-8 w-full flex items-center justify-center gap-2 py-3 px-4 rounded font-bold text-white transition-all ${isSubmitting ? 'bg-gray-400' : 'bg-[#2C74B3] hover:bg-[#4887da] hover:scale-103 cursor-pointer active:scale-[0.98]'}`}>
          {isSubmitting ? "Saving..." : <><IoSaveOutline size={20} /> Save Product</>}
        </button>
      </form>
      <Toaster />
    </div>
  );
}