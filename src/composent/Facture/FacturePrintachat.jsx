import { forwardRef } from "react";

const FacturePrint = forwardRef(({ facture, user }, ref) => {
  if (!facture) return null;
  return (
    <div ref={ref} style={{ padding: 20, width: 300 }}>
      <h2 style={{ textAlign: "center" }}> FACTURE DE ACHAT</h2>

      <p>Employé: {user.name} {facture?.DateFacture}</p>
      <hr />
<table className="w-full border-collapse text-sm text-center">
  <thead>
    <tr className="border-b border-gray-300">
      <th className="py-2 px-1 font-semibold">Nom</th>
      <th className="py-2 px-1 font-semibold">Qté</th>
      <th className="py-2 px-1 font-semibold">Prix</th>
      <th className="py-2 px-1 font-semibold">Total</th>
    </tr>
  </thead>

  <tbody>
    {facture?.Product?.map((t, i) => (
      <tr
        key={i}
        className="border-b border-dashed border-gray-200 last:border-none"
      >
        <td className="py-1 px-1">{t.name}</td>
        <td className="py-1 px-1">{t.quantite}</td>
        <td className="py-1 px-1">{t.price.toFixed(2)} Dh</td>
        <td className="py-1 px-1 font-medium">{t.TotalPrix.toFixed(2)} Dh</td>
      </tr>
    ))}
  </tbody>
</table>




      <hr />
      <p>Total Qté: {facture.TotalQauntite}</p>
      <p>Total: {facture.TotalPrix.toFixed(2)} Dh</p>
      <p>Payé: {(facture.totalOrder + facture.PrixReture).toFixed(2)} Dh</p>
      <p>Retour: {facture.PrixReture.toFixed(2)} Dh</p>

      <p style={{ textAlign: "center", marginTop: 10 }}>
        Merci pour votre achat 
      </p>
    </div>
  );
});

export default FacturePrint;
