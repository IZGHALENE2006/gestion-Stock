import { useEffect, useState } from "react";
import {
  IoPricetagOutline,
  IoCubeOutline,
  IoCashOutline,
  IoCartOutline,
  IoSaveOutline,
  IoLayersOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { useDispatch,useSelector } from "react-redux";
import { updateProduit } from "../../slices/SliceProduct";
import toast, { Toaster } from 'react-hot-toast';

function UpdateProduit(props) {

 const   dispatch = useDispatch()
    //Get item///
    const {idupdate2,close}= props
     const { Produts, loading } = useSelector((state) => state.Product);

   const currentproduit = Produts.find((t)=>t._id ==idupdate2)
//Get all Category
  const { Category = [] } = useSelector((state) => state.category);

   ///new value
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

  const handleChange =  (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   try {
    await dispatch(updateProduit({ formData, idupdate2 })).unwrap()

  setFormData({
    name: "",
    quantite: "",
    prix_achat: "",
    prix_vente: "",
    categorie: "",
    fournisseur: "",
  });

  toast.success('Produit updated successfully', {
        duration:3000,

    style: {
      border: '1px solid #00d435',
      padding: '16px',
      color: '#00d435',
      backgroundColor: "#fffffe",
    },
  });
close()
} catch (err) {
  toast.error('Failed to update produit', {
        duration:3000,

    style: {
      border: '1px solid #e22620',
      padding: '16px',
      color: '#e22620',
      backgroundColor: "#fffffe",
    },
  });
}


    

    }
if (!currentproduit || !formData) {
  return <p className="p-5 text-center">Loading product...</p>;
}

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full max-w-3xl">
      <h1 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <IoCartOutline className="text-[#2C74B3]" size={24} />
        Update Produit
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* 🔹 Name */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Nom du produit</label>
          <div className="relative">
            <IoPricetagOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Clavier Gaming"
              className="w-full pl-10 py-2.5 rounded-lg border border-gray-300
              focus:ring-2 focus:ring-[#2C74B3] outline-none"
            />
          </div>
        </div>

        {/* 🔹 Quantité */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Quantité</label>
          <div className="relative">
            <IoCubeOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              name="quantite"
              value={formData.quantite}
              onChange={handleChange}
              placeholder="0"
              className="w-full pl-10 py-2.5 rounded-lg border border-gray-300
              focus:ring-2 focus:ring-[#2C74B3] outline-none"
            />
          </div>
        </div>

        {/* 🔹 Prices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Prix d'achat</label>
            <div className="relative">
              <IoCashOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                name="prix_achat"
                value={formData.prix_achat}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full pl-10 py-2.5 rounded-lg border border-gray-300
                focus:ring-2 focus:ring-[#2C74B3] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Prix de vente</label>
            <div className="relative">
              <IoCashOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                name="prix_vente"
                value={formData.prix_vente}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full pl-10 py-2.5 rounded-lg border border-gray-300
                focus:ring-2 focus:ring-[#2C74B3] outline-none"
              />
            </div>
          </div>
        </div>

        {/* 🔹 Selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Catégorie</label>
            <div className="relative">
              <IoLayersOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                className="w-full pl-10 py-2.5 rounded-lg border border-gray-300
                focus:ring-2 focus:ring-[#2C74B3] outline-none bg-white"
              >
                <option value=''>--------------</option>

                {Category.map((t)=>{
                
                    return(
                <option value={t.name}>{t.name}</option>
                    
                    )
                })}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Fournisseur</label>
            <div className="relative">
              <IoPeopleOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                name="fournisseur"
                value={formData.fournisseur}
                onChange={handleChange}
                className="w-full pl-10 py-2.5 rounded-lg border border-gray-300
                focus:ring-2 focus:ring-[#2C74B3] outline-none bg-white"
              >
                <option value="">Select fournisseur</option>
              </select>
            </div>
          </div>
        </div>

        {/* 🔹 Button */}
        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2
          bg-[#2C74B3] hover:bg-[#205295]
          text-white py-3 rounded-lg font-semibold transition"
        >
          <IoSaveOutline size={20} />
         {loading?"Save Changes...":"Save Changes"}  
        </button>
      </form>
      <Toaster/>
    </div>
  );
}

export default UpdateProduit;
