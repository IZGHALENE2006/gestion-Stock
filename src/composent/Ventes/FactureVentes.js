import { autoTable } from "jspdf-autotable";
import i18n from "../../i18n/index.js";
import { createPdfDocument, pdfTableStyles, pdfLtr } from "../../utils/createPdfDocument.js";

export const createFactureVentesPDF = async (facture) => {
  if (!facture || !facture.length) return;

  const t = i18n.getFixedT(i18n.language);
  const locale = i18n.language === "ar" ? "ar-MA" : "fr-MA";
  const rtl = i18n.dir() === "rtl";
  const doc = await createPdfDocument({ rtl });
  const x = rtl ? doc.internal.pageSize.getWidth() - 14 : 14;
  const textOptions = { align: rtl ? "right" : "left" };
  const orderColumns = (row) => rtl ? [...row].reverse() : row;
  const totalProfit = facture.reduce((sum, item) => sum + Number(item.profite || 0), 0);

  doc.setFontSize(16);
  doc.setFont("Amiri", "bold");
  doc.text(t("salesPdf.salesReportTitle"), x, 15, textOptions);

  doc.setFont("Amiri", "normal");
  doc.setFontSize(12);
  doc.text(`${t("salesPdf.date")}: ${pdfLtr(new Date().toLocaleString(locale))}`, x, 23, textOptions);

  autoTable(doc, {
    startY: 35,
    ...pdfTableStyles(rtl),
    columnStyles: { [rtl ? 4 : 2]: { minCellWidth: 22 } },
    head: [
      orderColumns([
        t("salesPdf.seller"),
        t("salesPdf.product"),
        t("salesPdf.quantity"),
        t("salesPdf.salePrice"),
        t("salesPdf.profit"),
        t("salesPdf.dateColumn"),
        t("salesPdf.timeColumn"),
      ]),
    ],
    body: facture.map((p) => {
      const [datePart, timePart] = String(p.DateVante || "").split("T");
      const time = timePart ? timePart.split(".")[0] : "-";
      return orderColumns([
        p.nameEmp || "-",
        p.name || "-",
        p.quantite || 0,
        `${Number(p.price || 0).toFixed(2)} DH`,
        `+ ${Number(p.profite || 0).toFixed(2)} DH`,
        datePart || "-",
        time,
      ]);
    }),
  });

  let y = doc.lastAutoTable.finalY + 10;
  if (y > doc.internal.pageSize.getHeight() - 14) {
    doc.addPage();
    y = 20;
  }
  doc.text(`${t("salesPdf.totalDailySales")}: ${pdfLtr(`${totalProfit.toFixed(2)} DH`)}`, x, y, textOptions);

  return doc;
};

export const generateFactureVentesPDF = async (facture) => {
  const doc = await createFactureVentesPDF(facture);
  if (doc) doc.save("sales_report.pdf");
};
