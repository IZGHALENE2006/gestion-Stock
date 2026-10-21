# Import des fournisseurs et de leurs factures

L’administrateur dispose du bouton **Importer Excel** dans la liste des fournisseurs
et dans les factures de chaque fournisseur. Formats : XLSX, XLS et CSV UTF-8 ;
5 Mo, 2 000 lignes par feuille, 20 feuilles et 64 colonnes maximum.
La lecture se fait dans un Web Worker. Un modèle vide est téléchargeable dans
chaque fenêtre. L’aperçu indique les données, erreurs et doublons avant confirmation.

## Fournisseurs

Colonnes : **Nom** (obligatoire), **Code fournisseur**, **Téléphone**, **Email**,
**Ville** (facultatives). Conserver les codes et téléphones comme texte dans Excel
pour préserver leurs zéros initiaux. Les formules doivent être remplacées par leurs valeurs.

Les doublons sont identifiés par code fournisseur, ou par l’ensemble nom,
téléphone, email et ville normalisés. Aucune information existante n’est écrasée.
Deux index uniques partiels par propriétaire protègent les nouveaux imports
concurrents ; ils ne s’appliquent pas aux anciens fournisseurs sans clés d’import.
Toutes les lignes sont validées avant la première insertion. Les insertions sont
ensuite individuelles, compatibles avec MongoDB standalone. Une interruption
retourne le nombre enregistré et la ligne d’arrêt ; une nouvelle tentative ignore
les fournisseurs déjà ajoutés.

`POST /Fournisseur/Import` reçoit `{ rows: [...] }` et retourne `{ created, skipped }`,
avec `failedRow`, `remaining` et `failureCode` en cas d’interruption partielle.

## Factures fournisseur

Importer depuis le compte du fournisseur concerné. Colonnes requises :
**Référence facture**, **Date**, **Produit**, **Quantité**, **Prix achat**.
Une ligne par produit ; les lignes portant la même référence constituent une facture.
La date peut figurer une seule fois pour le groupe. Dates acceptées : dates Excel,
`JJ/MM/AAAA`, `JJ.MM.AAAA` et `AAAA-MM-JJ`.

**Montant payé** est facultatif, zéro par défaut. Le renseigner une fois ou répéter
le même montant pour chaque produit de la facture ; ces répétitions ne sont pas
additionnées. **Total facture** et **Reste à payer** sont facultatifs et comparés
aux montants recalculés. Des dates ou montants contradictoires bloquent l’import.
Les montants sont exprimés en DH, sans conversion de devises.

**Fournisseur** et **ID fournisseur** sont facultatifs. S’ils figurent dans le
fichier, ils doivent correspondre au compte ouvert. Les produits restent des
lignes de facture, sans création de produit ni mouvement de stock.

Les références existantes sont ignorées sans modifier leurs règlements.
Les nouvelles factures, leurs produits et les paiements initiaux sont ajoutés en
une seule écriture atomique sur le fournisseur. En cas de référence enregistrée
concurremment, la requête retourne 409 ; l’aperçu est actualisé avant une nouvelle
tentative. L’historique, les soldes et l’export PDF utilisent les factures habituelles.

`POST /Fournisseur/:id/invoices/import` reçoit `{ rows: [...] }` et retourne
`{ created, skipped }` (nombre de factures, pas de lignes).
Les deux routes vérifient le compte administrateur en base et la propriété des données.

Les tests génèrent leurs fichiers et simulent la persistance ; ils n’écrivent pas
dans les données réelles du magasin.
