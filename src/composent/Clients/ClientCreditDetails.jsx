import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IoArrowBackOutline, IoCashOutline, IoEyeOutline, IoRefreshOutline } from "react-icons/io5";
import { loadClientCredit } from "./clientsApi.js";
import ClientCreditPayment from "./ClientCreditPayment.jsx";
import InvoiceDetailsDialog from "../Facture/InvoiceDetailsDialog.jsx";
import { documentReference } from "../../../shared/salesDocuments.js";
import { getMe } from "../../slices/SliceLoginAdmin.jsx";

export default function ClientCreditDetails() {
  const { id } = useParams(), location = useLocation();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { token, role } = useSelector((state) => state.LoginAdmin);
  const [result, setResult] = useState(null), [attempt, setAttempt] = useState(0);
  const [payment, setPayment] = useState(null), [preview, setPreview] = useState(null), [status, setStatus] = useState("");
  useEffect(() => {
    if (!token || role !== "admin") return;
    const controller = new AbortController();
    loadClientCredit(id, controller.signal).then((data) => {
      if (!controller.signal.aborted) setResult({ ...data, id, token });
    }).catch((error) => { if (!controller.signal.aborted) setResult({ id, token, error: error.response?.data?.message || "creditLoadFailed" }); });
    return () => controller.abort();
  }, [id, token, role, attempt]);
  const data = result?.id === id && result?.token === token ? result : null;
  const reload = () => { setResult(null); setAttempt((value) => value + 1); };
  const saved = (next) => { setResult({ ...next, id, token }); setPayment(null); setStatus(t("invoiceCredit.paymentSaved")); dispatch(getMe()); };
  const money = (value) => `${Number(value || 0).toFixed(2)} DH`;
  const date = (value) => value ? new Date(value).toLocaleDateString(i18n.language === "ar" ? "ar-MA" : "fr-MA") : "—";
  if (!token) return <Navigate to="/LoginChoise" replace />;
  if (role && role !== "admin") return <Navigate to="/Home/Clients" replace />;
  const backTo = location.state?.backTo === "/Home/cridit/UserCridit" ? location.state.backTo : "/Home/Clients";
  const payments = (data?.invoices || []).flatMap((invoice) => [
    ...(invoice.creditInitialPaid > 0 ? [{ amount: invoice.creditInitialPaid, date: invoice.DateFacture, note: t("invoiceCredit.initialPaid"), reference: documentReference(invoice), key: `${invoice._id}-initial` }] : []),
    ...(invoice.creditPayments || []).map((entry) => ({ ...entry, reference: documentReference(invoice), key: `${invoice._id}-${entry.requestId}` })),
  ]).sort((a, b) => new Date(b.date) - new Date(a.date));
  return <main dir={i18n.dir()} className="min-h-screen bg-slate-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-white sm:p-8">
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-bold">{data?.client?.name || t("invoiceCredit.clientAccount")}</h1><p className="mt-2 text-sm text-slate-500">{t("invoiceCredit.subtitle")}</p></div><div className="flex gap-2"><button type="button" onClick={reload} disabled={!data} aria-label={t("invoiceCredit.refresh")} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"><IoRefreshOutline size={21} /></button><Link to={backTo} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold dark:border-slate-700"><IoArrowBackOutline />{t("common.back")}</Link></div></header>
      {!data && <p role="status" className="p-8 text-center text-slate-500">{t("common.loading")}</p>}
      {data?.error && <div role="alert" className="rounded-xl bg-rose-50 p-5 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{t(`invoiceCredit.errors.${data.error}`, { defaultValue: t("invoiceCredit.errors.creditLoadFailed") })}<button type="button" onClick={reload} className="ms-3 font-bold underline">{t("clients.retry")}</button></div>}
      {status && <p role="status" className="rounded-xl bg-primary-50 p-4 text-primary-800 dark:bg-primary-950 dark:text-primary-200">{status}</p>}
      {data?.client && <>
        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-3">{["address", "phone", "cin"].map((field) => <div key={field}><p className="mb-1 text-slate-500">{t(`clients.fields.${field}`)}</p><p className="whitespace-pre-line break-words font-semibold"><bdi>{data.client[field] || "—"}</bdi></p></div>)}</section>
        <div className="grid gap-4 sm:grid-cols-3">{["total", "paid", "remaining"].map((key) => <div key={key} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><p className="text-sm text-slate-500">{t(`invoiceCredit.${key}`)}</p><p data-credit-total={key} className={`mt-2 text-2xl font-bold ${key === "remaining" ? "text-rose-600" : key === "paid" ? "text-primary-600" : ""}`}><bdi dir="ltr">{money(data.summary[key])}</bdi></p></div>)}</div>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><h2 className="p-5 text-lg font-bold">{t("invoiceCredit.invoices")} ({data.invoices.length})</h2><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-start text-sm"><thead className="bg-slate-100 text-slate-500 dark:bg-slate-800"><tr>{["invoice", "date", "total", "paid", "remaining", "status", "actions"].map((key) => <th key={key} scope="col" className="p-4 text-start">{t(`invoiceCredit.${key}`)}</th>)}</tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{data.invoices.map((invoice) => <tr key={invoice._id} data-credit-invoice={invoice._id}>
          <td className="p-4 font-mono text-xs"><bdi dir="ltr">{documentReference(invoice)}</bdi></td><td className="p-4">{date(invoice.DateFacture)}</td>{["total", "paid", "remaining"].map((key) => <td key={key} className="whitespace-nowrap p-4 font-semibold"><bdi dir="ltr">{money(invoice.creditSummary[key])}</bdi></td>)}<td className="p-4"><span className={`whitespace-nowrap rounded-lg px-2 py-1 text-xs font-bold ${invoice.creditSummary.remaining ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200" : "bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-200"}`}>{t(`invoiceCredit.statuses.${invoice.creditSummary.status}`)}</span></td><td className="p-4"><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setPreview(invoice)} aria-label={t("invoiceCredit.viewInvoice")} className="ui-action ui-action--view text-sm rounded-xl border p-3"><IoEyeOutline size={19} /></button>{invoice.creditSummary.remaining > 0 && <button type="button" onClick={() => setPayment(invoice)} className="ui-action ui-action--payment text-sm inline-flex items-center gap-2 rounded-xl px-3 py-2"><IoCashOutline size={18} />{t("invoiceCredit.addPayment")}</button>}</div></td>
        </tr>)}</tbody></table></div>{!data.invoices.length && <p className="p-8 text-center text-slate-500">{t("invoiceCredit.empty")}</p>}</section>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><h2 className="p-5 text-lg font-bold">{t("invoiceCredit.history")}</h2><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-start text-sm"><thead className="bg-slate-100 text-slate-500 dark:bg-slate-800"><tr>{["date", "invoice", "paymentAmount", "note"].map((key) => <th key={key} scope="col" className="p-4 text-start">{t(`invoiceCredit.${key}`)}</th>)}</tr></thead><tbody>{payments.map((entry) => <tr key={entry.key} className="border-t border-slate-100 dark:border-slate-800"><td className="p-4">{date(entry.date)}</td><td className="p-4 text-xs"><bdi dir="ltr">{entry.reference}</bdi></td><td className="p-4 font-bold text-primary-600"><bdi dir="ltr">{money(entry.amount)}</bdi></td><td className="max-w-80 whitespace-pre-line break-words p-4">{entry.note || "—"}</td></tr>)}</tbody></table></div>{!payments.length && <p className="p-6 text-center text-slate-500">{t("invoiceCredit.noPayments")}</p>}</section>
      </>}
    </div>
    {payment && <ClientCreditPayment key={payment._id} clientId={id} invoice={payment} onClose={() => setPayment(null)} onSaved={saved} />}
    <InvoiceDetailsDialog open={Boolean(preview)} data={preview} onClose={() => setPreview(null)} />
  </main>;
}
