import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { saveClientCreditPayment } from "./clientsApi.js";
import { documentReference } from "../../../shared/salesDocuments.js";

export default function ClientCreditPayment({ clientId, invoice, onClose, onSaved }) {
  const { t, i18n } = useTranslation();
  const dialogRef = useRef(null), savingRef = useRef(false);
  const [requestId] = useState(uuidv4);
  const [amount, setAmount] = useState(invoice.creditSummary.remaining.toFixed(2));
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false), [error, setError] = useState("");
  useEffect(() => { const dialog = dialogRef.current; dialog.showModal(); return () => dialog.close(); }, []);
  const save = async (event) => {
    event.preventDefault();
    if (savingRef.current) return;
    savingRef.current = true; setSaving(true); setError("");
    try {
      const data = await saveClientCreditPayment(clientId, invoice._id, { amount, note, requestId });
      if (dialogRef.current?.open) onSaved(data);
    } catch (failure) { setError(failure.response?.data?.message || "creditSaveFailed"); }
    finally { savingRef.current = false; setSaving(false); }
  };
  const inputClass = "mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-800";
  return <dialog ref={dialogRef} dir={i18n.dir()} aria-labelledby="client-credit-payment-title" onCancel={(event) => { event.preventDefault(); if (!savingRef.current) onClose(); }} className="m-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-lg overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-900 shadow-2xl backdrop:bg-slate-950/50 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
    <h2 id="client-credit-payment-title" className="text-xl font-bold">{t("invoiceCredit.addPayment")}</h2>
    <p className="mt-2 break-all text-sm text-slate-500">{t("invoiceCredit.invoice")} : <bdi dir="ltr">{documentReference(invoice)}</bdi></p>
    <p className="mt-3 font-bold text-rose-600">{t("invoiceCredit.remaining")} : <bdi dir="ltr">{invoice.creditSummary.remaining.toFixed(2)} DH</bdi></p>
    <form onSubmit={save} className="mt-5"><fieldset disabled={saving} className="min-w-0 space-y-4 disabled:opacity-60">
      <div><label htmlFor="client-credit-amount" className="text-sm font-semibold">{t("invoiceCredit.paymentAmount")}</label><input id="client-credit-amount" type="number" required min="0.01" max={invoice.creditSummary.remaining} step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} className={inputClass} /></div>
      <div><label htmlFor="client-credit-note" className="text-sm font-semibold">{t("invoiceCredit.note")}</label><textarea id="client-credit-note" maxLength={500} rows={3} value={note} onChange={(event) => setNote(event.target.value)} className={inputClass} /></div>
      {error && <p role="alert" className="text-sm text-rose-600">{t(`invoiceCredit.errors.${error}`, { defaultValue: t("invoiceCredit.errors.creditSaveFailed") })}</p>}
      <div className="flex flex-wrap justify-end gap-3"><button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-3 font-semibold dark:border-slate-600">{t("common.cancel")}</button><button type="submit" className="ui-action ui-action--payment text-sm rounded-xl px-5 py-3">{t(saving ? "common.loading" : "invoiceCredit.savePayment")}</button></div>
    </fieldset></form>
  </dialog>;
}
