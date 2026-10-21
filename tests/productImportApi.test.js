import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import process from "node:process";
import app from "../BackEnd/app.js";
import jwt from "../BackEnd/node_modules/jsonwebtoken/index.js";
import AdminModel from "../BackEnd/models/AdminModel.js";
import ProductModel from "../BackEnd/models/productModel.js";
import CategoryModel from "../BackEnd/models/Category.js";

const owner = "111111111111111111111111", otherOwner = "222222222222222222222222", categoryId = "333333333333333333333333";
const input = { rowNumber: 2, code_article: "AR00918", name: "Stylo محمد", categoryName: "École", barcode: "070330129665", prix_vente: "1,50", prix_gros: "1,22 €", prix_achat: "0,00", quantite: "728,00", status: "Actif" };
const query = (fn) => ({ select() { return this; }, session() { return this; }, lean() { return this; }, then(resolve, reject) { return Promise.resolve().then(fn).then(resolve, reject); } });
let server, base;
const secret = process.env.JWT_SECRET;
before(async () => {
  process.env.JWT_SECRET = "product-import-test-secret";
  server = app.listen(0, "127.0.0.1"); await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}/Product/Import`;
});
after(async () => { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); if (secret === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = secret; });
const request = async (rows, claims = { id: owner, idAdmin: otherOwner, role: "admin" }) => {
  const response = await fetch(base, { method: "POST", headers: { "Content-Type": "application/json", ...(claims ? { Authorization: `Bearer ${jwt.sign(claims, process.env.JWT_SECRET)}` } : {}) }, body: JSON.stringify({ rows }) });
  return { status: response.status, body: await response.json() };
};
function fixture(t) {
  const products = [], categories = [{ _id: categoryId, idAdmin: owner, name: "ECOLE" }];
  const init = t.mock.method(ProductModel, "init", async () => ProductModel);
  t.mock.method(AdminModel, "findById", (id) => query(() => id === owner ? { _id: owner } : null));
  t.mock.method(ProductModel, "find", (filter) => query(() => products.filter((product) => String(product.idAdmin) === filter.idAdmin)));
  t.mock.method(CategoryModel, "find", (filter) => query(() => categories.filter((category) => String(category.idAdmin) === filter.idAdmin)));
  t.mock.method(ProductModel, "findOne", (filter) => query(() => products.find((product) => String(product.idAdmin) === filter.idAdmin && filter.$or.some((branch) => Object.entries(branch).every(([key, value]) => product[key] === value)))));
  t.mock.method(CategoryModel, "findOne", (filter) => query(() => categories.find((category) => String(category.idAdmin) === filter.idAdmin && category.name === filter.name)));
  const insert = t.mock.method(ProductModel, "create", async (data) => {
    const product = new ProductModel(data); await product.validate();
    if (products.some((product) => String(product.idAdmin) === data.idAdmin && (product.importBarcodeKey === data.importBarcodeKey || (data.importArticleKey && product.importArticleKey === data.importArticleKey)))) throw Object.assign(new Error("duplicate"), { code: 11000 });
    products.push(product.toObject()); return product;
  });
  const createCategories = t.mock.method(CategoryModel, "create", async (data) => {
    const category = new CategoryModel(data); await category.validate(); categories.push(category.toObject()); return category;
  });
  return { products, categories, insert, createCategories, init };
}

test("import saves only to actor's shop and reuses categories; a retry skips saved products", async (t) => {
  const f = fixture(t);
  f.products.push({ idAdmin: otherOwner, barcode: input.barcode });
  const result = await request([{ ...input, idAdmin: otherOwner, _id: otherOwner, profite: 999, image: "/forged" }, { ...input, code_article: "AR002", barcode: "", name: "دفتر", categoryName: "Cahiers" }]);
  assert.equal(result.status, 201); assert.deepEqual(result.body, { created: 2, skipped: 0, categoriesCreated: 1 });
  const saved = f.products[1]; assert.equal(String(saved.idAdmin), owner); assert.equal(String(saved.categorie), categoryId);
  assert.equal(saved.prix_vente, 1.5); assert.equal(saved.prix_gros, 1.22); assert.equal(saved.quantite, 728); assert.equal(saved.profite, 1.5); assert.equal(saved.image, "");
  assert.equal(f.products[2].barcode, "AR002"); assert.equal(f.categories.length, 2);
  const repeated = await request([input, { ...input, code_article: "AR002", barcode: "", categoryName: "Cahiers" }]);
  assert.deepEqual(repeated.body, { created: 0, skipped: 2, categoriesCreated: 0 });
  assert.equal(f.products[1].quantite, 728); assert.equal(f.insert.mock.callCount(), 2);
});

test("existing products and duplicates are skipped without overwriting stock or prices", async (t) => {
  const f = fixture(t);
  f.products.push({ idAdmin: owner, barcode: input.barcode, quantite: 5, prix_vente: 100 });
  const result = await request([input, { ...input, barcode: "2", code_article: "AR2" }, { ...input, barcode: "2", code_article: "AR3" }]);
  assert.deepEqual(result.body, { created: 1, skipped: 2, categoriesCreated: 0 });
  assert.equal(f.products[0].quantite, 5); assert.equal(f.products[0].prix_vente, 100);
});

test("concurrent imports with stale previews create only one indexed product", async (t) => {
  const f = fixture(t);
  let reads = 0, release;
  const barrier = new Promise((resolve) => { release = resolve; });
  t.mock.method(ProductModel, "find", () => query(async () => { if (++reads === 2) release(); await barrier; return []; }));
  const results = await Promise.all([request([input]), request([input])]);
  assert.equal(results.reduce((sum, result) => sum + result.body.created, 0), 1);
  assert.equal(results.reduce((sum, result) => sum + result.body.skipped, 0), 1);
  assert.equal(f.products.length, 1);
});

test("invalid later row prevents writes and reports the exact source line", async (t) => {
  const f = fixture(t);
  const result = await request([input, { ...input, rowNumber: 24, quantite: "2,5" }]);
  assert.equal(result.status, 400); assert.equal(result.body.message, "invalidRows");
  assert.equal(result.body.rows[0].rowNumber, 24); assert.equal(f.init.mock.callCount(), 0); assert.equal(f.products.length, 0);
});

test("storage failure reports completed rows and supports retry without duplication", async (t) => {
  const f = fixture(t);
  let failWrite = true;
  f.insert.mock.mockImplementation(async (data) => {
    if (data.barcode === "SECOND" && failWrite) throw new Error("database failure");
    const product = new ProductModel(data); await product.validate(); f.products.push(product.toObject()); return product;
  });
  const rows = [input, { ...input, rowNumber: 3, code_article: "AR2", barcode: "SECOND", categoryName: "Nouveau" }];
  const result = await request(rows);
  assert.equal(result.status, 200); assert.equal(result.body.created, 1); assert.equal(result.body.failedRow, 3); assert.equal(result.body.remaining, 1); assert.equal(f.products.length, 1);
  failWrite = false;
  const retry = await request(rows);
  assert.deepEqual(retry.body, { created: 1, skipped: 1, categoriesCreated: 0 }); assert.equal(f.products.length, 2);
});

test("legacy category index conflict returns an actionable error without writes", async (t) => {
  const f = fixture(t);
  f.createCategories.mock.mockImplementation(async () => { throw Object.assign(new Error("duplicate category"), { code: 11000 }); });
  const result = await request([{ ...input, categoryName: "Nouveau" }]);
  assert.equal(result.status, 200); assert.equal(result.body.failureCode, "categoryConflict"); assert.equal(result.body.created, 0); assert.equal(f.products.length, 0);
});

test("missing token, employee and nonexistent admin cannot import", async (t) => {
  const f = fixture(t);
  assert.equal((await request([input], null)).status, 401); assert.equal((await request([input], { id: owner, role: "Employe" })).status, 403);
  assert.equal((await request([input], { id: otherOwner, role: "admin" })).status, 403); assert.equal(f.init.mock.callCount(), 0);
});

test("files exceeding the old 100 KB request limit reach validation and persist", async (t) => {
  const f = fixture(t);
  const rows = Array.from({ length: 600 }, (_, index) => ({ ...input, rowNumber: index + 2, name: "Produit avec un libellé et des informations", barcode: String(index).padStart(12, "0"), code_article: `AR${index}` }));
  assert.ok(JSON.stringify({ rows }).length > 100 * 1024);
  const result = await request(rows); assert.equal(result.status, 201); assert.equal(result.body.created, 600); assert.equal(f.products.length, 600);
});
