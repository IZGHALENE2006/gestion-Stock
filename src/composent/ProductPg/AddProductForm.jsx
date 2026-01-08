import { useState } from "react";
import { IoBarcodeOutline, IoSaveOutline } from "react-icons/io5";

export default function AddProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    purchasePrice: "",
    sellPrice: "",
    category: "",
    quantity: "",
    barcode: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 1. Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the browser from reloading the page
    setIsSubmitting(true);

    try {
      // Simulate an API call
      console.log("Submitting Product Data:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      alert("Product added successfully!");
      
      // 2. Reset form after success
      setFormData({
        name: "", purchasePrice: "", sellPrice: "",
        category: "", quantity: "", barcode: ""
      });
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const profit = (Number(formData.sellPrice) - Number(formData.purchasePrice)).toFixed(2);

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
              onChange={handleChange}
              placeholder="Product Name" 
              className="border p-2 mb-4 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            
            <label className="text-sm font-semibold text-gray-600 mb-1">Purchase Price</label>
            <input 
              required
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              placeholder="0.00"
              className="border p-2 mb-4 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />

            <label className="text-sm font-semibold text-gray-600 mb-1">Category</label>
            <input 
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Product Category"
              className="border p-2 mb-4 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          <div className="flex flex-col flex-1">
            <label className="text-sm font-semibold text-gray-600 mb-1">Stock Quantity</label>
            <input 
              type="number" 
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
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
              name="sellPrice"
              value={formData.sellPrice}
              onChange={handleChange}
              placeholder="0.00" 
              className="border p-2 mb-4 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />

            <label className="text-sm font-semibold text-gray-600 mb-1">Barcode</label>
            <div className="flex">
              <input 
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
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