import { useState } from "react";
import { IoSaveOutline, IoGridOutline } from "react-icons/io5";
import { AddCategory } from "../../slices/SilceCategory"; 
import { useDispatch } from "react-redux";

export default function AddCategoryForm() {
  const Dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    DateCreate: new Date()
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await Dispatch(AddCategory(formData)).unwrap();
      setFormData({ name: "" });
    } catch (err) {
      alert("Failed to add category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* 🔹 Input */}
      <div>
        <label className="text-sm text-gray-700  mb-2 block">
          Nom de la catégorie
        </label>

        <div className="relative">
          <IoGridOutline
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Ex: Informatique"
            className="w-full bg-[#071a2f]/10 border border-[#2C74B3]/40
                       rounded-lg pl-10 pr-4 py-3
                       focus:outline-none focus:ring-2
                       focus:ring-[#2C74B3]"
          />
        </div>
      </div>

      {/* 🔹 Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex justify-center text-white items-center gap-2 py-3 rounded-lg font-semibold transition
          ${
            isSubmitting
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#2C74B3] hover:bg-[#205295] active:scale-95"
          }`}
      >
        <IoSaveOutline size={20} />
        {isSubmitting ? "Ajout..." : "Ajouter"}
      </button>
    </form>
  );
}
