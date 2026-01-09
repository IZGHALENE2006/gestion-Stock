import { IoInformationCircleOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { GetAllProduct } from "../../slices/SliceProduct";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function ProdTable() {
  const Dispatch = useDispatch()
 useEffect(()=>{
  Dispatch(GetAllProduct())
 },[Dispatch])
  const {Produts,loading } = useSelector((state)=>state.Product)
 
  if(loading) return <p>Loading...</p>
  return (
    <div>
      <div className="relative overflow-x-auto bg-neutral-primary-soft">
        <table className="w-full text-sm text-left rtl:text-right text-body">
          <thead className="text-sm bg-[#2C74B3] text-white border-b rounded-base border-default">
            <tr style={{fontWeight : "bold" , letterSpacing : "1px"}}>
              <th scope="col" className="px-6 py-3 font-medium">Product name</th>
              <th scope="col" className="px-6 py-3 font-medium">Status</th>
              <th scope="col" className="px-6 py-3 font-medium">prix_achat</th>
              <th scope="col" className="px-6 py-3 font-medium">categorie</th>
              <th scope="col" className="px-3 py-3 font-medium">Quantity</th>
              <th scope="col" className="py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {Produts.map((Prdd, index) => (
            <tr key={index} className="bg-neutral-primary text-gray-300 border-b border-gray-500">
                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                {Prdd.name}
                </th>
                <td className="px-6 py-4 font-bold"
                    style={{color :Prdd.status ? "#00ce00" : "red"}}
                >
                    {Prdd.quantite > 0 ? "On Stock" : "Out of stock"}
                </td>
                <td className="px-6 py-4">
                {Prdd.prix_achat.toFixed(2)} Dh
                </td>
                <td className="px-6 py-4">
                {Prdd.categorie}
                </td>
                <td className="px-6 py-4"
                    style={{color : Prdd.Quantity > 10 ? "azure" : "red"}}
                    
                >
                {Prdd.quantite}
                </td>
                <td className="font-bold">
                <div className="flex gap-3">
                    <CiEdit size={22} className="text-sky-500 hover:scale-110 cursor-pointer duration-200"/>
                    <IoInformationCircleOutline size={22} className="text-amber-500 hover:scale-110 cursor-pointer duration-200"/>
                    <MdDeleteOutline size={22} className="text-red-500 hover:scale-110 cursor-pointer duration-200"/>
                </div>
                </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}