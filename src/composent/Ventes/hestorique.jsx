import React, { useState } from 'react';
import { 
  IoCalendarOutline, 
  IoFilterOutline, 
  IoReceiptOutline, 
  IoCartOutline, 
  IoChevronDownOutline,
  IoSearchOutline 
} from "react-icons/io5";

function HestoriqueProfit() {
  const [viewType, setViewType] = useState('ventes'); // 'ventes' or 'factures'
  const [filterType, setFilterType] = useState('mois'); // 'mois' or 'anne'

  return (
    <div className="p-4 min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase dark:text-white">Historique de Profit</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Gérer et consulter vos archives</p>
          </div>
        </div>

        {/* Filters Bar - Glass Effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-4 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          
          {/* Select Period Type */}
          <div className="relative group">
            <IoFilterOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 z-10" />
            <select 
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none appearance-none cursor-pointer text-xs font-black uppercase tracking-widest focus:ring-2 ring-emerald-500/20 transition-all"
            >
              <option value="mois">Par Mois</option>
              <option value="anne">Par Année</option>
            </select>
            <IoChevronDownOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Select Specific Date (Mois ou Année) */}
          <div className="relative group">
            <IoCalendarOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 z-10" />
            <select 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none appearance-none cursor-pointer text-xs font-black uppercase tracking-widest focus:ring-2 ring-blue-500/20 transition-all"
            >
              <option value="">Sélectionner {filterType === 'mois' ? 'le mois' : "l'année"}</option>
              {/* Hna ghadi t-mapi les dates */}
            </select>
            <IoChevronDownOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Search Bar */}
          <div className="relative flex-1">
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="RECHERCHER..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none text-xs font-bold tracking-widest uppercase placeholder:opacity-50"
            />
          </div>
        </div>

        {/* Tabs Selection (Ventes vs Factures) */}
        <div className="flex p-1.5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 w-fit shadow-sm">
          <button 
            onClick={() => setViewType('ventes')}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
              viewType === 'ventes' 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <IoCartOutline size={18} /> Ventes
          </button>
          <button 
            onClick={() => setViewType('factures')}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
              viewType === 'factures' 
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <IoReceiptOutline size={18} /> Factures
          </button>
        </div>

        {/* Data Container */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden min-h-[400px]">
          <div className="p-8">
             {/* Hna t-mapi 3la hasab viewType (Ventes wala Factures) */}
             <div className="flex flex-col items-center justify-center py-20 opacity-20 dark:opacity-10">
                {viewType === 'ventes' ? <IoCartOutline size={80} /> : <IoReceiptOutline size={80} />}
                <p className="mt-4 font-black uppercase tracking-widest text-sm">
                  Liste des {viewType} {filterType === 'mois' ? 'mensuelle' : 'annuelle'}
                </p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default HestoriqueProfit;