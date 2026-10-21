import AdminModel from "../models/AdminModel.js";
import ProductModel from "../models/productModel.js";
import CategoryModel from "../models/Category.js";
import { planProductImport, normalizeImportText } from "../../shared/productImport.js";
import { roundMoney } from "../../shared/saleTotals.js";

const fail = (message, status = 400, details = {}) => Object.assign(new Error(message), { status, ...details });

export async function importProducts(req, res) {
  try {
    if (req.user?.role !== "admin") throw fail("forbidden", 403);
    const actor = await AdminModel.findById(req.user.id).select("_id");
    if (!actor) throw fail("forbidden", 403);
    const owner = String(actor._id);
    const initial = planProductImport(req.body?.rows);
    if (initial.errorCount) throw fail("invalidRows", 400, { rows: initial.rows.filter((row) => row.errors.length).map(({ rowNumber, errors }) => ({ rowNumber, errors })) });
    const products = await ProductModel.find({ idAdmin: owner }).select("barcode code_article").lean();
    const plan = planProductImport(req.body.rows, products);
    const pending = plan.rows.filter((row) => !row.duplicate);
    const result = { created: 0, skipped: plan.duplicateCount, categoriesCreated: 0 };
    if (!pending.length) return res.status(201).json(result);
    // Wait for the unique import indexes before writing, including on standalone MongoDB.
    await ProductModel.init();
    const categories = await CategoryModel.find({ idAdmin: owner }).lean();
    const byName = new Map(categories.map((category) => [normalizeImportText(category.name), category]));
    for (const [index, { data, rowNumber }] of pending.entries()) {
      try {
        const { categoryName, ...product } = data;
        const key = normalizeImportText(categoryName);
        let category = byName.get(key);
        if (!category) {
          try {
            category = await CategoryModel.create({ idAdmin: owner, name: categoryName, DateCreate: new Date() });
            result.categoriesCreated += 1;
          } catch (error) {
            if (error.code !== 11000) throw error;
            // Another import may have created it. Never adopt another shop's category.
            category = await CategoryModel.findOne({ idAdmin: owner, name: categoryName });
            if (!category) throw fail("categoryConflict", 409);
          }
          byName.set(key, category);
        }
        try {
          await ProductModel.create({ ...product, idAdmin: owner, categorie: category._id,
            importBarcodeKey: product.barcode,
            ...(product.code_article ? { importArticleKey: product.code_article.toLowerCase() } : {}),
            image: "", frais_total: 0, frais_quantite: 0, frais_unitaire: 0,
            profite: roundMoney(product.prix_vente - product.prix_achat), datecreate: new Date() });
          result.created += 1;
        } catch (error) {
          if (error.code !== 11000) throw error;
          // Indexed keys make concurrent imports and retries safe without overwriting products.
          const existing = await ProductModel.findOne({ idAdmin: owner, $or: [
            { barcode: product.barcode }, ...(product.code_article ? [{ importArticleKey: product.code_article.toLowerCase() }] : []),
          ] }).select("_id");
          if (!existing) throw error;
          result.skipped += 1;
        }
      } catch (error) {
        return res.status(200).json({ ...result, failedRow: rowNumber, remaining: pending.length - index, failureCode: error.message === "categoryConflict" ? "categoryConflict" : "importFailed" });
      }
    }
    res.status(201).json(result);
  } catch (error) {
    const validation = ["emptyFile", "tooManyRows"].includes(error.message);
    res.status(error.status || (validation ? 400 : 500)).json({ message: error.status || validation ? error.message : "importFailed", ...(error.rows ? { rows: error.rows } : {}) });
  }
}
