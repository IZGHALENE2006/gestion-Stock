import { useState } from "react";
import { IoSaveOutline, IoGridOutline } from "react-icons/io5";
import { AddCategory } from "../../slices/SilceCategory"; 
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from 'react-hot-toast';

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
      toast.error('Failed to add category', {
        duration:3000,
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
      toast.success('Categorie Added Succefuly', {
        duration:3000,

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

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
      <Toaster />
    </form>
  );
}
