import { IoInformationCircleOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { GetAllProduct } from "../../slices/SliceProduct";
import { useDispatch, useSelector } from "react-redux";
import { useEffect ,useState} from "react";
import ConfirmDelete from "../Dialog/ConfirmDelete";

export default function ProdTable() {
  //Logic delete 
    const [openDailgoConfirmation, setOpenDailgoConfirmation] = useState(false);
  //Handle confireme delete 
  const [iddelete,setIdDelete] = useState('')
  function HandleOpenDelete(id){
    setIdDelete(id)
    setOpenDailgoConfirmation(true)
  }

 function HandleconfiremeDEleteProduit(){
    
  }

  const dispatch = useDispatch();
  const { Produts, loading } = useSelector((state) => state.Product);

  useEffect(() => {
    dispatch(GetAllProduct());
  }, [dispatch]);

  if (loading) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="">
      <div className="relative overflow-x-auto shadow-md">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-[#2C74B3] text-white">
            <tr>
              <th scope="col" className="px-6 py-3">Product name</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Buy Price</th>
              <th scope="col" className="px-6 py-3">Category</th>
              <th scope="col" className="px-6 py-3">Quantity</th>
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Produts && Produts.map((item, index) => {
              // Logic for low stock
              const isLowStock = item.quantite < 10;
              
              return (
                <tr key={item._id || index} className="border-b border-gray-500 hover:bg-[#2C74B3]/35 transition-colors">
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                    {item.name}
                  </td>
                  
                  <td className="px-6 py-4 font-bold">
                    <span style={{ color: item.quantite > 0 ? "#00ce00" : "#ff4d4d" }}>
                      {item.quantite > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {item.prix_achat ? item.prix_achat.toFixed(2) : "0.00"} Dh
                  </td>

                  <td className="px-6 py-4">
                    {item.categorie}
                  </td>

                  {/* Quantity Fix: Highlight Red if less than 10 */}
                  <td className="px-6 py-4 font-bold">
                    <div className="flex flex-col">
                      <span style={{ color: isLowStock ? "#ff4d4d" : "azure" }}>
                        {item.quantite}
                      </span>
                      {isLowStock && (
                        <span className="text-[10px] text-red-500 animate-pulse">
                          LOW STOCK 
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <CiEdit size={22} className="text-sky-500 hover:scale-125 cursor-pointer duration-200" title="Edit"  />
                      <IoInformationCircleOutline size={22} className="text-amber-500 hover:scale-125 cursor-pointer duration-200" title="Details" />
                      <MdDeleteOutline size={22} className="text-red-500 hover:scale-125 cursor-pointer duration-200" title="Delete" onClick={()=>HandleOpenDelete(item._id)}/>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
   <ConfirmDelete  open={openDailgoConfirmation} onClose={()=>setOpenDailgoConfirmation(false)}
    onConfirm={HandleconfiremeDEleteProduit} title={"Delete Product"} message={"Êtes-vous certain(e) de vouloir supprimer cette catégorie"}
    >
   </ConfirmDelete>
    </div>
  );
}