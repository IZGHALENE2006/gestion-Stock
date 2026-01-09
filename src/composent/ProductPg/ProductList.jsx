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
      <div className="mt-7 p-4 px-8 bg-[#1e293b] border border-gray-600 rounded-xl flex justify-between items-center gap-6">

  {/* LEFT */}
  <div className="flex items-center gap-4 flex-wrap">

    {/* Search */}
    <div className="flex items-center bg-[#0f172a] border border-gray-600 rounded-lg overflow-hidden">
      <span className="px-3 text-gray-400">
        <IoSearchOutline />
      </span>
      <input
        type="text"
        placeholder="Search product..."
        className="bg-transparent text-sm text-white px-3 py-2 outline-none w-44"
      />
    </div>

    <button className="px-5 py-2 bg-[#2C74B3] text-white rounded-lg text-sm
                       hover:bg-white hover:text-[#2C74B3] transition">
      Search
    </button>

    {/* Select Category */}
    <select
      defaultValue=""
      className="bg-[#0f172a] text-gray-300 border border-gray-600
                 rounded-lg px-4 py-2 text-sm outline-none
                 hover:border-[#2C74B3] transition"
    >
      <option value="" disabled>
        Category
      </option>
      {Categories.map((cat, i) => (
        <option key={i} value={cat} className="bg-[#0f172a] text-white">
          {cat}
        </option>
      ))}
    </select>

    {/* Filter */}
    <select
      defaultValue=""
      className="bg-[#0f172a] text-gray-300 border border-gray-600
                 rounded-lg px-4 py-2 text-sm outline-none
                 hover:border-[#2C74B3] transition"
    >
      <option value="" disabled>
        Filter by
      </option>
      <option className="bg-[#0f172a] text-white">Quantity</option>
      <option className="bg-[#0f172a] text-white">Price</option>
      <option className="bg-[#0f172a] text-white">Date</option>
    </select>

  </div>

  {/* RIGHT */}
  <button
    onClick={() => setOpen(true)}
    className="px-5 py-2 bg-[#2C74B3] text-white rounded-lg text-sm
               hover:bg-white hover:text-[#2C74B3] transition"
  >
    + Add Product
  </button>

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
