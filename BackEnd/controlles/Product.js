import ProductModel from '../models/productModel.js';
import CategoryModel from '../models/Category.js';
import { deleteProductImage, saveProductImage } from '../utils/productImages.js';
import { resolveProductFees } from '../../shared/productFees.js';
import { roundMoney } from '../../shared/saleTotals.js';

const errorStatus = (error) => ['ValidationError', 'CastError'].includes(error.name) || ['invalidWholesalePrice', 'invalidPrice', 'invalidFees', 'invalidFeeQuantity'].includes(error.message) ? 400 : 500;
const withCategory = (product, category) => ({
  ...product.toObject(),
  categorie: { _id: category._id, name: category.name },
});

export const CreateProduct = async (req, res) => {
  let uploadedImage = '';
  try {
    const { name, quantite, barcode, prix_achat, categorie, fournisseur, datecreate, status } = req.body;
    const cleanBarcode = String(barcode || '').trim();
    const pricing = resolveProductFees(req.body);
    const category = await CategoryModel.findOne({ _id: categorie, idAdmin: req.user.idAdmin });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    if (!cleanBarcode) return res.status(400).json({ message: 'Barcode is required' });
    const barcodeExists = await ProductModel.findOne({ idAdmin: req.user.idAdmin, barcode: cleanBarcode });
    if (barcodeExists) return res.status(400).json({ message: 'Barcode already exists' });

    uploadedImage = await saveProductImage(req.file);
    const product = await ProductModel.create({
      idAdmin: req.user.idAdmin, name, quantite: Number(quantite), barcode: cleanBarcode,
      prix_achat, ...pricing, profite: roundMoney(pricing.prix_vente - Number(prix_achat) - pricing.frais_unitaire),
      categorie: category._id, fournisseur, datecreate, status, image: uploadedImage,
    });
    uploadedImage = '';
    return res.status(201).json(withCategory(product, category));
  } catch (error) {
    await deleteProductImage(uploadedImage);
    return res.status(errorStatus(error)).json({ message: error.message });
  }
};

export const AllProduct = async (req, res) => {
  try {
    const products = await ProductModel.find({ idAdmin: req.user.idAdmin }).populate('categorie', 'name');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const DeleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findOneAndDelete({ _id: req.params.id, idAdmin: req.user.idAdmin });
    if (!product) return res.status(404).json({ message: 'Not Found' });
    await deleteProductImage(product.image);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(errorStatus(error)).json({ message: error.message });
  }
};

export const UpdateProduit = async (req, res) => {
  let uploadedImage = '';
  try {
    const filter = { _id: req.params.id, idAdmin: req.user.idAdmin };
    const currentProduct = await ProductModel.findOne(filter);
    if (!currentProduct) return res.status(404).json({ message: 'Not Found' });
    const { name, quantite, prix_achat, categorie, fournisseur, barcode, removeImage } = req.body;
    const pricing = resolveProductFees(req.body, currentProduct);
    const cleanBarcode = String(barcode || '').trim();
    const category = await CategoryModel.findOne({ _id: categorie, idAdmin: req.user.idAdmin });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    if (!cleanBarcode) return res.status(400).json({ message: 'Barcode is required' });
    const barcodeExists = await ProductModel.findOne({
      idAdmin: req.user.idAdmin, barcode: cleanBarcode, _id: { $ne: req.params.id },
    });
    if (barcodeExists) return res.status(400).json({ message: 'Barcode already exists' });

    const update = {
      name, quantite: Number(quantite), barcode: cleanBarcode, prix_achat, ...pricing,
      profite: roundMoney(pricing.prix_vente - Number(prix_achat) - pricing.frais_unitaire), categorie: category._id, fournisseur,
      dateupdate: new Date(),
    };
    if (currentProduct.code_article !== undefined) update.importBarcodeKey = cleanBarcode;
    if (req.file) {
      uploadedImage = await saveProductImage(req.file);
      update.image = uploadedImage;
    } else if (removeImage === true || removeImage === 'true') {
      update.image = '';
    }
    const product = await ProductModel.findOneAndUpdate(filter, update, { new: true, runValidators: true });
    if (!product) {
      await deleteProductImage(uploadedImage);
      return res.status(404).json({ message: 'Not Found' });
    }
    uploadedImage = '';
    if (Object.hasOwn(update, 'image') && currentProduct.image !== update.image) {
      await deleteProductImage(currentProduct.image);
    }
    return res.status(200).json(withCategory(product, category));
  } catch (error) {
    await deleteProductImage(uploadedImage);
    return res.status(errorStatus(error)).json({ message: error.message });
  }
};
