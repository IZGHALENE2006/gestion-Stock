import { useState } from "react"
import { IoSearchOutline } from "react-icons/io5";
import AddEmploye from "./AddEmploye";

export default function EmployeeSearch() {
const[open,setopne]=useState(false)
  return (
    <div className="mb-7 w-full p-4 px-8 bg-[#1e293b] border border-gray-600 rounded-xl flex justify-between items-center gap-6">
    
      {/* LEFT */}
      <div className="flex items-center gap-4 flex-wrap">
    
        {/* Search */}
        <div className="flex items-center bg-[#0f172a] border border-gray-600 rounded-lg overflow-hidden">
          <label htmlFor="search" className="px-3 text-gray-400">
            <IoSearchOutline />
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search Employee..."
            className="bg-transparent text-sm text-white px-3 py-2 outline-none w-44 group"
          />
        </div>
    
        <button className="px-5 py-2 bg-[#2C74B3] text-white rounded-lg text-sm
                           hover:bg-white hover:text-[#2C74B3] transition">
          Search
        </button>
      </div>
    
      {/* RIGHT */}
      <button
        onClick={() => setopne(true)}
        className="px-5 py-2 bg-[#2C74B3] text-white rounded-lg text-sm
                   hover:bg-white hover:text-[#2C74B3] transition"
      >
        <span id='plus'>+</span>
         Add Employees
      </button>
    


<AddEmploye open={open} onClose={()=>setopne(false)} />






    </div>
  )
}
