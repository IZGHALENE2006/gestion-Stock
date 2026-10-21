import test from "node:test";
import assert from "node:assert/strict";
import { creditCents, invoiceCreditAmounts, summarizeInvoiceCredit, validateInvoiceCreditPayment } from "../shared/invoiceCredit.js";

const requestId = "12345678-1234-4234-8234-123456789012";
test("credit arithmetic rounds in cents and never leaves a floating point remainder", () => {
  const invoice = { TotalPrix: 0.3, creditPaidCents: 10 };
  const next = validateInvoiceCreditPayment(invoice, { amount: 0.2, note: "", requestId });
  invoice.creditPaidCents = next.paidCents;
  assert.deepEqual(invoiceCreditAmounts(invoice), { total: 0.3, paid: 0.3, remaining: 0, status: "settled" });
  assert.deepEqual(summarizeInvoiceCredit([invoice, { TotalPrix: 0.1, creditPaidCents: 0 }]), { total: 0.4, paid: 0.3, remaining: 0.1, count: 2 });
});
test("invalid and excessive credit payments are rejected", () => {
  for (const amount of [null, undefined, [], {}, true, "", " ", -1, Infinity, "NaN", 1e30]) assert.throws(() => creditCents(amount), /creditInvalidAmount/);
  for (const amount of [0, 0.001]) assert.throws(() => validateInvoiceCreditPayment({ TotalPrix: 50, creditPaidCents: 1000 }, { amount, note: "", requestId }), /creditInvalidAmount/);
  assert.throws(() => validateInvoiceCreditPayment({ TotalPrix: 50, creditPaidCents: 1000 }, { amount: 40.01, note: "", requestId }), /creditPaymentExceeded/);
});
test("a retried payment remains idempotent after settlement and conflicts if its payload changes", () => {
  const input = { amount: 50, note: " Virement ", requestId };
  const next = validateInvoiceCreditPayment({ TotalPrix: 50, creditPaidCents: 0 }, input);
  const paid = { TotalPrix: 50, creditPaidCents: next.paidCents, creditPayments: [next.payment] };
  assert.deepEqual(validateInvoiceCreditPayment(paid, input), { duplicate: true });
  assert.throws(() => validateInvoiceCreditPayment(paid, { ...input, amount: 40 }), /creditRequestConflict/);
  assert.throws(() => validateInvoiceCreditPayment(paid, { ...input, note: "Espèce" }), /creditRequestConflict/);
});
