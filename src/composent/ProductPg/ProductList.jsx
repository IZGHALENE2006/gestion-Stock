import { IoSearchOutline } from "react-icons/io5";
import Dialog from "../Dialog/Dialog";
import { useState } from "react";
import AddProductForm from "./AddProductForm"
import ProdTable from "./ProdTable"

export default function ProductList() {
    const [open , setOpen] = useState(false)

  const Categories = ["categorie1","categorie2","categorie3","categorie4"]



  return (
    <div>
        <div className="text-white bg-[#1e293b] mt-7 p-4 px-10 border border-gray-400 rounded-t-xl flex justify-between items-center">
          
          <div className="flex">
              <span className="bg-[#2C74B3] text-sm p-2 px-3 border border-r-0 rounded-l-lg inline-flex items-center">
                  <IoSearchOutline/>
                </span>
                <input
                  type="text"
                  placeholder="Search Product"
                  className="text-sm border p-2 px-3 rounded-r-lg outline-none"
                  />
                <button className="ml-3 p-1 px-5 bg-[#2C74B3] hover:bg-white hover:text-[#2C74B3] duration-700 cursor-pointer border hover:rounded-xl rounded-lg">Search</button>

                  <select
                    defaultValue=""
                    className="text-white rounded-lg p-2 outline-none ml-5"
                  >
                    <option value="" disabled>
                      Select Categorie
                    </option>

                    {Categories.map((cat, i) => (
                      <option key={i} value={cat} className="text-[#2C74B3]">
                        {cat}
                      </option>
                    ))}
                  </select>

                  <select
                    defaultValue=""
                    className="text-white rounded-lg p-2 outline-none ml-5"
                  >
                    <option value="" disabled>
                      Filter By
                    </option>
                    <option value="" className="text-[#2C74B3]">Quantite</option>
                    <option value="" className="text-[#2C74B3]">Price</option>
                    <option value="" className="text-[#2C74B3]">Date</option>
                    
                  </select>

                            
          
          </div>

          <div>
                <button
                onClick={()=>{setOpen(true)}}
                className="p-2 px-4 bg-[#2C74B3] hover:bg-white hover:text-[#2C74B3] duration-700 cursor-pointer border hover:rounded-xl rounded-lg">Add +</button>
          </div>
          












        </div>
        <div className="text-black">

        <Dialog width="550px" isOpen={open} onClose={() => setOpen(false)} title="Add New Product">
              <AddProductForm />
        </Dialog>
        </div>


        <div className="text-white bg-[#1e293b] mt-2 border border-gray-400 rounded-b-xl overflow-hidden">
              <ProdTable />
        </div>
    </div>
  )
}
