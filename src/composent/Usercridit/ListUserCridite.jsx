import React, { useEffect, useState } from 'react';
import { 
  IoSearchOutline, 
  IoPeopleOutline, 
  IoTrashOutline, 
  IoCreateOutline, 
  IoEyeOutline,
  IoWalletOutline 
} from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { GetAllUserCridite } from '../../slices/SliceCridite';
import { Link, useNavigate } from 'react-router';

const ListUsercridite = () => {
    const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState("");
  const {UserrCridite} = useSelector((state)=>{
    return state.userCridite
  })
useEffect(()=>{
    dispatch(GetAllUserCridite())
},[dispatch])

const navigate= useNavigate()
return (
    <div className="w-full animate-in fade-in duration-700 space-y-8">
      
      {/* HEADER: Stats & Search */}
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        
        {/* Total Users Card */}
        <div className="w-full lg:w-72 p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5 group hover:border-emerald-500/50 transition-all duration-300">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600">
            <IoPeopleOutline size={28} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Clients</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">{UserrCridite.length}</h3>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 w-full relative group">
          <IoSearchOutline className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={22} />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or CIN..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] py-5 pl-16 pr-8 outline-none text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Full Name</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">CIN</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Credit</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Phone</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Mock Data Row */}
{UserrCridite.map((t) => {
  return (
    <tr 
      key={t._id}
      onClick={() => navigate(`/Home/cridit/UserCreditDetails/${t._id}`)} // 3. Hna fin l-khidma
      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all group cursor-pointer"
    >
      <td className="px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-black text-xs">
            {t.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-bold text-slate-700 dark:text-slate-200">{t.name}</span>
        </div>
      </td>
      
      <td className="px-8 py-5 font-bold text-slate-500 dark:text-slate-400">
        {t.cin}
      </td>
      
      <td className="px-8 py-5">
        <span className="px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-600 font-black text-xs">
          {t.Total} DH
        </span>
      </td>
      
      <td className="px-8 py-5 font-bold text-slate-500 dark:text-slate-400">
        {t.phone}
      </td>
      
      <td className="px-8 py-5">
        {/* Hna n-7iyydo l-buttons men l-click dyal l-row bach may-tkhaltouch */}
        <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
            <IoEyeOutline size={18} />
          </button>
          <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-500 hover:text-white transition-all shadow-sm">
            <IoCreateOutline size={18} />
          </button>
          <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
            <IoTrashOutline size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
})}
              {/* Repeat rows here */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListUsercridite;