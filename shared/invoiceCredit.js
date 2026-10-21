import { roundMoney } from "./saleTotals.js";

export const validCreditRequestId = (value) => typeof value === "string" && /^[a-f0-9-]{36}$/i.test(value);
export const creditError = (message, status = 400) => Object.assign(new Error(message), { status });
export function creditCents(value) {
  if (!["number", "string"].includes(typeof value) || String(value).trim() === "" || !Number.isFinite(Number(value)) || Number(value) < 0) throw creditError("creditInvalidAmount");
  const cents = Math.round(roundMoney(Number(value)) * 100);
  if (!Number.isSafeInteger(cents)) throw creditError("creditInvalidAmount");
  return cents;
}
export function invoiceCreditAmounts(invoice) {
  const totalCents = creditCents(invoice.TotalPrix ?? invoice.totalOrder ?? 0);
  const paidCents = Number.isSafeInteger(invoice.creditPaidCents) ? invoice.creditPaidCents : creditCents(invoice.amountPaid ?? 0);
  const remainingCents = Math.max(0, totalCents - paidCents);
  return { total: totalCents / 100, paid: paidCents / 100, remaining: remainingCents / 100, status: remainingCents === 0 ? "settled" : paidCents > 0 ? "partial" : "unpaid" };
}
export function summarizeInvoiceCredit(invoices) {
  const cents = invoices.reduce((sum, invoice) => {
    const amounts = invoiceCreditAmounts(invoice);
    sum.total += creditCents(amounts.total); sum.paid += creditCents(amounts.paid); sum.remaining += creditCents(amounts.remaining);
    return sum;
  }, { total: 0, paid: 0, remaining: 0 });
  return { total: cents.total / 100, paid: cents.paid / 100, remaining: cents.remaining / 100, count: invoices.length };
}
export function validateInvoiceCreditPayment(invoice, input) {
  if (!validCreditRequestId(input.requestId)) throw creditError("creditInvalidRequest");
  if (typeof input.note !== "string" || input.note.trim().length > 500) throw creditError("creditInvalidNote");
  const cents = creditCents(input.amount);
  if (cents === 0) throw creditError("creditInvalidAmount");
  const previous = (invoice.creditPayments || []).find((payment) => payment.requestId === input.requestId);
  if (previous) {
    if (creditCents(previous.amount) !== cents || previous.note !== input.note.trim()) throw creditError("creditRequestConflict", 409);
    return { duplicate: true };
  }
  if (cents > creditCents(invoiceCreditAmounts(invoice).remaining)) throw creditError("creditPaymentExceeded");
  return { duplicate: false, paidCents: invoice.creditPaidCents + cents, payment: { requestId: input.requestId, amount: cents / 100, note: input.note.trim(), date: new Date() } };
}
