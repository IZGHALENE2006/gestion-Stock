import React, { useState } from 'react';
import { IoLockClosedOutline, IoShieldCheckmarkOutline, IoEyeOffOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { UpdatePassword } from '../../slices/SliceLoginAdmin';
import { useNavigate } from 'react-router';
import toast, { Toaster } from "react-hot-toast";

const ChangePassword = () => {
  const { error } = useSelector((state) => state.LoginAdmin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [nwepassword, setnewpassword] = useState({ old: "", newpass: "", newpass2: "" });

  function HandleUpdatePassword(e) {
    e.preventDefault();

    if (!nwepassword.old || !nwepassword.newpass || !nwepassword.newpass2) {
      toast.error("All fields are required");
      return;
    }

    if (nwepassword.newpass !== nwepassword.newpass2) {
      toast.error("Passwords do not match");
      return;
    }

    dispatch(UpdatePassword(nwepassword))
      .unwrap()
      .then(() => {
        toast.success("Password updated successfully", {
          duration: 3000,
          position: "top-right",
        });
        navigate("/Home/profile");
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message || "Something went wrong",
          { duration: 4000 }
        );
      });
  }

  return (
    <div className="min-h-[80vh] bg-gray-100 dark:bg-[#1e293b] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header Section */}
        <div className="p-8 pb-4 text-center">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <IoShieldCheckmarkOutline size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            Security
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
            Update your password to protect your account.
          </p>
        </div>

        {/* Form Section */}
        <form className="p-8 pt-4 space-y-6" onSubmit={HandleUpdatePassword}>
          
          {/* Current Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
              Current Password
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <IoLockClosedOutline size={18} />
              </span>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 outline-none text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                onChange={(e) => setnewpassword({ ...nwepassword, old: e.target.value })}
              />
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
              New Password
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <IoEyeOffOutline size={18} />
              </span>
              <input 
                type="password" 
                placeholder="Min. 8 characters" 
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 outline-none text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                onChange={(e) => setnewpassword({ ...nwepassword, newpass: e.target.value })}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
              Confirm New Password
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <IoEyeOffOutline size={18} />
              </span>
              <input 
                type="password" 
                placeholder="Repeat password" 
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 outline-none text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                onChange={(e) => setnewpassword({ ...nwepassword, newpass2: e.target.value })}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <button 
              type="submit" 
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              Update Password
            </button>
            <button 
              type="button" 
              onClick={() => navigate("/Home/profile")}
              className="w-full bg-red-400 rounded-xl  py-4 text-white dark:text-slate-500 font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 dark:hover:text-slate-300 transition-all"
            >
              Cancel
            </button>
            {error && <span className="text-red-500 text-xs font-bold text-center mt-2">{error}</span>}
          </div>
        </form>
      </div>
      <Toaster/>
    </div>
  );
};

export default ChangePassword;