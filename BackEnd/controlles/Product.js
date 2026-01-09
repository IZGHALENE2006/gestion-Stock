import ProductModel from '../models/productModel.js';

// Add New Product
export const CreateProduct = async (req, res) => {
    try {
        const { name, quantite, barcode, prix_achat, prix_vente, categorie, fournisseur, datecreate, status } = req.body;

        const newProduct = await ProductModel.create({
            idAdmin: req.user.id,
            name,
            quantite: Number(quantite), // Ensure it's stored as a number
            barcode,
            prix_achat,
            prix_vente,
            categorie,
            fournisseur,
            datecreate,
            status
        });

        if (!newProduct) return res.status(404).json({ message: "Not Found" });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const AllProduct = async (req, res) => {
    try {
        const products = await ProductModel.find({ idAdmin: req.user.id });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};