import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateFacturePDF = (facture) => {
  if (!facture || !facture.Product?.length) return;

  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("FACTURE", 14, 15);

  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleString()}`, 14, 22);
  
  // ✅ التغيير هنا: استعمل facture عوض data
  doc.text(`Id: ${facture._id}`, 14, 28); // زدت شوية فـ Y باش ما يتراكبوش السطور

  autoTable(doc, {
    startY: 35,
    head: [["Nom", "Quantité", "Prix", "Total"]],
    body: facture.Product.map(p => [
      p.name,
      p.quantite,
      `${p.price} Dh`,
      `${p.TotalPrix} Dh`,
    ]),
  });

  const y = doc.lastAutoTable.finalY + 10;

  doc.text(`Total: ${facture.TotalPrix} Dh`, 14, y);
  doc.text(`Payé: ${facture.totalOrder} Dh`, 14, y + 6);
  doc.text(`Rendu: ${facture.PrixReture} Dh`, 14, y + 12);

  doc.save(`facture_${facture._id}.pdf`);
};