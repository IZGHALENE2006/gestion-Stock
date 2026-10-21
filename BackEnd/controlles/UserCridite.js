import UserCriditModele from "../models/userCidit.js";
import mongoose from "mongoose";
import { invoiceCreditAccounts } from "../utils/clientInvoiceCredit.js";

const getOwnerId = (user) => {
  if (!user) return null;
  if (user.role === "admin") return user.id;
  return user.idAdmin || null;
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const round2 = (value) => Number(toNumber(value).toFixed(2));

const hydrateLegacyTotals = (user) => {
  const products = Array.isArray(user.produit) ? user.produit : [];
  const computedTotal = products.reduce(
    (sum, p) => sum + toNumber(p.prix) * toNumber(p.Quantite, 1),
    0
  );
  const computedPaid = products.reduce((sum, p) => sum + toNumber(p.Paiement), 0);
  const computedQty = products.reduce((sum, p) => sum + toNumber(p.Quantite, 1), 0);

  if (!toNumber(user.Total) && computedTotal > 0) {
    user.Total = round2(computedTotal);
  }
  if (!toNumber(user.Paye) && computedPaid > 0) {
    user.Paye = round2(computedPaid);
  }
  if (!toNumber(user.Qauntite) && computedQty > 0) {
    user.Qauntite = computedQty;
  }
};

const buildCreditPayload = (userDoc) => {
  const user =
    typeof userDoc.toObject === "function" ? userDoc.toObject() : userDoc;

  const total = round2(user.Total);
  const paid = round2(user.Paye);
  const remaining = round2(Math.max(total - paid, 0));
  const totalQuantity = toNumber(user.Qauntite);

  const produit = (user.produit || []).map((item) => {
    const qty = toNumber(item.Quantite, 1);
    const unitPrice = round2(item.prix);
    const upfront = round2(item.Paiement);
    const lineTotal = round2(unitPrice * qty);
    const lineRemaining = round2(Math.max(lineTotal - upfront, 0));

    return {
      ...item,
      Quantite: qty,
      prix: unitPrice,
      Paiement: upfront,
      lineTotal,
      lineRemaining,
    };
  });

  const paymentHistory = (user.paymentHistory || []).map((payment) => ({
    ...payment,
    amount: round2(payment.amount),
  }));

  return {
    ...user,
    produit,
    paymentHistory,
    summary: {
      total,
      paid,
      remaining,
      totalQuantity,
    },
  };
};

// Add User Cridite
export const AddUserCridite = async (req, res) => {
  const { name, cin, email, phone } = req.body;

  try {
    const ownerId = getOwnerId(req.user);
    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!name?.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const safeEmail = (email || "").trim().toLowerCase();
    const safeCin = (cin || "").trim();

    if (safeEmail) {
      const checkEmail = await UserCriditModele.findOne({
        idUser: ownerId,
        email: safeEmail,
      });
      if (checkEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    if (safeCin) {
      const checkCin = await UserCriditModele.findOne({
        idUser: ownerId,
        cin: safeCin,
      });
      if (checkCin) {
        return res.status(400).json({ message: "CIN already exists" });
      }
    }

    const newUser = await UserCriditModele.create({
      idUser: ownerId,
      name: name.trim(),
      cin: safeCin,
      email: safeEmail,
      phone: (phone || "").trim(),
    });

    return res.status(201).json({
      message: "User created successfully",
      user: buildCreditPayload(newUser),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all users on credit
export const AllUserCridite = async (req, res) => {
  try {
    const ownerId = getOwnerId(req.user);
    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const users = await UserCriditModele.find({ idUser: ownerId }).sort({
      createdAt: -1,
    });

    const payload = users.map((user) => {
      hydrateLegacyTotals(user);
      return buildCreditPayload(user);
    });

    return res.json([...await invoiceCreditAccounts(ownerId), ...payload]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get single user credit details
export const GetUserCriditeById = async (req, res) => {
  const { id } = req.params;

  try {
    const ownerId = getOwnerId(req.user);
    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userCredit = await UserCriditModele.findOne({
      _id: id,
      idUser: ownerId,
    });

    if (!userCredit) {
      return res.status(404).json({ message: "User not found" });
    }

    hydrateLegacyTotals(userCredit);
    return res.json(buildCreditPayload(userCredit));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Add a new credit item for a user
export const AddCreditProduct = async (req, res) => {
  const { id } = req.params;
  const { nom, prix, Quantite, Paiement, productId } = req.body;

  try {
    const ownerId = getOwnerId(req.user);
    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userCredit = await UserCriditModele.findOne({
      _id: id,
      idUser: ownerId,
    });
    if (!userCredit) {
      return res.status(404).json({ message: "User not found" });
    }

    const safeName = (nom || "").trim();
    const safeQty = Math.max(1, Math.floor(toNumber(Quantite, 1)));
    const safePrice = round2(toNumber(prix));
    const safeUpfront = round2(Math.max(0, toNumber(Paiement)));
    const lineTotal = round2(safeQty * safePrice);

    if (!safeName) {
      return res.status(400).json({ message: "Product name is required" });
    }
    if (safePrice <= 0) {
      return res.status(400).json({ message: "Price must be greater than 0" });
    }
    if (safeUpfront > lineTotal) {
      return res
        .status(400)
        .json({ message: "Paid amount cannot exceed credit line total" });
    }

    const generatedId =
      productId ||
      new mongoose.Types.ObjectId().toString().slice(-8).toUpperCase();

    hydrateLegacyTotals(userCredit);

    userCredit.produit.push({
      id: generatedId,
      nom: safeName,
      prix: safePrice,
      Quantite: safeQty,
      Paiement: safeUpfront,
    });

    userCredit.Total = round2(toNumber(userCredit.Total) + lineTotal);
    userCredit.Paye = round2(toNumber(userCredit.Paye) + safeUpfront);
    userCredit.Qauntite = toNumber(userCredit.Qauntite) + safeQty;

    await userCredit.save();

    return res.status(201).json({
      message: "Credit product added successfully",
      user: buildCreditPayload(userCredit),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Register a payment for a user
export const AddUserPayment = async (req, res) => {
  const { id } = req.params;
  const { amount, note } = req.body;

  try {
    const ownerId = getOwnerId(req.user);
    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userCredit = await UserCriditModele.findOne({
      _id: id,
      idUser: ownerId,
    });
    if (!userCredit) {
      return res.status(404).json({ message: "User not found" });
    }

    hydrateLegacyTotals(userCredit);

    const safeAmount = round2(toNumber(amount));
    if (safeAmount <= 0) {
      return res.status(400).json({ message: "Payment must be greater than 0" });
    }

    const remainingBefore = round2(
      Math.max(toNumber(userCredit.Total) - toNumber(userCredit.Paye), 0)
    );
    if (safeAmount > remainingBefore) {
      return res.status(400).json({
        message: `Payment exceeds remaining amount (${remainingBefore} DH)`,
      });
    }

    userCredit.Paye = round2(toNumber(userCredit.Paye) + safeAmount);
    userCredit.paymentHistory.push({
      amount: safeAmount,
      note: (note || "").trim(),
    });

    await userCredit.save();

    return res.json({
      message: "Payment added successfully",
      user: buildCreditPayload(userCredit),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete one credit product line
export const DeleteCreditProduct = async (req, res) => {
  const { id, productId } = req.params;

  try {
    const ownerId = getOwnerId(req.user);
    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userCredit = await UserCriditModele.findOne({
      _id: id,
      idUser: ownerId,
    });
    if (!userCredit) {
      return res.status(404).json({ message: "User not found" });
    }

    hydrateLegacyTotals(userCredit);

    const index = userCredit.produit.findIndex((item) => item.id === productId);
    if (index === -1) {
      return res.status(404).json({ message: "Credit product not found" });
    }

    const line = userCredit.produit[index];
    const lineTotal = round2(toNumber(line.prix) * toNumber(line.Quantite, 1));
    const upfront = round2(toNumber(line.Paiement));
    const qty = Math.max(1, Math.floor(toNumber(line.Quantite, 1)));

    userCredit.produit.splice(index, 1);
    userCredit.Total = round2(Math.max(toNumber(userCredit.Total) - lineTotal, 0));
    userCredit.Paye = round2(Math.max(toNumber(userCredit.Paye) - upfront, 0));
    userCredit.Paye = Math.min(userCredit.Paye, userCredit.Total);
    userCredit.Qauntite = Math.max(toNumber(userCredit.Qauntite) - qty, 0);

    await userCredit.save();

    return res.json({
      message: "Credit product removed",
      user: buildCreditPayload(userCredit),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete User Cridite
export const DeleteUsercridite = async (req, res) => {
  const { id } = req.params;
  try {
    const ownerId = getOwnerId(req.user);
    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deleted = await UserCriditModele.findOneAndDelete({
      _id: id,
      idUser: ownerId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Not Found" });
    }

    return res.json(deleted);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
