import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { IoCloseOutline, IoCloudUploadOutline } from "react-icons/io5";
import { mapSupplierSheet, planSupplierImport, planSupplierInvoiceImport, supplierImportFields, supplierImportHeaders, SUPPLIER_IMPORT_MAX_BYTES, SUPPLIER_IMPORT_MAX_ROWS } from "../../../shared/supplierImport.js";

const inputClass = "w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-800";
const pageSize = 40;

export default function SupplierImportDialog({ supplier, existing, onChanged, onClose }) {
  const { t, i18n } = useTranslation();
  const kind = supplier ? "invoices" : "suppliers";
  const [sheets, setSheets] = useState([]), [sheetIndex, setSheetIndex] = useState(0), [page, setPage] = useState(0);
  const [fileName, setFileName] = useState(""), [reading, setReading] = useState(false), [saving, setSaving] = useState(false);
  const [error, setError] = useState(""), [result, setResult] = useState(null);
  const dialogRef = useRef(null), workerRef = useRef(null), timerRef = useRef(null), readingRef = useRef(0), savingRef = useRef(false);
  useEffect(() => {
    const dialog = dialogRef.current; dialog.showModal();
    return () => { dialog.close(); workerRef.current?.terminate(); clearTimeout(timerRef.current); readingRef.current += 1; };
  }, []);
  const sheet = sheets[sheetIndex];
  const preview = useMemo(() => {
    if (!sheet) return null;
    if (sheet.error) return { error: sheet.error };
    try {
      const rows = mapSupplierSheet(sheet, kind);
      return supplier ? planSupplierInvoiceImport(rows, supplier, existing) : planSupplierImport(rows, existing);
    } catch (failure) { return { error: failure.message, fields: failure.fields }; }
  }, [sheet, kind, supplier, existing]);
  const label = (key) => key === "name" ? t(supplier ? "supplierInvoices.product" : "supplier.name") : t(`supplierImport.fields.${key}`);
  const errorText = (code) => t(`supplierImport.errors.${code}`, { defaultValue: t(`supplierInvoices.errors.${code}`, { defaultValue: t(`productImport.errors.${code}`, { max: SUPPLIER_IMPORT_MAX_ROWS, defaultValue: t("productImport.errors.importFailed") }) }) });
  const refresh = async () => { try { await onChanged(); } catch { /* The parent displays refresh failures. */ } };
  const chooseFile = async (event) => {
    const file = event.target.files?.[0]; if (!file) return;
    const attempt = ++readingRef.current;
    workerRef.current?.terminate(); clearTimeout(timerRef.current);
    setError(""); setSheets([]); setSheetIndex(0); setPage(0); setResult(null); setFileName(file.name); setReading(false);
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) return setError("fileType");
    if (!file.size || file.size > SUPPLIER_IMPORT_MAX_BYTES) return setError("fileSize");
    setReading(true);
    try {
      const bytes = await file.arrayBuffer();
      if (attempt !== readingRef.current) return;
      const worker = new Worker(new URL("./supplierImport.worker.js", import.meta.url), { type: "module" }); workerRef.current = worker;
      const finish = (data) => {
        worker.terminate();
        if (attempt !== readingRef.current) return;
        clearTimeout(timerRef.current);
        setReading(false);
        if (data.error) setError(data.error);
        else { setSheets(data.sheets); setSheetIndex(Math.max(0, data.sheets.findIndex((item) => !item.error))); }
      };
      worker.onmessage = ({ data }) => finish(data); worker.onerror = () => finish({ error: "invalidFile" });
      timerRef.current = setTimeout(() => finish({ error: "invalidFile" }), 30000);
      worker.postMessage({ bytes, kind }, [bytes]);
    } catch { if (attempt === readingRef.current) { setReading(false); setError("invalidFile"); } }
  };
  const template = async () => {
    try {
      const { utils, writeFileXLSX } = await import("xlsx");
      const workbook = utils.book_new(), worksheet = utils.aoa_to_sheet([supplierImportHeaders[kind]]);
      worksheet["!cols"] = supplierImportFields[kind].map((field) => ({ wch: ["name", "email", "supplierName"].includes(field) ? 32 : 22 }));
      utils.book_append_sheet(workbook, worksheet, supplier ? "Factures fournisseurs" : "Fournisseurs");
      writeFileXLSX(workbook, supplier ? "modele_factures_fournisseur.xlsx" : "modele_fournisseurs.xlsx");
    } catch { setError("templateFailed"); }
  };
  const submit = async (event) => {
    event.preventDefault();
    if (savingRef.current || reading || !preview?.createCount || preview.errorCount || preview.error || result) return;
    savingRef.current = true; setSaving(true); setError("");
    try {
      const rows = preview.rows.map(({ data, rowNumber }) => ({ ...data, rowNumber }));
      const suffix = supplier ? `/${encodeURIComponent(supplier._id)}/invoices/import` : "/Import";
      const response = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:7000"}/Fournisseur${suffix}`, { rows }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      if (!dialogRef.current?.open) return;
      setResult(response.data); void refresh();
    } catch (failure) { setError(failure.response?.data?.message || "importFailed"); if (failure.response?.status === 409) void refresh(); }
    finally { savingRef.current = false; setSaving(false); }
  };
  const columns = supplier ? ["reference", "invoiceDate", "name", "quantity", "unitPrice", "amountPaid"] : supplierImportFields.suppliers;
  const pages = Math.ceil((preview?.rows?.length || 0) / pageSize);
  return <dialog ref={dialogRef} dir={i18n.dir()} aria-labelledby="supplier-import-title" onCancel={(event) => { event.preventDefault(); if (!savingRef.current) onClose(); }} className="m-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-6xl overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
    <header className="flex items-start justify-between gap-3 border-b border-slate-200 p-5 dark:border-slate-700"><div><h2 id="supplier-import-title" className="text-xl font-bold">{t(`supplierImport.titles.${kind}`)}</h2>{supplier && <p className="mt-1 font-semibold text-primary-700 dark:text-primary-300"><bdi>{supplier.name}</bdi></p>}<p className="mt-2 max-w-3xl text-sm text-slate-500">{t(`supplierImport.hints.${kind}`)}</p></div><button type="button" onClick={onClose} disabled={saving} aria-label={t("dialog.close")} className="rounded-xl p-2 disabled:opacity-40"><IoCloseOutline size={24} /></button></header>
    <form onSubmit={submit} className="space-y-5 p-5">
      {result ? <div role="status" className="space-y-3 rounded-2xl border border-primary-200 bg-primary-50 p-6 dark:border-primary-800 dark:bg-primary-950"><h3 className="text-lg font-bold">{t(result.failedRow ? "supplierImport.partial" : `supplierImport.success.${kind}`, result)}</h3><p>{t("supplierImport.skipped", { count: result.skipped })}</p>{result.failedRow && <><p role="alert" className="text-rose-700 dark:text-rose-300">{t("supplierImport.stoppedAt", result)} {errorText(result.failureCode)}</p><button type="button" onClick={() => { setResult(null); setError(""); }} className="rounded-xl bg-primary-600 px-4 py-3 font-bold text-white">{t("supplierImport.retryRemaining")}</button></>}</div> : <fieldset disabled={saving} className="min-w-0 space-y-5 disabled:opacity-60">
        <div className="rounded-2xl border border-dashed border-primary-300 bg-white p-5 dark:border-primary-800 dark:bg-slate-800/40"><label htmlFor="supplier-import-file" className="mb-3 flex items-center gap-2 font-bold"><IoCloudUploadOutline size={24} className="text-primary-600" />{t("productImport.chooseFile")}</label><input id="supplier-import-file" type="file" accept=".xlsx,.xls,.csv" onChange={chooseFile} aria-describedby="supplier-import-file-hint" className="block w-full min-w-0 text-sm file:me-3 file:rounded-lg file:border-0 file:bg-primary-100 file:px-4 file:py-2 file:font-bold file:text-primary-800" /><div id="supplier-import-file-hint" className="mt-3 flex flex-wrap justify-between gap-3 text-xs text-slate-500"><span>{t("productImport.fileHint", { max: SUPPLIER_IMPORT_MAX_ROWS })}</span><button type="button" onClick={template} className="font-bold text-primary-600 underline">{t("productImport.template")}</button></div></div>
        <p className="text-sm text-slate-500">{t(`supplierImport.columnsHint.${kind}`)}</p>
        {reading && <p role="status">{t("productImport.reading")}</p>}
        {sheets.length > 0 && <><div className="max-w-sm"><label htmlFor="supplier-import-sheet" className="mb-2 block text-sm font-bold">{t("productImport.sheet")}</label><select id="supplier-import-sheet" value={sheetIndex} onChange={(event) => { setSheetIndex(Number(event.target.value)); setPage(0); setError(""); }} className={inputClass}>{sheets.map((item, index) => <option key={index} value={index}>{item.name}</option>)}</select></div>
          {preview?.error ? <p role="alert" className="text-rose-600">{errorText(preview.error)} {preview.fields?.map(label).join(", ")}</p> : preview && <>
            <div aria-live="polite" className="flex flex-wrap gap-3 text-sm font-bold"><span className="rounded-xl bg-primary-100 px-4 py-3 text-primary-800 dark:bg-primary-950 dark:text-primary-200">{t(`supplierImport.toCreate.${kind}`, { count: preview.createCount })}</span><span className="rounded-xl bg-slate-200 px-4 py-3 dark:bg-slate-800">{t("supplierImport.skipped", { count: preview.duplicateCount })}</span><span className="rounded-xl bg-slate-200 px-4 py-3 dark:bg-slate-800">{t("productImport.errorsCount", { count: preview.errorCount })}</span></div>
            {preview.errorCount > 0 && <p role="alert" className="text-sm font-semibold text-rose-600">{t("supplierImport.fixErrors")}</p>}
            {supplier && !preview.errorCount && preview.createCount > 0 && <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">{[["total", "total"], ["amountPaid", "amountPaid"], ["remaining", "remaining"]].map(([key, field]) => <p key={key}>{t(`supplierInvoices.${key}`)} : <strong><bdi dir="ltr">{preview.documents.reduce((sum, invoice) => sum + invoice[field], 0).toFixed(2)} DH</bdi></strong></p>)}</div>}
            <div className="max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"><table className="w-full min-w-[850px] text-start text-xs"><caption className="p-3 text-start font-semibold">{t("productImport.preview")} — {fileName}</caption><thead className="bg-slate-100 dark:bg-slate-800"><tr><th scope="col" className="p-3 text-start">{t("productImport.row")}</th>{columns.map((key) => <th key={key} scope="col" className="p-3 text-start">{label(key)}</th>)}<th scope="col" className="p-3 text-start">{t("productImport.validation")}</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{preview.rows.slice(page * pageSize, (page + 1) * pageSize).map((row) => <tr key={row.rowNumber} className={row.errors.length ? "bg-rose-50/60 dark:bg-rose-950/20" : ""}><th scope="row" className="p-3 text-start">{row.rowNumber}</th>{columns.map((key) => <td key={key} className="max-w-64 break-words p-3"><bdi>{row.data[key] == null || row.data[key] === "" ? "—" : ["unitPrice", "amountPaid"].includes(key) ? `${row.data[key].toFixed(2)} DH` : row.data[key]}</bdi></td>)}<td className="min-w-44 p-3">{row.errors.length ? <ul className="space-y-1 text-rose-600 dark:text-rose-300">{row.errors.map((item, index) => <li key={index}>{label(item.field)} : {errorText(item.code)}</li>)}</ul> : <span className={row.duplicate ? "text-slate-500" : "font-bold text-primary-600"}>{t(row.duplicate ? `productImport.duplicate.${row.duplicate}` : "productImport.ready")}</span>}</td></tr>)}</tbody></table></div>
            {pages > 1 && <div className="flex items-center justify-between gap-3 text-sm"><button type="button" disabled={page === 0} onClick={() => setPage((value) => value - 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">{t("productImport.previous")}</button><span>{t("productImport.page", { page: page + 1, pages })}</span><button type="button" disabled={page + 1 >= pages} onClick={() => setPage((value) => value + 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">{t("productImport.next")}</button></div>}
          </>}
        </>}
      </fieldset>}
      {error && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{errorText(error)}</p>}
      <footer className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700"><button type="button" onClick={onClose} disabled={saving} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold disabled:opacity-40 dark:border-slate-700">{t(result ? "dialog.close" : "common.cancel")}</button>{!result && <button type="submit" disabled={saving || reading || !preview?.createCount || Boolean(preview?.errorCount) || Boolean(preview?.error)} className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"><IoCloudUploadOutline size={20} />{saving ? t("productImport.saving") : t(`supplierImport.confirm.${kind}`, { count: preview?.createCount || 0 })}</button>}</footer>
    </form>
  </dialog>;
}
