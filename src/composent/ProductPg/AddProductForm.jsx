import { useState,useEffect } from "react";
import { IoBarcodeOutline, IoSaveOutline } from "react-icons/io5";
import { AddProduct } from "../../slices/SliceProduct";
import { useDispatch,useSelector } from "react-redux";
import { GetAllCatefory } from "../../slices/SilceCategory";
export default function AddProductForm() {
  const Dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    quantite: "",
    barcode: "",
    prix_achat:"",
    prix_vente:"",
    categorie:"",
    fournisseur:"",
    datecreate:new Date(),
    status:true

  });

//Logic select 

  const { Category } = useSelector((state) => state.category);

  useEffect(() => {
    Dispatch(GetAllCatefory());
  }, [Dispatch]);
  //  Handle Get value select
  function HandlegetCategort(e){
    const val = e.target.value
   const name =  Category.find((t)=>t._id ==val)
    setFormData({...formData,categorie:name.name})
  }
  // 1. Submit Handler
  const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the browser from reloading the page
 
     setIsSubmitting(true)
    try{
  
      await Dispatch(AddProduct(formData)).unwrap()
           setIsSubmitting(false)
   
         setFormData({
        name: "", prix_achat: "", prix_vente: "",
        categorie: "", quantite: "", barcode: "",fournisseur:"",
      });
    }catch(err){
          console.log("Error adding product:", err);
    alert("Failed to add product");
    }finally{
           setIsSubmitting(false)

    }

    

 
  };

  const profit = (Number(formData.prix_vente) - Number(formData.prix_achat)).toFixed(2);

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg">
      
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center items-start gap-10">
          <div className="flex flex-col flex-1">
            <label className="text-sm font-semibold text-gray-600 mb-1">Product Name</label>
            <input 
              required
              name="name"
              value={formData.name}
              onChange={(e)=>setFormData({...formData,name:e.target.value})}
              placeholder="Product Name" 
              className="border p-2 mb-4 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            
            <label className="text-sm font-semibold text-gray-600 mb-1">Purchase Price</label>
            <input 
              required
              type="number"
              name="prix_achat"
              value={formData.prix_achat}
              onChange={(e)=>setFormData({...formData,prix_achat:e.target.value})}

              placeholder="0.00"
              className="border p-2 mb-4 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />

          <label className="text-sm font-semibold text-gray-600 mb-1">
  Category
</label>

<select
  onChange={HandlegetCategort}
  className="
    w-full
    px-4 py-2
    rounded-lg
    border border-gray-300
    bg-white
    text-gray-700
    focus:outline-none
    focus:ring-2
    focus:ring-[#2C74B3]
    focus:border-[#2C74B3]
    transition
    cursor-pointer
  "
>
  <option value="">Select category</option>
  {Category.map((t) => (
    <option key={t._id} value={t._id}>
      {t.name}
    </option>
  ))}
</select>

          </div>

          <div className="flex flex-col flex-1">
            <label className="text-sm font-semibold text-gray-600 mb-1">Stock Quantity</label>
            <input 
              type="number" 
              name="Quantite"
              value={formData.quantite}
               onChange={(e)=>setFormData({...formData,quantite:e.target.value})}
              placeholder="0" 
              className="border p-2 mb-4 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <label className="text-sm font-semibold text-gray-600 mb-1 flex justify-between">
              Selling Price 
              <span className={`text-xs font-bold ${Number(profit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                (Profit: ${profit})
              </span>
            </label>
            <input 
              required
              type="number" 
              name="prix_vente"
              value={formData.prix_vente}
               onChange={(e)=>setFormData({...formData,prix_vente:e.target.value})}

              placeholder="0.00" 
              className="border p-2 mb-4 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />

            <label className="text-sm font-semibold text-gray-600 mb-1">Barcode</label>
            <div className="flex">
              <input 
                name="barcode"
                value={formData.barcode}
                 onChange={(e)=>setFormData({...formData,barcode:e.target.value})}

                placeholder="Scan or enter code"
                className="border p-2 rounded-l border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <span className="bg-gray-100 border border-l-0 border-gray-300 rounded-r px-2 flex items-center">
                <IoBarcodeOutline size={20} className="text-gray-500" />
              </span>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className={`mt-8 w-full flex items-center justify-center gap-2 py-3 px-4 rounded font-bold text-white transition-all
            ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2C74B3] hover:bg-[#205295] active:scale-[0.98]'}`}
        >
          {isSubmitting ? (
            "Saving..."
          ) : (
            <>
              <IoSaveOutline size={20} />
              Save Product
            </>
          )}
        </button>
      </form>
    </div>
  );
}