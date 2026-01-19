import mongoose from "mongoose";

const Fournisseur = new mongoose.Schema(
  {
    idAdmin: Object,
    name: String,
    email: String,
    phone: String,
    Ville: String,
    DateCreate: {
      type: Date,
      default: Date.now,
    },
  }
);

export default mongoose.model("Fournisseur", Fournisseur);
