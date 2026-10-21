const keys = {
  "Email incorrect": "errors.invalidCredentials",
  "Password incorrect": "errors.invalidCredentials",
  "Email et password obligatoires": "errors.requiredFields",
  "email if exite": "errors.emailExists",
  "Email already exists": "errors.emailExists",
  "CIN already exists": "employees.cinExists",
  "Name is required": "employees.nameRequired",
  "Current password incorrect": "errors.currentPasswordWrong",
  "Password not confirmed": "changePassword.notMatch",
  "Unauthorized": "errors.unauthorized",
  "No token provided": "errors.unauthorized",
  "Invalid token": "errors.unauthorized",
  "User not found": "errors.notFound",
  "Product not found": "errors.notFound",
  "Not Found": "errors.notFound",
  "Credit product not found": "errors.notFound",
  "Invalid cart item": "errors.invalidCart",
  "Invalid or insufficient payment": "invoiceCreate.invalidPayment",
  "Product name is required": "creditDetails.productNameRequired",
  "Price must be greater than 0": "creditDetails.priceGreaterThanZero",
  "Payment must be greater than 0": "creditDetails.paymentGreaterThanZero",
  "Paid amount cannot exceed credit line total": "creditDetails.initialPaymentExceeded",
  "السلة فارغة": "cashier.cartEmpty",
  "المستخدم غير موجود": "errors.notFound",
};

export function apiErrorMessage(error, t, fallback = "errors.requestFailed") {
  const message = typeof error === "string" ? error : error?.response?.data?.message || error?.message;
  if (keys[message]) return t(keys[message]);
  if (message?.startsWith("Insufficient stock: ")) return t("errors.stockChanged", { name: message.slice(20) });
  const exceeded = message?.match(/^Payment exceeds remaining amount \((.+) DH\)$/);
  if (exceeded) return t("errors.paymentExceeded", { amount: exceeded[1] });
  return t(fallback);
}
