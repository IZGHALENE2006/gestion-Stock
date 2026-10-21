import AdminModel from "../models/AdminModel.js";
import EmployeModel from "../models/EmployeModele.js";
import Client from "../models/Client.js";
import { invoiceCreditAmounts, summarizeInvoiceCredit } from "../../shared/invoiceCredit.js";

export async function clientCreditInvoices(owner, clientId) {
  const [admin, employees] = await Promise.all([
    AdminModel.findById(owner).select("_id name Facture").lean(),
    EmployeModel.find({ idAdmin: owner }).select("_id name Facture").lean(),
  ]);
  return [admin, ...employees].filter(Boolean).flatMap((actor) => (actor.Facture || [])
    .filter((invoice) => invoice.isCredit === true && invoice.clientId && (!clientId || String(invoice.clientId) === String(clientId)))
    .map((invoice) => {
      const { creditRequestHash: _hash, ...data } = invoice;
      return { ...data, nameEmp: invoice.nameEmp || actor.name, creditSummary: invoiceCreditAmounts(invoice) };
    })).sort((a, b) => new Date(b.DateFacture) - new Date(a.DateFacture));
}

export async function invoiceCreditSummaries(owner) {
  const invoices = await clientCreditInvoices(owner);
  const grouped = new Map();
  for (const invoice of invoices) {
    const key = String(invoice.clientId);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(invoice);
  }
  return Object.fromEntries([...grouped].map(([key, value]) => [key, summarizeInvoiceCredit(value)]));
}

export async function invoiceCreditAccounts(owner) {
  const summaries = await invoiceCreditSummaries(owner);
  const ids = Object.keys(summaries);
  if (!ids.length) return [];
  const clients = await Client.find({ idAdmin: owner, _id: { $in: ids } }).sort({ name: 1 }).lean();
  return clients.map((client) => ({ ...client, _id: `client:${client._id}`, clientId: client._id,
    source: "clientInvoices", summary: summaries[String(client._id)] }));
}
