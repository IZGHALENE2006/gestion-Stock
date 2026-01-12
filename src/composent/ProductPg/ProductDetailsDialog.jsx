// Dialog/ProductDetailsDialog.jsx
export default function ProductDetailsDialog({ open, onClose, product }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#1a1a1a] border border-gray-600 p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
          Product Details
        </h2>
        
        <div className="space-y-3 text-gray-300">
          <p><strong className="text-sky-400">Name:</strong> {product?.name}</p>
          <p><strong className="text-sky-400">Category:</strong> {product?.categorie}</p>
          <p><strong className="text-sky-400">Price:</strong> {product?.prix_achat} Dh</p>
          <p><strong className="text-sky-400">Stock:</strong> {product?.quantite}</p>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}