import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateFactureVentesPDF = (facture) => {

  if (!facture || !facture.length) return;

  const doc = new jsPDF();
  const TotalProfite = facture.reduce((somme, t) => (somme += t.profite), 0);

  doc.setFontSize(16);
  doc.text("FACTURE", 14, 15);

  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleString()}`, 14, 22);
  
//   doc.text(`Id: ${facture._id}`, 14, 28);    

  autoTable(doc, {
    startY: 35,
    head: [['Employe',"Nom", "Quantité", "Prix_Vente","Profite", "Date","temps"]],
    body: facture.map(p => [
      p.nameEmp,
      p.name,
      p.quantite,
      `${p.price} Dh`,
      `+ ${p.profite} Dh`,
   
    ]),
  });

  const y = doc.lastAutoTable.finalY + 10;

  doc.text(`Ventes du Jour: ${TotalProfite} Dh`, 14, y);

  doc.save(`facture.pdf`);
};