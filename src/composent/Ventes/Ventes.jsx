import { IoWalletOutline, IoSearchOutline, IoPersonOutline } from "react-icons/io5";
import { FaUserTie, FaPrint } from "react-icons/fa";
import { TbBrandShopee } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { GetAllEmploye } from "../../slices/sliceEmploye";
import { useEffect, useMemo, useState } from "react";
import { getMe } from "../../slices/SliceLoginAdmin";
import DailogInfoVentes from "./Dailoginfoventes";
import Dialog from "../Dialog/Dialog";
import { generateFactureVentesPDF } from "./FactureVentes";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { usePdfExport } from "../../utils/usePdfExport.js";

function Ventes() {
  const { t, i18n } = useTranslation();
  const { exportPdf, isExporting, exportError } = usePdfExport(generateFactureVentesPDF);
  const { user, role, token } = useSelector((state) => state.LoginAdmin);
  const { Employe } = useSelector((state) => state.Employe);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedEmployeId, setSelectedEmployeId] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const isRtl = i18n.dir() === "rtl";
  const locale = i18n.language === "ar" ? "ar-MA" : "fr-MA";
  const startPadClass = isRtl ? "pr-14 pl-6" : "pl-14 pr-6";
  const iconSideClass = isRtl ? "right-5" : "left-5";
  const selectStartPad = isRtl ? "pr-12 pl-4" : "pl-12 pr-4";
  const selectEndIconClass = isRtl ? "left-4" : "right-4";

  useEffect(() => {
    if (token) {
      dispatch(getMe());
      dispatch(GetAllEmploye());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (!token) navigate("/LoginChoise");
  }, [token, navigate]);

  const allVentes = useMemo(() => {
    if (role === "admin") {
      const adminVentes = (user?.ventes || []).map((v) => ({ ...v, nameEmp: t("salesPage.admin"), empId: "admin" }));
      const employeVentes =
        Employe?.flatMap((e) => (e.ventes || []).map((v) => ({ ...v, nameEmp: e.name, empId: e._id }))) || [];
      return [...adminVentes, ...employeVentes];
    }
    return (user?.ventes || []).map((v) => ({ ...v, nameEmp: user?.name, empId: user?._id }));
  }, [role, user, Employe, t]);

  const dayLabel = new Date().toLocaleDateString(locale);
  const salesToday = allVentes.filter((entry) => new Date(entry.DateVante).toLocaleDateString(locale) === dayLabel);

  const displayData = salesToday.filter((entry) => {
    const matchesSearch = entry.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmploye = selectedEmployeId === "all" || entry.empId === selectedEmployeId;
    return matchesSearch && matchesEmploye;
  });

  const totalProfit = displayData.reduce((sum, entry) => sum + Number(entry.profite || 0), 0);
  const totalSales = displayData.reduce((sum, entry) => sum + Number(entry.quantite || 0), 0);

  const [openInfo, setOpenInfo] = useState(false);
  const [selectedVente, setSelectedVente] = useState({});

  const handleOpenDialog = (item) => {
    setSelectedVente(item);
    setOpenInfo(true);
  };

  const colors = ["text-primary-500", "text-purple-500", "text-orange-500", "text-pink-500", "text-cyan-500"];

  return (
    <div dir={i18n.dir()} className="p-4 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 ${isRtl ? "md:flex-row-reverse" : ""}`}>
          <div className={isRtl ? "text-right" : ""}>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t("salesPage.todaysSales")}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">{t("salesPage.realtimeAnalysis")}</p>
          </div>
          <div className={`flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm ${isRtl ? "flex-row-reverse" : ""}`}>
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/20">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              {t("salesPage.direct")}
            </span>
            <span className="text-sm font-black text-slate-700 dark:text-slate-300">{dayLabel}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative overflow-hidden group p-8 rounded-[3rem] transition-all hover:scale-[1.02] bg-linear-to-br from-primary-400 to-primary-600 shadow-xl shadow-primary-200/50 dark:shadow-none dark:from-slate-700/50 dark:to-slate-900 dark:border dark:border-slate-700">
            <div className={`relative z-10 flex items-center gap-6 ${isRtl ? "flex-row-reverse text-right" : ""}`}>
              <div className="p-5 rounded-3xl bg-white/20 dark:bg-primary-500 backdrop-blur-md text-white shadow-xl shadow-black/5">
                <IoWalletOutline size={35} />
              </div>
              <div>
                <p className="text-primary-50/80 dark:text-primary-300/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                  {t("salesPage.netProfit")}
                </p>
                <h2 className="text-5xl font-black text-white tracking-tighter">
                  {totalProfit.toLocaleString(locale)}{" "}
                  <span className="text-xl text-primary-200 dark:text-primary-400 font-bold ml-1">DH</span>
                </h2>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden group p-8 rounded-[3rem] transition-all hover:scale-[1.02] bg-linear-to-br from-primary-400 to-primary-600 shadow-xl shadow-primary-200/50 dark:shadow-none dark:from-slate-700/50 dark:to-slate-900 dark:border dark:border-slate-700">
            <div className={`relative z-10 flex items-center gap-6 ${isRtl ? "flex-row-reverse text-right" : ""}`}>
              <div className="p-5 rounded-3xl bg-white/20 dark:bg-primary-500 backdrop-blur-md text-white shadow-xl shadow-black/5">
                <TbBrandShopee size={35} />
              </div>
              <div>
                <p className="text-primary-50/80 dark:text-primary-300/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                  {t("salesPage.salesVolume")}
                </p>
                <h2 className="text-5xl font-black text-white tracking-tighter">
                  {totalSales} <span className="text-xl text-primary-200 dark:text-primary-400 font-bold ml-1">{t("salesPage.items")}</span>
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          {role === "admin" && (
            <div className="relative flex-1 lg:max-w-xs group">
              <IoPersonOutline className={`absolute ${iconSideClass} top-1/2 -translate-y-1/2 text-primary-500 z-10`} size={18} />
              <select
                value={selectedEmployeId}
                onChange={(e) => setSelectedEmployeId(e.target.value)}
                className={`w-full ${selectStartPad} py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all appearance-none cursor-pointer text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300`}
              >
                <option value="all" className="text-slate-900 font-bold">
                  {t("salesPage.allSellers")}
                </option>
                <option value="admin" className="text-amber-600 font-bold">
                  {t("salesPage.adminOption", { name: user?.name || "" })}
                </option>
                {Employe?.map((emp, index) => (
                  <option key={emp._id} value={emp._id} className={`${colors[index % colors.length]} font-bold`}>
                    {emp.name}
                  </option>
                ))}
              </select>
              <div className={`absolute ${selectEndIconClass} top-1/2 -translate-y-1/2 pointer-events-none text-slate-400`}>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}

          <div className="flex-1 flex gap-3">
            <div className="relative flex-1">
              <IoSearchOutline className={`absolute ${iconSideClass} top-1/2 -translate-y-1/2 text-slate-400`} size={20} />
              <input
                type="text"
                placeholder={t("salesPage.searchProduct")}
                className={`w-full ${startPadClass} py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:border-primary-500 outline-none transition-all text-[11px] font-bold tracking-widest uppercase`}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="ui-action ui-action--print text-sm px-8 rounded-2xl transition-all flex items-center gap-2"
              onClick={() => exportPdf(displayData)}
              disabled={isExporting}
              aria-busy={isExporting}
            >
              <FaPrint size={18} /> {isExporting ? t("salesPdf.exporting") : t("salesPage.print")}
            </button>
          </div>
        </div>

        {exportError && <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">{exportError}</p>}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500">
                  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em]">{t("salesPage.seller")}</th>
                  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em]">{t("salesPage.product")}</th>
                  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-center">{t("salesPage.quantity")}</th>
                  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-right">{t("salesPage.profit")}</th>
                  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-center">{t("salesPage.action")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {displayData.map((entry) => (
                  <tr key={entry._id} className="hover:bg-primary-50/30 dark:hover:bg-primary-500/5 transition-all group">
                    <td className="px-8 py-5">
                      <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse justify-end" : ""}`}>
                        {entry.empId !== "admin" ? (
                          <>
                            <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xs font-black border border-primary-200 shadow-sm uppercase">
                              {entry.nameEmp?.charAt(0)}
                            </div>
                            <span className="font-black text-xs text-slate-700 dark:text-slate-200 uppercase tracking-tight">{entry.nameEmp}</span>
                          </>
                        ) : (
                          <>
                            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 border border-amber-100 dark:border-amber-500/20 shadow-sm">
                              <FaUserTie size={16} />
                            </div>
                            <div className={`flex flex-col ${isRtl ? "items-end" : ""}`}>
                              <span className="font-black text-xs text-slate-800 dark:text-slate-100 uppercase tracking-tight">{user?.name}</span>
                              <span className="text-[8px] font-black uppercase text-amber-600 tracking-widest leading-none">{t("salesPage.admin")}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-black text-xs text-slate-700 dark:text-slate-200 uppercase tracking-tight">{entry.name}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black border border-slate-200">
                        {entry.quantite}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-primary-600 dark:text-primary-400 font-black text-sm tracking-tight">
                        +{Number(entry.profite || 0).toLocaleString(locale)} DH
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <button
                          className="ui-action ui-action--view text-sm px-6 py-2.5 rounded-xl border transition-all"
                          onClick={() => handleOpenDialog(entry)}
                        >
                          {t("salesPage.details")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {displayData.length === 0 && (
              <div className="p-20 text-center text-slate-400 font-black uppercase tracking-widest text-xs">
                {t("salesPage.noSalesForFilter")}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        bgcolor={document.documentElement.classList.contains("dark") ? "#0f172a" : "#ffffff"}
        isOpen={openInfo}
        onClose={() => setOpenInfo(false)}
        width="650px"
        title={t("salesPage.saleDetailsTitle")}
      >
        <DailogInfoVentes vente={selectedVente} onClose={() => setOpenInfo(false)} />
      </Dialog>
    </div>
  );
}

export default Ventes;
