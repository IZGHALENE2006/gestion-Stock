import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { IoCloseOutline, IoCloudUploadOutline } from "react-icons/io5";
import { GetAllProduct } from "../../slices/SliceProduct";
import { GetAllCatefory } from "../../slices/SilceCategory";
import { importColumns, mapProductSheet, planProductImport, PRODUCT_IMPORT_MAX_BYTES, PRODUCT_IMPORT_MAX_ROWS } from "../../../shared/productImport.js";

const inputClass = "w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-800";
const columns = ["code_article", "name", "categoryName", "prix_vente", "prix_gros", "prix_achat", "quantite", "barcode", "status"];
const pageSize = 40;

export default function ProductImportDialog({ onClose }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { Produts = [] } = useSelector((state) => state.Product);
  const { Category = [] } = useSelector((state) => state.category);
  const [sheets, setSheets] = useState([]);
  const [sheetIndex, setSheetIndex] = useState(0);
  const [stockColumn, setStockColumn] = useState("stock");
  const [categoryName, setCategoryName] = useState("");
  const [fileName, setFileName] = useState("");
  const [reading, setReading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [page, setPage] = useState(0);
  const dialogRef = useRef(null), workerRef = useRef(null), timerRef = useRef(null), readingRef = useRef(0), savingRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => { dialog.close(); workerRef.current?.terminate(); clearTimeout(timerRef.current); readingRef.current += 1; };
  }, []);

  const sheet = sheets[sheetIndex];
  const preview = useMemo(() => {
    if (!sheet) return null;
    if (sheet.error) return { error: sheet.error };
    try {
      const rows = mapProductSheet(sheet, { stockColumn, categoryName });
      return planProductImport(rows, Produts);
    } catch (failure) { return { error: failure.message, fields: failure.fields }; }
  }, [sheet, stockColumn, categoryName, Produts]);
  const fieldLabel = (key) => t(`productImport.fields.${key}`);
  const errorText = (code) => t(`productImport.errors.${code}`, { max: PRODUCT_IMPORT_MAX_ROWS, defaultValue: t("productImport.errors.importFailed") });
  const changeOption = (setter, value) => { setter(value); setPage(0); setError(""); };

  const chooseFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const attempt = ++readingRef.current;
    workerRef.current?.terminate(); clearTimeout(timerRef.current);
    setError(""); setSheets([]); setSheetIndex(0); setPage(0); setResult(null); setFileName(file.name); setReading(false);
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) return setError("fileType");
    if (!file.size || file.size > PRODUCT_IMPORT_MAX_BYTES) return setError("fileSize");
    setReading(true);
    try {
      const bytes = await file.arrayBuffer();
      if (attempt !== readingRef.current) return;
      const worker = new Worker(new URL("./productImport.worker.js", import.meta.url), { type: "module" });
      workerRef.current = worker;
      const finish = (data) => {
        worker.terminate(); clearTimeout(timerRef.current);
        if (attempt !== readingRef.current) return;
        setReading(false);
        if (data.error) setError(data.error);
        else { setSheets(data.sheets); setSheetIndex(Math.max(0, data.sheets.findIndex((item) => !item.error))); }
      };
      worker.onmessage = ({ data }) => finish(data);
      worker.onerror = () => finish({ error: "invalidFile" });
      timerRef.current = setTimeout(() => finish({ error: "invalidFile" }), 30000);
      worker.postMessage(bytes, [bytes]);
    } catch { if (attempt === readingRef.current) { setReading(false); setError("invalidFile"); } }
  };

  const downloadTemplate = async () => {
    try {
      const { utils, writeFileXLSX } = await import("xlsx");
      const workbook = utils.book_new();
      const template = utils.aoa_to_sheet([["Code article", "Libellé", "Type d’article", "Catégories", "PV HT", "Prix gros", "Prix achat", "Stock", "Code barre", "Stock virtuel", "Stock réel", "Statut"]]);
      template["!cols"] = [18, 40, 18, 30, 14, 14, 14, 14, 24, 14, 14, 14].map((wch) => ({ wch }));
      utils.book_append_sheet(workbook, template, "Produits");
      writeFileXLSX(workbook, "modele_import_produits.xlsx");
    } catch { setError("templateFailed"); }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (savingRef.current || !preview?.createCount || preview.errorCount || preview.error || result) return;
    savingRef.current = true; setSaving(true); setError("");
    try {
      const rows = preview.rows.map(({ data, rowNumber }) => ({ ...data, rowNumber }));
      const response = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:7000"}/Product/Import`, { rows }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!dialogRef.current?.open) return;
      setResult(response.data);
      dispatch(GetAllProduct()); dispatch(GetAllCatefory());
    } catch (failure) { setError(failure.response?.data?.message || "importFailed"); }
    finally { savingRef.current = false; setSaving(false); }
  };

  const pages = Math.ceil((preview?.rows?.length || 0) / pageSize);
  const stockOptions = sheet?.headers ? ["stock", "stock_reel", "stock_virtuel"].filter((key) => importColumns(sheet.headers)[key] >= 0) : ["stock", "stock_reel"];

  return <dialog ref={dialogRef} dir={i18n.dir()} aria-labelledby="product-import-title" onCancel={(event) => { event.preventDefault(); if (!savingRef.current) onClose(); }} className="m-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-6xl overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50 backdrop:backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
    <header className="flex items-center justify-between gap-3 border-b border-slate-200 p-5 dark:border-slate-700">
      <div><h2 id="product-import-title" className="text-xl font-bold">{t("productImport.title")}</h2><p className="mt-1 text-sm text-slate-500">{t("productImport.subtitle")}</p></div>
      <button type="button" onClick={onClose} disabled={saving} aria-label={t("dialog.close")} className="rounded-xl p-2 hover:bg-slate-200 disabled:opacity-40 dark:hover:bg-slate-800"><IoCloseOutline size={24} /></button>
    </header>
    <form onSubmit={submit} className="space-y-5 p-5">
      {result ? <div role="status" className="space-y-3 rounded-2xl border border-primary-200 bg-primary-50 p-6 dark:border-primary-800 dark:bg-primary-950">
        <h3 className="text-lg font-bold">{t(result.failedRow ? "productImport.partial" : "productImport.success", result)}</h3><p>{t("productImport.resultDetails", result)}</p>
        {result.failedRow && <><p role="alert" className="text-rose-700 dark:text-rose-300">{t("productImport.stoppedAt", result)} {errorText(result.failureCode)}</p><button type="button" onClick={() => { setResult(null); setError(""); }} className="ui-action ui-action--import text-sm rounded-xl px-4 py-3">{t("productImport.retryRemaining")}</button></>}
      </div> : <fieldset disabled={saving} className="min-w-0 space-y-5 disabled:opacity-60">
        <div className="rounded-2xl border border-dashed border-primary-300 bg-white p-5 dark:border-primary-800 dark:bg-slate-800/40">
          <label htmlFor="product-import-file" className="mb-3 flex items-center gap-2 font-bold"><IoCloudUploadOutline size={24} className="text-primary-600" />{t("productImport.chooseFile")}</label>
          <input id="product-import-file" type="file" accept=".xlsx,.xls,.csv" onChange={chooseFile} className="block w-full min-w-0 text-sm file:me-3 file:rounded-lg file:border-0 file:bg-primary-100 file:px-4 file:py-2 file:font-bold file:text-primary-800" aria-describedby="product-import-file-hint" />
          <div id="product-import-file-hint" className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500"><span>{t("productImport.fileHint", { max: PRODUCT_IMPORT_MAX_ROWS })}</span><button type="button" onClick={downloadTemplate} className="font-bold text-primary-600 underline">{t("productImport.template")}</button></div>
        </div>
        {reading && <p role="status" className="text-sm font-semibold">{t("productImport.reading")}</p>}
        {sheets.length > 0 && <>
          <div className="grid min-w-0 gap-4 md:grid-cols-3">
            <div className="min-w-0"><label htmlFor="product-import-sheet" className="mb-2 block text-sm font-bold">{t("productImport.sheet")}</label><select id="product-import-sheet" value={sheetIndex} onChange={(event) => changeOption(setSheetIndex, Number(event.target.value))} className={inputClass}>{sheets.map((item, index) => <option key={index} value={index}>{item.name}</option>)}</select></div>
            <div className="min-w-0"><label htmlFor="product-import-stock" className="mb-2 block text-sm font-bold">{t("productImport.stockColumn")}</label><select id="product-import-stock" value={stockColumn} onChange={(event) => changeOption(setStockColumn, event.target.value)} className={inputClass}>{[...new Set([stockColumn, ...stockOptions])].map((key) => <option key={key} value={key}>{fieldLabel(key)}</option>)}</select></div>
            <div className="min-w-0"><label htmlFor="product-import-category" className="mb-2 block text-sm font-bold">{t("productImport.categoryMode")}</label><select id="product-import-category" value={categoryName} onChange={(event) => changeOption(setCategoryName, event.target.value)} className={inputClass}><option value="">{t("productImport.fileCategories")}</option>{Category.map((category) => <option key={category._id} value={category.name}>{category.name}</option>)}</select></div>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{t("productImport.mappingHint")}</p>
          {preview?.error ? <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{errorText(preview.error)} {preview.fields?.map(fieldLabel).join(", ")}</p> : preview && <>
            <div aria-live="polite" className="flex flex-wrap gap-3 text-sm font-bold">
              <span className="rounded-xl bg-primary-100 px-4 py-3 text-primary-800 dark:bg-primary-950 dark:text-primary-200">{t("productImport.toCreate", { count: preview.createCount })}</span>
              <span className="rounded-xl bg-slate-200 px-4 py-3 dark:bg-slate-800">{t("productImport.duplicates", { count: preview.duplicateCount })}</span>
              <span className={`rounded-xl px-4 py-3 ${preview.errorCount ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200" : "bg-slate-200 dark:bg-slate-800"}`}>{t("productImport.errorsCount", { count: preview.errorCount })}</span>
            </div>
            {preview.errorCount > 0 && <p role="alert" className="text-sm font-semibold text-rose-600 dark:text-rose-300">{t("productImport.fixErrors")}</p>}
            <div className="max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
              <table className="w-full min-w-[1150px] text-start text-xs">
                <caption className="p-3 text-start font-semibold">{t("productImport.preview")} — {fileName}</caption>
                <thead className="bg-slate-100 dark:bg-slate-800"><tr><th scope="col" className="p-3 text-start">{t("productImport.row")}</th>{columns.map((key) => <th key={key} scope="col" className="p-3 text-start">{fieldLabel(key)}</th>)}<th scope="col" className="p-3 text-start">{t("productImport.validation")}</th></tr></thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">{preview.rows.slice(page * pageSize, (page + 1) * pageSize).map((row) => <tr key={row.rowNumber} className={row.errors.length ? "bg-rose-50/60 dark:bg-rose-950/20" : ""}>
                  <th scope="row" className="p-3 text-start font-semibold">{row.rowNumber}</th>
                  {columns.map((key) => <td key={key} className="max-w-60 break-words p-3" dir={key === "barcode" || key === "code_article" ? "ltr" : undefined}>{key === "status" ? t(row.data.status ? "productImport.active" : "productImport.inactive") : key.startsWith("prix_") ? row.data[key] === null || row.data[key] === undefined ? "—" : Number(row.data[key]).toFixed(2) : row.data[key] ?? "—"}</td>)}
                  <td className="min-w-44 p-3">{row.errors.length ? <ul className="space-y-1 text-rose-600 dark:text-rose-300">{row.errors.map((item) => <li key={item.field}>{fieldLabel(item.field)} : {errorText(item.code)}</li>)}</ul> : <><span className={row.duplicate ? "text-slate-500" : "font-bold text-primary-600"}>{t(row.duplicate ? `productImport.duplicate.${row.duplicate}` : "productImport.ready")}</span>{row.barcodeFromArticle && <p className="mt-1 text-amber-700 dark:text-amber-300">{t("productImport.barcodeFallback")}</p>}</>}</td>
                </tr>)}</tbody>
              </table>
            </div>
            {pages > 1 && <div className="flex items-center justify-between gap-3 text-sm"><button type="button" disabled={page === 0} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-slate-300 px-4 py-2 disabled:opacity-40">{t("productImport.previous")}</button><span>{t("productImport.page", { page: page + 1, pages })}</span><button type="button" disabled={page + 1 >= pages} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-slate-300 px-4 py-2 disabled:opacity-40">{t("productImport.next")}</button></div>}
          </>}
        </>}
      </fieldset>}
      {error && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{errorText(error)}</p>}
      <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
        <button type="button" onClick={onClose} disabled={saving} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold disabled:opacity-40 dark:border-slate-700">{t(result ? "dialog.close" : "common.cancel")}</button>
        {!result && <button type="submit" disabled={saving || reading || !preview?.createCount || Boolean(preview?.errorCount) || Boolean(preview?.error)} className="ui-action ui-action--import text-sm flex items-center gap-2 rounded-xl px-5 py-3 disabled:cursor-not-allowed disabled:opacity-40"><IoCloudUploadOutline size={20} />{saving ? t("productImport.saving") : t("productImport.confirm", { count: preview?.createCount || 0 })}</button>}
      </footer>
    </form>
  </dialog>;
}
