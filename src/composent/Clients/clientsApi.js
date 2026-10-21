import axios from "axios";

const api = `${import.meta.env.VITE_API_URL || "http://localhost:7000"}/clients`;
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });
export const loadClients = async (signal) => (await axios.get(api, { headers: headers(), signal })).data;
export const loadCreditSummaries = async (signal) => (await axios.get(`${api}/credit-summary`, { headers: headers(), signal })).data;
export const loadClientCredit = async (id, signal) => (await axios.get(`${api}/${encodeURIComponent(id)}/credit`, { headers: headers(), signal })).data;
export const saveClientCreditPayment = async (clientId, invoiceId, input) => (await axios.post(`${api}/${encodeURIComponent(clientId)}/credit/${encodeURIComponent(invoiceId)}/payments`, input, { headers: headers() })).data;
export const saveClient = async (client, id) => (id
  ? await axios.put(`${api}/${encodeURIComponent(id)}`, client, { headers: headers() })
  : await axios.post(api, client, { headers: headers() })).data;
