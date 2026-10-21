import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import process from "node:process";
import app from "../BackEnd/app.js";
import jwt from "../BackEnd/node_modules/jsonwebtoken/index.js";
import Admin from "../BackEnd/models/AdminModel.js";
import Supplier from "../BackEnd/models/Fournisseur.js";
import Product from "../BackEnd/models/productModel.js";

const owner = "111111111111111111111111", otherOwner = "222222222222222222222222", supplierId = "333333333333333333333333";
const contact = { externalCode: "F01", name: "Fournisseur محمد", phone: "0612345678", email: "contact@example.ma", Ville: "Fès" };
const line = { reference: "FA-001", invoiceDate: "13/10/2026", name: "دفتر", quantity: "2,5", unitPrice: "10,20 DH", amountPaid: "5,50" };
const query = (fn) => ({ select() { return this; }, lean() { return this; }, then(resolve, reject) { return Promise.resolve().then(fn).then(resolve, reject); } });
const secret = process.env.JWT_SECRET;
let server, base;
before(async () => {
  process.env.JWT_SECRET = "supplier-import-test-secret";
  server = app.listen(0, "127.0.0.1"); await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}/Fournisseur`;
});
after(async () => {
  server.closeAllConnections(); await new Promise((resolve) => server.close(resolve));
  if (secret === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = secret;
});
const claims = { id: owner, idAdmin: otherOwner, role: "admin" };
const request = async (rows, suffix = "/Import", auth = claims) => {
  const res = await fetch(base + suffix, { method: "POST", headers: { "Content-Type": "application/json", ...(auth ? { Authorization: `Bearer ${jwt.sign(auth, process.env.JWT_SECRET)}` } : {}) }, body: JSON.stringify({ rows }) });
  return { status: res.status, body: await res.json() };
};
function fixture(t) {
  const records = [new Supplier({ ...contact, _id: supplierId, idAdmin: owner })];
  const context = { records, beforeWrite: null };
  const scope = (doc, filter) => String(doc.idAdmin) === String(filter.idAdmin) && (!filter._id || String(doc._id) === String(filter._id));
  t.mock.method(Admin, "findById", (id) => query(() => [owner, otherOwner].includes(id) ? { _id: id } : null));
  t.mock.method(Supplier, "find", (filter) => query(() => records.filter((doc) => scope(doc, filter)).map((doc) => doc.toObject())));
  t.mock.method(Supplier, "findOne", (filter) => query(() => records.find((doc) => scope(doc, filter) && (!filter.$or || filter.$or.some((branch) => Object.entries(branch).every(([key, value]) => doc[key] === value))))?.toObject()));
  const init = t.mock.method(Supplier, "init", async () => Supplier);
  const insert = t.mock.method(Supplier, "create", async (data) => {
    const doc = new Supplier(data); await doc.validate();
    if (records.some((item) => String(item.idAdmin) === data.idAdmin && ((data.importCodeKey && item.importCodeKey === data.importCodeKey) || item.importFingerprintKey === data.importFingerprintKey))) throw Object.assign(new Error("Duplicate"), { code: 11000 });
    records.push(doc); return doc;
  });
  const update = t.mock.method(Supplier, "findOneAndUpdate", async (filter, patch, options) => {
    if (context.beforeWrite) { const action = context.beforeWrite; context.beforeWrite = null; action(); }
    const doc = records.find((item) => scope(item, filter));
    if (!doc || doc.invoices.some((invoice) => filter["invoices.reference"].$nin.includes(invoice.reference))) return null;
    assert.equal(options.runValidators, true);
    doc.invoices.push(...patch.$push.invoices.$each); await doc.validate();
    return new Supplier(doc.toObject());
  });
  for (const method of ["create", "updateOne", "findOneAndUpdate", "bulkWrite"]) t.mock.method(Product, method, () => { throw new Error("Supplier imports must never change stock"); });
  return Object.assign(context, { insert, update, init });
}

test("supplier import uses the authenticated owner, preserves zeros and skips duplicates on retry", async (t) => {
  const f = fixture(t);
  const rows = [{ ...contact, name: "New", externalCode: "F02", idAdmin: otherOwner, invoices: [{ total: 999 }] }];
  assert.deepEqual(await request(rows), { status: 201, body: { created: 1, skipped: 0 } });
  const saved = f.records[1]; assert.equal(String(saved.idAdmin), owner); assert.equal(saved.phone, "0612345678"); assert.equal(saved.invoices.length, 0);
  assert.deepEqual((await request(rows)).body, { created: 0, skipped: 1 });
  assert.equal(f.insert.mock.callCount(), 1);
});
test("existing manual suppliers and file duplicates are skipped without changing their data", async (t) => {
  const f = fixture(t);
  const result = await request([contact, { name: "New" }, { name: " New " }]);
  assert.deepEqual(result.body, { created: 1, skipped: 2 });
  assert.equal(f.records[0].phone, contact.phone); assert.equal(f.records.length, 2);
});
test("supplier validation is complete before writing and reports actual Excel row numbers", async (t) => {
  const f = fixture(t);
  const result = await request([{ name: "New" }, { name: "Bad", email: "invalid", rowNumber: 25 }]);
  assert.equal(result.status, 400); assert.equal(result.body.rows[0].rowNumber, 25);
  assert.equal(f.insert.mock.callCount(), 0); assert.equal(f.init.mock.callCount(), 0);
});
test("a partial supplier import reports its progress and safely resumes", async (t) => {
  const f = fixture(t);
  let attempts = 0;
  f.insert.mock.mockImplementation(async (data) => {
    if (++attempts === 2) throw new Error("Unavailable");
    const doc = new Supplier(data); await doc.validate(); f.records.push(doc); return doc;
  });
  const rows = [{ name: "One", rowNumber: 5 }, { name: "Two", rowNumber: 8 }];
  const first = await request(rows);
  assert.deepEqual(first.body, { created: 1, skipped: 0, failedRow: 8, remaining: 1, failureCode: "importFailed" });
  assert.deepEqual((await request(rows)).body, { created: 1, skipped: 1 });
  assert.equal(f.records.length, 3);
});
test("concurrent supplier imports cannot insert a duplicate code with stale previews", async (t) => {
  const f = fixture(t); let reads = 0, release;
  const barrier = new Promise((resolve) => { release = resolve; });
  t.mock.method(Supplier, "find", () => query(async () => { if (++reads === 2) release(); await barrier; return []; }));
  const results = await Promise.all([request([{ ...contact, externalCode: "NEW", name: "New" }]), request([{ ...contact, externalCode: "NEW", name: "New" }])]);
  assert.equal(results.reduce((sum, result) => sum + result.body.created, 0), 1);
  assert.equal(results.reduce((sum, result) => sum + result.body.skipped, 0), 1);
  assert.equal(f.records.length, 2);
});
test("supplier invoice import groups lines and stores initial payment once without touching stock", async (t) => {
  const f = fixture(t);
  const rows = [line, { ...line, name: "Second", quantity: 3, unitPrice: "1,50", total: 30, remaining: 24.5, productId: otherOwner, supplierName: contact.name }];
  const result = await request(rows, `/${supplierId}/invoices/import`);
  assert.deepEqual(result, { status: 201, body: { created: 1, skipped: 0 } });
  const invoice = f.records[0].invoices[0];
  assert.equal(invoice.items.length, 2); assert.equal(invoice.total, 30); assert.equal(invoice.amountPaid, 5.5);
  assert.equal(invoice.supplierName, contact.name); assert.equal(invoice.invoiceDate, "2026-10-13");
  assert.equal(invoice.payments.length, 1); assert.equal(invoice.payments[0].amount, 5.5);
  assert.equal(invoice.items[1].productId, null);
  assert.deepEqual((await request(rows, `/${supplierId}/invoices/import`)).body, { created: 0, skipped: 1 });
  assert.equal(f.update.mock.callCount(), 1);
});
test("invalid invoices prevent the whole batch, including invalid totals and wrong supplier", async (t) => {
  const f = fixture(t);
  for (const patch of [{ amountPaid: 999 }, { total: 999 }, { invoiceDate: "31/02/2026" }, { supplierName: "Another" }, { supplierId: otherOwner }, { quantity: 0 }]) {
    const result = await request([line, { ...line, reference: "FA-002", ...patch }], `/${supplierId}/invoices/import`);
    assert.equal(result.status, 400); assert.equal(result.body.message, "invalidRows");
  }
  assert.equal(f.update.mock.callCount(), 0); assert.equal(f.records[0].invoices.length, 0);
});
test("atomic invoice batch detects concurrent references and can be retried without duplicates", async (t) => {
  const f = fixture(t);
  f.beforeWrite = () => f.records[0].invoices.push({ reference: line.reference, requestId: "another", invoiceDate: "2026-10-13", supplierName: contact.name, items: [], total: 25.5, amountPaid: 0 });
  const rows = [line, { ...line, reference: "FA-002" }];
  assert.equal((await request(rows, `/${supplierId}/invoices/import`)).status, 409);
  assert.equal(f.records[0].invoices.length, 1);
  assert.deepEqual((await request(rows, `/${supplierId}/invoices/import`)).body, { created: 1, skipped: 1 });
  assert.equal(f.records[0].invoices[0].amountPaid, 0); assert.equal(f.records[0].invoices.length, 2);
});
test("both import endpoints require an active administrator and enforce supplier ownership", async (t) => {
  const f = fixture(t);
  for (const suffix of ["/Import", `/${supplierId}/invoices/import`]) {
    assert.equal((await request([], suffix, null)).status, 401);
    assert.equal((await request([], suffix, { id: owner, role: "Employe" })).status, 403);
    assert.equal((await request([], suffix, { id: "444444444444444444444444", role: "admin" })).status, 403);
  }
  assert.equal((await request([line], `/${supplierId}/invoices/import`, { id: otherOwner, role: "admin" })).status, 404);
  assert.equal((await request([line], "/invalid/invoices/import")).status, 404);
  assert.equal(f.update.mock.callCount(), 0); assert.equal(f.insert.mock.callCount(), 0);
});
test("large valid import passes the route body limit and remains bounded by row count", async (t) => {
  fixture(t);
  const rows = Array.from({ length: 600 }, (_, index) => ({ name: `Supplier ${index} ` + "a".repeat(170), externalCode: `F${index}` }));
  assert.ok(JSON.stringify({ rows }).length > 100 * 1024);
  assert.deepEqual((await request(rows)).body, { created: 600, skipped: 0 });
  assert.equal((await request(Array(2001).fill(contact))).status, 400);
});
