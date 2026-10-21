import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  requestId: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  date: { type: String, required: true },
  note: { type: String, default: "", maxlength: 1000 },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const InvoiceSchema = new mongoose.Schema({
  requestId: { type: String, required: true },
  reference: { type: String, default: "", trim: true, maxlength: 80 },
  invoiceDate: { type: String, required: true },
  supplierName: { type: String, required: true },
  items: [{
    _id: false,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products", default: null },
    name: { type: String, required: true, maxlength: 200 },
    quantity: { type: Number, required: true, min: 0.001 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  }],
  total: { type: Number, required: true, min: 0 },
  amountPaid: { type: Number, default: 0, min: 0 },
  payments: { type: [PaymentSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

const Fournisseur = new mongoose.Schema(
  {
    idAdmin: Object,
    name: String,
    email: String,
    phone: String,
    Ville: String,
    externalCode: { type: String, maxlength: 80 },
    importCodeKey: String,
    importFingerprintKey: String,
    invoices: { type: [InvoiceSchema], default: [] },
    DateCreate: {
      type: Date,
      default: Date.now,
    },
  }
);

Fournisseur.index({ idAdmin: 1, importCodeKey: 1 }, { unique: true, partialFilterExpression: { importCodeKey: { $type: "string" } } });
Fournisseur.index({ idAdmin: 1, importFingerprintKey: 1 }, { unique: true, partialFilterExpression: { importFingerprintKey: { $type: "string" } } });
export default mongoose.model("Fournisseur", Fournisseur);
