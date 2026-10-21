import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema({
  requestId: { type: String, required: true }, amount: { type: Number, min: 0, required: true },
  note: { type: String, maxlength: 500, default: "" }, date: { type: Date, required: true },
}, { _id: false });
export const creditInvoiceFields = {
  isCredit: Boolean, creditPaidCents: { type: Number, min: 0 }, creditInitialPaid: { type: Number, min: 0 },
  creditRequestId: String, creditRequestHash: String,
  creditPayments: { type: [paymentSchema], default: undefined },
};
