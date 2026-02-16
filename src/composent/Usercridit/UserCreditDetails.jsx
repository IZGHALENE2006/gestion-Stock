import React, { useState } from 'react';
import { 
  IoArrowBackOutline, IoWalletOutline, IoCartOutline, 
  IoCashOutline, IoCheckmarkCircleOutline, IoCalendarOutline,
  IoAddCircleOutline, IoCloseOutline, IoPricetagOutline
} from "react-icons/io5";

const UserCreditDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500 space-y-8 pb-10">
      
      {/* 1. TOP STATS (Total, Paid, Balance) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Debt</p>
          <h3 className="text-3xl font-black text-rose-500">4,500 DH</h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Paid</p>
          <h3 className="text-3xl font-black text-emerald-500">1,200 DH</h3>
        </div>

        <div className="bg-emerald-600 p-8 rounded-[2.5rem] shadow-xl shadow-emerald-600/20 text-white relative overflow-hidden">
          <IoWalletOutline className="absolute -right-4 -bottom-4 opacity-20" size={100} />
          <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest mb-2">Remaining</p>
          <h3 className="text-4xl font-black">3,300 DH</h3>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 2. PRODUCT TABLE WITH "ADD PRODUCT" BUTTON */}
        <div className="flex-[2] bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <IoCartOutline className="text-emerald-500" size={24} />
                <h3 className="font-black uppercase text-sm tracking-widest italic">Credit History</h3>
            </div>
            
            {/* BUTTON TO ADD NEW PRODUCT TO CREDIT */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-lg"
            >
              <IoAddCircleOutline size={18} /> Add Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Product Name</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Price</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Qty</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-8 py-5 font-bold text-slate-700 dark:text-slate-200 italic">Smartphone S24</td>
                  <td className="px-8 py-5 font-black text-slate-500">3,300 DH</td>
                  <td className="px-8 py-5 font-black text-slate-500">x1</td>
                  <td className="px-8 py-5 font-black text-emerald-600 text-right">3,300 DH</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. QUICK PAYMENT ACTION (Same as before) */}
        <div className="flex-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <IoCashOutline className="text-emerald-500" size={24} />
                    <h3 className="font-black uppercase text-sm tracking-widest italic">New Payment</h3>
                </div>
                <input 
                    type="number" 
                    placeholder="Amount (DH)"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-5 mb-4 outline-none text-xl font-black text-slate-700 dark:text-white focus:border-emerald-500 transition-all"
                />
                <button className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-600/20">
                    Register Payment
                </button>
            </div>
        </div>
      </div>

      {/* --- ADD PRODUCT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase tracking-tight italic flex items-center gap-2 text-slate-800 dark:text-white">
                <IoPricetagOutline className="text-emerald-500" /> New Item to Credit
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <IoCloseOutline size={24} className="text-slate-400" />
              </button>
            </div>

            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Product Name</label>
                <input type="text" placeholder="Ex: Gas Oil 20L" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-5 outline-none font-bold text-slate-700 dark:text-white focus:border-emerald-500 transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Price (DH)</label>
                  <input type="number" placeholder="0.00" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-5 outline-none font-bold text-slate-700 dark:text-white focus:border-emerald-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Quantity</label>
                  <input type="number" defaultValue="1" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-5 outline-none font-bold text-slate-700 dark:text-white focus:border-emerald-500 transition-all" />
                </div>
              </div>

              <button className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-600/20 active:scale-95 mt-4">
                Confirm Credit Purchase
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCreditDetails;