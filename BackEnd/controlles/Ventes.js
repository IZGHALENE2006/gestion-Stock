import EmployeModel from '../models/EmployeModele.js';
import AdminModel from '../models/AdminModel.js';
import productModel from '../models/productModel.js';
import mongoose from 'mongoose';
import { calculateCartTotals, roundMoney } from '../../shared/saleTotals.js';
import { getProductSalePrice } from '../../shared/productPricing.js';
import { PAYMENT_METHOD_VALUES } from '../../shared/paymentMethods.js';
import { resolveDocumentClient } from '../utils/documentClient.js';
import { createHash } from 'node:crypto';
import { creditCents, creditError, validCreditRequestId } from '../../shared/invoiceCredit.js';

const creditRequestsInFlight = new Set();

export const AddVente = async (req, res) => {
  let creditLockKey;
  try {
    const ventes = req.body.cart;
    const { discountType = "percent", discountValue = 0, amountPaid, clientName = "", invoiceOrigin = "cashier", paymentMethod, vatRate } = req.body;
    const { isCredit = false, requestId } = req.body;
    if (typeof isCredit !== "boolean") throw creditError("creditInvalidMode");
    if (isCredit && !req.body.clientId) throw creditError("creditClientRequired");
    if (isCredit && !validCreditRequestId(requestId)) throw creditError("creditInvalidRequest");
    const creditRequestHash = isCredit ? createHash("sha256").update(JSON.stringify({ cart: ventes, clientId: req.body.clientId, amountPaid, discountType, discountValue, paymentMethod, vatRate, ...(invoiceOrigin === "cashier" ? { invoiceOrigin } : {}) })).digest("hex") : undefined;

    if (!["manual", "cashier"].includes(invoiceOrigin)) {
      return res.status(400).json({ message: "invalidInvoiceOrigin" });
    }

    if (typeof clientName !== "string" || clientName.trim().length > 160) {
      return res.status(400).json({ message: "invalidClientName" });
    }

    if (paymentMethod !== undefined && !PAYMENT_METHOD_VALUES.includes(paymentMethod)) {
      return res.status(400).json({ message: "invalidPaymentMethod" });
    }

    if (!Array.isArray(ventes) || ventes.length === 0) {
      return res.status(400).json({ message: "السلة فارغة" });
    }

    const userId = req.user.id;
    if (isCredit) {
      const key = `${userId}:${requestId}`;
      if (creditRequestsInFlight.has(key)) throw creditError("creditInProgress", 409);
      creditRequestsInFlight.add(key);
      creditLockKey = key;
    }
    const user =
      (await AdminModel.findById(userId)) ||
      (await EmployeModel.findById(userId));

    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    const previous = requestId && user.Facture.find((invoice) => invoice.creditRequestId === requestId);
    if (previous) {
      if (!isCredit || previous.creditRequestHash !== creditRequestHash) throw creditError("creditRequestConflict", 409);
      return res.status(200).json({ facture: previous, ventes: [], lastVentes: [] });
    }
    if (isCredit) {
      if (user.role !== "admin" && user.isActive === false) throw creditError("creditForbidden", 403);
    }
    const owner = user.role === "admin" ? user._id : user.idAdmin;
    const client = await resolveDocumentClient({ clientId: req.body.clientId, clientName }, owner);
    const lines = [];
    const productIds = new Set();
    for (const item of ventes) {
      const qty = Number(item?.qty);
      if (!mongoose.isValidObjectId(item?.id) || !Number.isInteger(qty) || qty <= 0 || productIds.has(item.id)) {
        return res.status(400).json({ message: "Invalid cart item" });
      }
      productIds.add(item.id);

      const product = await productModel.findById(item.id);
      if (!product || String(product.idAdmin) !== String(isCredit ? owner : req.user.idAdmin)) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (qty > product.quantite) {
        return res.status(400).json({ message: `Insufficient stock: ${product.name}` });
      }
      const priceType = item.priceType === undefined ? 'retail' : item.priceType;
      let price;
      try {
        price = getProductSalePrice(product, priceType);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
      lines.push({ product, qty, price, priceType, discountType: item.discountType, discountValue: item.discountValue, vatRate: item.vatRate });
    }

    let totals;
    try {
      totals = calculateCartTotals(lines, discountType, discountValue, vatRate);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
    const received = Number(amountPaid);
    if (isCredit) {
      if (creditCents(amountPaid) > creditCents(totals.total)) throw creditError("creditPaymentExceeded");
    } else if (
      !["number", "string"].includes(typeof amountPaid) || String(amountPaid).trim() === "" ||
      !Number.isFinite(received) || received < 0 || roundMoney(received) < totals.total
    ) {
      return res.status(400).json({ message: "Invalid or insufficient payment" });
    }

    const hasVat = invoiceOrigin === "manual" || vatRate !== undefined || lines.some((line) => line.vatRate !== undefined);
    const facture = {
      Product: [],
      nameEmp: user.name,
      ...client,
      invoiceOrigin,
      ...(isCredit ? { isCredit: true, creditPaidCents: creditCents(amountPaid), creditInitialPaid: roundMoney(received), creditPayments: [], creditRequestId: requestId, creditRequestHash } : {}),
      ...(paymentMethod !== undefined ? { paymentMethod } : {}),
      ...(hasVat ? {
        vatRate: totals.vatRate, vatAmount: totals.vatAmount, totalHT: totals.totalHT,
      } : {}),
      TotalQauntite: 0,
      subtotal: totals.subtotal,
      discountType: totals.discountType,
      discountValue: totals.discountValue,
      discountAmount: totals.discountAmount,
      lineDiscountAmount: totals.lineDiscountAmount,
      orderDiscountAmount: totals.orderDiscountAmount,
      TotalPrix: totals.total,
      totalOrder: totals.total,
      amountPaid: roundMoney(received),
      PrixReture: isCredit ? 0 : roundMoney(received - totals.total),
    };
    const firstSaleIndex = user.ventes.length;

    for (const [index, { product, qty, price, priceType }] of lines.entries()) {
      const line = totals.lines[index];
      user.ventes.push({
        idProduct: product._id,
        name: product.name,
        price,
        priceType,
        quantite: qty,
        profite: roundMoney(line.totalHT - (Number(product.prix_achat || 0) + Number(product.frais_unitaire || 0)) * qty),
        DateVante: new Date(),
      });

      facture.Product.push({
        idProduct: product._id,
        code: String(product.barcode || ""),
        name: product.name,
        price,
        priceType,
        quantite: qty,
        subtotal: line.subtotal,
        discountType: line.discountType,
        discountValue: line.discountValue,
        discountAmount: line.discountAmount,
        TotalPrix: line.total,
        ...(hasVat ? {
          vatRate: line.vatRate, vatAmount: line.vatAmount, totalHT: line.totalHT,
          totalTTC: line.totalTTC, orderDiscountAmount: line.orderDiscountAmount,
        } : {}),
      });
      facture.TotalQauntite += qty;

      product.quantite -= qty;
      await product.save();
    }

    user.Facture.push(facture);
    await user.save();

    res.status(201).json({
      message: "success Operation",
      facture: user.Facture[user.Facture.length - 1],
      ventes: user.ventes.slice(firstSaleIndex),
      lastVentes: user.ventes.slice(firstSaleIndex),
    });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally { if (creditLockKey) creditRequestsInFlight.delete(creditLockKey); }
};

