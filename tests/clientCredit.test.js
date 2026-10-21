import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import process from "node:process";
import app from "../BackEnd/app.js";
import jwt from "../BackEnd/node_modules/jsonwebtoken/index.js";
import AdminModel from "../BackEnd/models/AdminModel.js";
import EmployeModel from "../BackEnd/models/EmployeModele.js";
import Client from "../BackEnd/models/Client.js";
import LegacyCredit from "../BackEnd/models/userCidit.js";

const owner = "111111111111111111111111", foreign = "222222222222222222222222", employee = "333333333333333333333333";
const clientId = "444444444444444444444444", foreignClient = "555555555555555555555555";
const invoiceId = "666666666666666666666666", employeeInvoice = "777777777777777777777777";
const requestId = "12345678-1234-4234-8234-123456789012";
const claims = { id: owner, role: "admin" };
const secret = process.env.JWT_SECRET;
let server, base;
before(async () => {
  process.env.JWT_SECRET = "client-credit-test-secret";
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
  if (secret === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = secret;
});
const request = (path = `/clients/${clientId}/credit`, body, auth = claims) => fetch(base + path, {
  method: body === undefined ? "GET" : "POST",
  headers: { "Content-Type": "application/json", ...(auth ? { Authorization: `Bearer ${jwt.sign(auth, process.env.JWT_SECRET)}` } : {}) },
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});
const query = (fn) => ({ select() { return this; }, sort() { return this; }, lean() { return this; }, then(resolve, reject) { return Promise.resolve().then(fn).then(resolve, reject); } });
const clone = (doc) => doc == null ? null : structuredClone(doc);
function setup(t) {
  const invoice = (id, client = clientId) => ({ _id: id, clientId: client, clientName: "Client original", invoiceOrigin: "manual", isCredit: true, TotalPrix: 120, amountPaid: 20, creditPaidCents: 2000, creditInitialPaid: 20, creditPayments: [], creditRequestHash: "private-request-digest", DateFacture: "2026-10-10T10:00:00Z" });
  const admin = { _id: owner, name: "Owner", Facture: [invoice(invoiceId), { _id: "888888888888888888888888", clientId, TotalPrix: 999, amountPaid: 999 }] };
  const staff = { _id: employee, name: "Employee", idAdmin: owner, Facture: [invoice(employeeInvoice)] };
  const foreignAdmin = { _id: foreign, Facture: [invoice("999999999999999999999999", foreignClient)] };
  const clients = [{ _id: clientId, idAdmin: owner, name: "Client renommé", phone: "0612345678" }, { _id: foreignClient, idAdmin: foreign, name: "Foreign client" }];
  const actors = [admin, staff, foreignAdmin];
  const actorScope = (actor, scope) => (!scope._id || actor._id === String(scope._id)) && (!scope.idAdmin || actor.idAdmin === String(scope.idAdmin));
  const invoiceScope = (item, scope) => item._id === String(scope._id) && item.clientId === String(scope.clientId) && item.isCredit === scope.isCredit;
  const reads = t.mock.method(AdminModel, "findById", (id) => query(() => clone([admin, foreignAdmin].find((actor) => actor._id === String(id)))));
  t.mock.method(EmployeModel, "find", (scope) => query(() => actorScope(staff, scope) ? [clone(staff)] : []));
  t.mock.method(Client, "findOne", (scope) => query(() => clone(clients.find((client) => client._id === scope._id && client.idAdmin === String(scope.idAdmin)))));
  t.mock.method(Client, "find", (scope) => query(() => clone(clients.filter((client) => client.idAdmin === String(scope.idAdmin) && scope._id.$in.includes(client._id)))));
  const writes = [];
  for (const [Model, candidates] of [[AdminModel, [admin, foreignAdmin]], [EmployeModel, [staff]]]) {
    t.mock.method(Model, "findOne", (scope) => query(() => clone(candidates.find((actor) => actorScope(actor, scope) && actor.Facture.some((item) => invoiceScope(item, scope.Facture.$elemMatch))))));
    const update = t.mock.method(Model, "findOneAndUpdate", async (scope, patch, options) => {
      assert.equal(options.runValidators, true);
      const actor = candidates.find((item) => actorScope(item, scope));
      const match = scope.Facture.$elemMatch;
      const found = actor?.Facture.find((item) => invoiceScope(item, match) && item.creditPaidCents === match.creditPaidCents && !item.creditPayments.some((payment) => payment.requestId === match["creditPayments.requestId"].$ne));
      if (!found) return null;
      assert.ok(patch.$set["Facture.$.creditPaidCents"] <= found.TotalPrix * 100);
      found.creditPaidCents = patch.$set["Facture.$.creditPaidCents"];
      found.amountPaid = patch.$set["Facture.$.amountPaid"];
      found.creditPayments.push(clone(patch.$push["Facture.$.creditPayments"]));
      return clone(actor);
    });
    writes.push(update);
  }
  const legacy = [{ _id: "aaaaaaaaaaaaaaaaaaaaaaaa", idUser: owner, name: "Legacy client", Total: 80, Paye: 15, produit: [], paymentHistory: [] }];
  t.mock.method(LegacyCredit, "find", (scope) => query(() => clone(legacy.filter((item) => item.idUser === String(scope.idUser)))));
  return { admin, staff, clients, actors, reads, writes };
}
const paymentPath = (id = invoiceId, client = clientId) => `/clients/${client}/credit/${id}/payments`;

test("client account aggregates its admin and employee invoices and excludes cash invoices", async (t) => {
  setup(t);
  const response = await request(); assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.client.name, "Client renommé");
  assert.equal(data.invoices.length, 2);
  assert.equal(data.invoices[0].clientName, "Client original");
  assert.ok(data.invoices.every((invoice) => !Object.hasOwn(invoice, "creditRequestHash")));
  assert.deepEqual(data.summary, { total: 240, paid: 40, remaining: 200, count: 2 });
  assert.deepEqual(await (await request("/clients/credit-summary")).json(), { [clientId]: data.summary });
});

