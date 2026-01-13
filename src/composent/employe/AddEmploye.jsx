import { useState } from "react";
import {
  IoPersonOutline,
  IoCallOutline,
  IoMailOutline,
  IoLockClosedOutline,
  IoCloseOutline,
} from "react-icons/io5";

function AddEmploye({ open, onClose }) {
  const [infoEmp, setInfoEmp] = useState({
    name: "",
    cin: "",
    phone: "",
    email: "",
    password: "",
    color: "#2C74B3",
    isActive: false,
  });
console.log(infoEmp);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
 
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Dialog */}
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 animate-scaleIn">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Ajouter un employé
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <IoCloseOutline size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">

          {/* Nom + CIN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nom */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">Nom</label>
              <div className="relative">
                <IoPersonOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nom complet"
                  className="w-full pl-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) =>
                    setInfoEmp({ ...infoEmp, name: e.target.value })
                  }
                />
              </div>
            </div>

            {/* CIN */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">CIN</label>
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Ex: AB123456"
                  className="w-full pl-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) =>
                    setInfoEmp({ ...infoEmp, cin: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Téléphone + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Téléphone */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">Téléphone</label>
              <div className="relative">
                <IoCallOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="06xxxxxxxx"
                  className="w-full pl-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) =>
                    setInfoEmp({ ...infoEmp, phone: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">Email</label>
              <div className="relative">
                <IoMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full pl-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) =>
                    setInfoEmp({ ...infoEmp, email: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Password + Couleur */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">Mot de passe</label>
              <div className="relative">
                <IoLockClosedOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) =>
                    setInfoEmp({ ...infoEmp, password: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Couleur */}
            <div className="flex items-center gap-3 mt-5 md:mt-0">
              <input
                type="color"
                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={infoEmp.color}
                onChange={(e) =>
                  setInfoEmp({ ...infoEmp, color: e.target.value })
                }
              />
              <span className="text-sm text-gray-700">Couleur préférée</span>
            </div>
          </div>

          {/* Compte actif */}
          <div>
            <label className="text-sm text-gray-600 block mb-2">
              Statut du compte
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-blue-500 transition">
              <input
                type="checkbox"
                className="w-5 h-5 accent-blue-500"
                checked={infoEmp.isActive}
                onChange={(e) =>
                  setInfoEmp({ ...infoEmp, isActive: e.target.checked })
                }
              />
              <span className="text-sm font-medium text-gray-700">Compte actif</span>
            </label>
            <p className="text-xs text-gray-400 mt-1">
              Si coché → actif, sinon → inactif
            </p>
          </div>

        </div>
        

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            Annuler
          </button>
          <button
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEmploye;
