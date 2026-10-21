import { readProductWorkbook } from "../../../shared/productWorkbook.js";

self.onmessage = ({ data }) => {
  try { self.postMessage({ sheets: readProductWorkbook(data) }); }
  catch (error) { self.postMessage({ error: error.message }); }
};
