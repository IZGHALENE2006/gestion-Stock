import {
  IoSearchOutline,
  IoAddOutline,
  IoFileTrayStackedOutline
} from "react-icons/io5";
import CardCategories from "./CardCategories";
import Dialog from "../Dialog/Dialog";
import AddCategoryorm from "./AddForm";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllCatefory, DeleteCategory } from "../../slices/SilceCategory";
import ConfirmDelete from "../Dialog/ConfirmDelete";
import UpdateCategoryForma from "./UpdateCategoryForma";
import toast, { Toaster } from "react-hot-toast";

function Categories() {
  const dispatch = useDispatch();
  const { Category } = useSelector((state) => state.category);
  const { role } = useSelector((state) => state.LoginAdmin);

  useEffect(() => {
    dispatch(GetAllCatefory());
  }, [dispatch]);

  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [idDelete, setIdDelete] = useState("");
  const [idUpdate, setIdUpdate] = useState("");

  // Delete
  function handleDelete(id) {
    setIdDelete(id);
    setOpenDelete(true);
  }

  function confirmDelete() {
    dispatch(DeleteCategory(idDelete))
      .unwrap()
      .then(() => {
        toast.success("Category deleted");
        setOpenDelete(false);
      });
  }

  // Update
  function handleUpdate(id) {
    setIdUpdate(id);
    setOpenUpdate(true);
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* ===== TOP CARDS & SEARCH ===== */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        
        {/* Counter Card */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-100">
            <IoFileTrayStackedOutline size={34} className="text-blue-600" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">
              Number of Categories
            </p>
            <h1 className="text-3xl font-bold text-slate-800">
              {Category.length}
            </h1>
          </div>
        </div>

        {/* Search + Add */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          
          {/* Search */}
          <div className={`flex items-center bg-slate-100 border border-slate-200 rounded-xl overflow-hidden w-full ${role === "admin" ? "md:w-2/3" : "md:w-full"}`}>
            <span className="px-3 text-slate-400">
              <IoSearchOutline />
            </span>
            <input
              type="text"
              placeholder="Search category..."
              className="bg-transparent text-sm px-2 py-2 outline-none w-full text-slate-700"
            />
          </div>

          {/* Add Button */}
          {role === "admin" && (
            <button
              onClick={() => setOpenAdd(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
              <IoAddOutline size={18} />
              Add Category
            </button>
          )}
        </div>
      </div>

      {/* ===== CATEGORIES GRID ===== */}
      <div className="flex flex-wrap gap-6 justify-center">
        {Category.map((t, i) => (
          <div
            key={t._id || i}
            className="basis-full sm:basis-[calc(50%-1.5rem)] lg:basis-[calc(33.333%-1.5rem)] xl:basis-[calc(25%-1.5rem)]"
          >
            <CardCategories
              id={t._id}
              name={t.name}
              Datee={t.DateCreate}
              btn={handleDelete}
              update={handleUpdate}
            />
          </div>
        ))}
      </div>

      {/* ===== DIALOGS ===== */}
      <Dialog
        bgcolor="#ffffff"
        width="550px"
        isOpen={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Ajouter nouvelle catégorie"
      >
        <AddCategoryorm />
      </Dialog>

      <ConfirmDelete
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message="Êtes-vous sûr de vouloir supprimer cette catégorie ?"
      />

      <Dialog
        bgcolor="#ffffff"
        width="550px"
        isOpen={openUpdate}
        onClose={() => setOpenUpdate(false)}
        title="Modifier la catégorie"
      >
        <UpdateCategoryForma
          idupdate={idUpdate}
          onClose={() => setOpenUpdate(false)}
        />
      </Dialog>

      <Toaster />
    </div>
  );
}

export default Categories;
