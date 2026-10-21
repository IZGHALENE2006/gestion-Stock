import mongoose from "mongoose";

const CreditProductSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () =>
        new mongoose.Types.ObjectId().toString().slice(-8).toUpperCase(),
    },
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    prix: {
      type: Number,
      required: true,
      min: 0,
    },
    Paiement: {
      type: Number,
      default: 0,
      min: 0,
    },
    Quantite: {
      type: Number,
      default: 1,
      min: 1,
    },
    Date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const PaymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    Date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const UserCriditShema = new mongoose.Schema(
  {
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    cin: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    Qauntite: {
      type: Number,
      default: 0,
      min: 0,
    },
    Total: {
      type: Number,
      default: 0,
      min: 0,
    },
    Paye: {
      type: Number,
      default: 0,
      min: 0,
    },
    Date: {
      type: Date,
      default: Date.now,
    },
    produit: {
      type: [CreditProductSchema],
      default: [],
    },
    paymentHistory: {
      type: [PaymentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const UserCriditModele = mongoose.model("UserCridit", UserCriditShema);
export default UserCriditModele;