test("cashier credit appears in the client account and Crédit and accepts later payments", async (t) => {
  const fixture = setup(t);
  fixture.staff.Facture[0].invoiceOrigin = "cashier";
  const account = await (await request()).json();
  assert.equal(account.invoices.find((invoice) => invoice._id === employeeInvoice).invoiceOrigin, "cashier");
  assert.equal(account.summary.remaining, 200);
  const payment = await request(paymentPath(employeeInvoice), { amount: 40, requestId });
  assert.equal(payment.status, 200);
  assert.equal((await payment.json()).summary.remaining, 160);
  const credits = await (await request("/usercridite/get")).json();
  assert.equal(credits.find((client) => client.clientId === clientId).summary.remaining, 160);
});
test("Crédit includes registered clients and their current balances alongside legacy accounts", async (t) => {
  setup(t);
  const response = await request("/usercridite/get"); assert.equal(response.status, 200);
  const list = await response.json(); assert.equal(list.length, 2);
  assert.deepEqual(list[0].summary, { total: 240, paid: 40, remaining: 200, count: 2 });
  assert.equal(list[0].clientId, clientId); assert.equal(list[0].source, "clientInvoices");
  assert.equal(list[1].name, "Legacy client"); assert.equal(list[1].summary.remaining, 65);
});
for (const id of [invoiceId, employeeInvoice]) test(`payment updates invoice ${id}, history and all balances; retry is idempotent`, async (t) => {
  const f = setup(t);
  const input = { amount: 30.25, note: " Espèce ", requestId };
  const response = await request(paymentPath(id), input); assert.equal(response.status, 200);
  const data = await response.json();
  assert.deepEqual(data.summary, { total: 240, paid: 70.25, remaining: 169.75, count: 2 });
  const invoice = data.invoices.find((item) => item._id === id);
  assert.equal(invoice.amountPaid, 50.25); assert.equal(invoice.creditInitialPaid, 20);
  assert.equal(invoice.creditPayments.length, 1); assert.equal(invoice.creditPayments[0].note, "Espèce");
  const retry = await request(paymentPath(id), input); assert.equal(retry.status, 200);
  assert.deepEqual((await retry.json()).summary, data.summary);
  assert.equal(f.writes.reduce((count, mock) => count + mock.mock.callCount(), 0), 1);
  const changed = await request(paymentPath(id), { ...input, amount: 30 }); assert.equal(changed.status, 409);
  assert.equal((await changed.json()).message, "creditRequestConflict");
});
test("settlement leaves the invoice and payment history visible without debt", async (t) => {
  setup(t);
  for (const id of [invoiceId, employeeInvoice]) assert.equal((await request(paymentPath(id), { amount: 100, requestId })).status, 200);
  const data = await (await request()).json();
  assert.equal(data.summary.remaining, 0);
  assert.ok(data.invoices.every((item) => item.creditSummary.status === "settled" && item.creditPayments.length === 1));
  const list = await (await request("/usercridite/get")).json();
  assert.equal(list[0].summary.remaining, 0);
});
test("overpayment, invalid amounts and unauthorized or foreign access never write", async (t) => {
  const f = setup(t);
  for (const body of [{ amount: 101, requestId }, { amount: 0, requestId }, { amount: -1, requestId }, { amount: 20 }, { amount: 20, requestId, note: {} }]) assert.equal((await request(paymentPath(), body)).status, 400);
  assert.equal((await request(undefined, undefined, null)).status, 401);
  assert.equal((await request(undefined, undefined, { id: employee, role: "Employe", idAdmin: owner })).status, 403);
  assert.equal((await request(paymentPath(), { amount: 20, requestId }, { id: employee, role: "Employe" })).status, 403);
  assert.equal((await request(undefined, undefined, { id: foreign, role: "admin" })).status, 404);
  assert.equal((await request(paymentPath(), { amount: 20, requestId }, { id: foreign, role: "admin" })).status, 404);
  assert.equal((await request(paymentPath("999999999999999999999999"), { amount: 20, requestId })).status, 404);
  assert.equal((await request("/clients/invalid/credit")).status, 404);
  assert.equal(f.writes.reduce((count, mock) => count + mock.mock.callCount(), 0), 0);
});
test("two concurrent payments cannot overpay or lose a payment", async (t) => {
  setup(t);
  const responses = await Promise.all([
    request(paymentPath(), { amount: 60, requestId }),
    request(paymentPath(), { amount: 60, requestId: "12345678-1234-4234-8234-123456789013" }),
  ]);
  assert.equal(responses.filter((response) => response.status === 200).length, 1);
  assert.ok(responses.some((response) => [400, 409].includes(response.status)));
  const invoice = (await (await request()).json()).invoices.find((item) => item._id === invoiceId);
  assert.equal(invoice.creditPayments.length, 1);
  assert.equal(invoice.creditSummary.paid, 80); assert.equal(invoice.creditSummary.remaining, 40);
});
test("a concurrent balance change returns a retryable conflict and never overwrites it", async (t) => {
  const f = setup(t);
  f.writes[0].mock.mockImplementation(async () => {
    f.admin.Facture[0].creditPaidCents = 3000;
    f.admin.Facture[0].amountPaid = 30;
    return null;
  });
  const response = await request(paymentPath(), { amount: 20, requestId });
  assert.equal(response.status, 409); assert.equal((await response.json()).message, "creditPaymentConflict");
  assert.equal(f.admin.Facture[0].creditPaidCents, 3000);
});
