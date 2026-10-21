# Import des produits

Depuis **Produits → Importer Excel**, charger un fichier `.xlsx`, `.xls` ou `.csv`
(5 Mo, 2 000 lignes par feuille, 64 colonnes, 20 feuilles maximum). Une seule
feuille est importée à la fois. Le modèle Excel est téléchargeable dans la fenêtre.

Les colonnes reconnues correspondent au catalogue de référence : Code article,
Libellé, Type d’article, Catégories, PV HT, Prix gros, Prix achat, Stock, Code barre,
Stock virtuel, Stock réel, Statut. Fournisseur est facultatif.

- `PV HT` devient le prix de vente ; les montants sont repris en DH sans conversion.
- Stock est sélectionné par défaut ; Stock réel ou Stock virtuel peuvent être choisis.
- Sans code barre, le code article sert d’identifiant. Stocker les codes en texte
  dans Excel pour préserver leurs zéros initiaux. Les formules doivent être remplacées
  par leurs valeurs avant l’import.
- Les catégories du fichier sont réutilisées ou créées. Il est aussi possible de
  choisir une catégorie existante pour tous les produits du fichier.
- Les produits existants (code barre ou code article) et les doublons du fichier sont
  ignorés. L’import ne modifie ni leurs quantités ni leurs prix.
- Toutes les lignes doivent être valides avant de pouvoir confirmer l’import.
- Code article, type d’article, stock virtuel et stock réel sont conservés. Les deux
  derniers sont des valeurs à l’import ; les mouvements ultérieurs portent sur `quantite`.

`POST /Product/Import` est réservé à un administrateur authentifié et reçoit
`{ rows: [...] }`. Le serveur revalide les valeurs, vérifie les doublons et déduit le
propriétaire du compte en base. Il retourne `{ created, skipped, categoriesCreated }`.

L’import fonctionne aussi sur MongoDB standalone. Toutes les lignes sont validées
avant la première écriture, puis les produits sont enregistrés individuellement.
En cas d’échec de stockage, la réponse ajoute `failedRow`, `remaining` et `failureCode`
aux compteurs. La fenêtre conserve le bilan et propose de réessayer les produits
restants ; les produits déjà enregistrés sont alors ignorés. Une catégorie nouvellement
créée reste disponible même si l’enregistrement de son produit a échoué.

Deux index uniques partiels sur les identifiants d’import empêchent des imports
concurrents de créer le même code barre ou code article dans un magasin. Ils ne
s’appliquent pas aux produits historiques, et l’import attend leur création avant
d’écrire. Ils ne changent pas la gestion des ajouts manuels existants.

Le modèle historique de catégories possède un index global unique sur le nom. Si ce
dernier empêche une création, l’import renvoie `categoryConflict` et peut être relancé
avec une catégorie existante choisie dans la fenêtre. Cet import ne supprime aucun index.

Lecture des fichiers dans un Web Worker via
[SheetJS CE 0.20.3](https://docs.sheetjs.com/docs/getting-started/installation/frameworks/),
installé depuis sa distribution officielle. Les tests utilisent des fichiers générés
et une base simulée, sans écrire dans les données du magasin.
