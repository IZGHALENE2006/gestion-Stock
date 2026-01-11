import { IoSearchOutline, IoAddOutline, IoFileTrayStackedOutline } from "react-icons/io5";
import CardCategories from "./CardCategories";
import Dialog from "../Dialog/Dialog";
import AddCategoryorm from "./AddForm";
import { useEffect, useState } from "react";
import { IoGridOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { GetAllCatefory ,DeleteCategory} from "../../slices/SilceCategory";
//Dailog confirmation 
import ConfirmDelete from "../Dialog/ConfirmDelete";
import UpdateCategoryForma from "./UpdateCategoryForma";
function Categories() {
  const Dispatch = useDispatch();
  const { Category } = useSelector((state) => state.category);
 
  useEffect(() => {
    Dispatch(GetAllCatefory());
  }, [Dispatch]);

  const [open, setOpen] = useState(false);
  const [openDailgoConfirmation, setOpenDailgoConfirmation] = useState(false);
//Logic Delete Categorey 
//Iditem
const [iddelete,setiddelet] = useState('')


function HandleDeleteCategory(id){
setiddelet(id)
  
  setOpenDailgoConfirmation(true)
}
//Handle confirem  delete 
function HandleconfiremeDEleteCategorey(){
    Dispatch(DeleteCategory(iddelete)).unwrap().then(()=>{
  setOpenDailgoConfirmation(false)
      
    })

}
//Logci Update 
const [idupdate,setidupdate] = useState('')
const [openDailgoupdate, setopenDailgoupdate] = useState(false);
 function  Hnadleupdatecategory(id){
  setidupdate(id)
 setopenDailgoupdate(true)
  }

  return (
    <div className="p-6 bg-[#0f172a] min-h-screen text-white flex flex-col">

      <div className="flex flex-col lg:flex-row gap-6 mb-8">

        <div className="ProductsCard flex-1 min-w-[260px] p-5 rounded-2xl bg-[#1e293b] border border-slate-700 shadow-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/20">
            <IoFileTrayStackedOutline size={36} className="text-blue-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Number Categories</p>
            <h1 className="text-3xl font-bold">{Category.length}</h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row items-center gap-4 bg-[#1e293b] border border-slate-700 rounded-2xl p-5">
          {/* Search */}
          <div className="flex items-center bg-[#0f172a] border border-slate-600 rounded-lg overflow-hidden w-full md:w-2/3">
            <span className="px-3 text-slate-400">
              <IoSearchOutline />
            </span>
            <input
              type="text"
              placeholder="Search category..."
              className="bg-transparent text-sm px-3 py-2 outline-none w-full text-white"
            />
          </div>

          <button
            className="flex items-center gap-2 px-5 py-2 bg-[#2C74B3] rounded-lg text-sm
                       hover:bg-white hover:text-[#2C74B3] transition"
            onClick={() => setOpen(true)}
          >
            <IoAddOutline size={18} />
            Add Category
          </button>
        </div>
      </div>

   
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Category.map((t, i) => (
            <CardCategories
              key={i}
              id={t._id}
              name={t.name}
              Datee={t.DateCreate}
              btn={HandleDeleteCategory}
              update={Hnadleupdatecategory}
            />
          ))}
        </div>
      </div>

      {/* DIALOG */}
      <Dialog width="550px" isOpen={open} onClose={() => setOpen(false)} title='Ajouter nouveau categorie'>
        <AddCategoryorm />
      </Dialog>
   <ConfirmDelete  open={openDailgoConfirmation} onClose={()=>setOpenDailgoConfirmation(false)}
    onConfirm={HandleconfiremeDEleteCategorey} title={"Delete Product"} message={"Êtes-vous certain(e) de vouloir supprimer cette catégorie"}
    >
   </ConfirmDelete>
   <Dialog width="550px" isOpen={openDailgoupdate} onClose={() => setopenDailgoupdate(false)} title="modifie info catégorie" >
                 <UpdateCategoryForma  idupdate={idupdate}/>
           </Dialog>
    </div>
  );
}

export default Categories;
