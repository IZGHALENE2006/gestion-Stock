import { useSelector } from "react-redux";

const ConfirmDelete = ({ open, onClose, onConfirm, title, message }) => {
  if (!open) return null;
   const {loading,error} = useSelector((state)=>state.category)
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      ></div>

      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 animate-scaleIn">
        <h2 className="text-lg font-semibold text-gray-800">
          {title || "Confirm Delete"}
        </h2>

        <p className="text-sm text-gray-600 mt-2">
          {message || "Are you sure you want to delete this item? This action cannot be undone."}
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
           {loading?"Delete...":"Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
