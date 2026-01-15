import { IoCloseOutline } from "react-icons/io5";

export default function SuspendedDialog({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">

        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <IoCloseOutline size={22} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-red-600 mb-3">
          🔒 Compte suspendu
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          Votre compte a été temporairement suspendu par l’administrateur.
          <br />
          Veuillez le contacter pour plus d’informations.
        </p>

        {/* Action */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#0A2647] text-white font-medium
                       hover:bg-[#2C74B3] transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
