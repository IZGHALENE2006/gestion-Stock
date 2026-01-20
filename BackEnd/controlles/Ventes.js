import EmployeModel from '../models/EmployeModele.js';
import AdminModel from '../models/AdminModel.js';
import productModel from '../models/productModel.js';
import mongoose from 'mongoose';

export const AddVente = async (req, res) => {
  try {
    const ventes = req.body.cart;
    const { changeToReturn, totalOrder } = req.body;

    if (!ventes || ventes.length === 0) {
      return res.status(400).json({ message: "السلة فارغة" });
    }

    const userId = req.user.id;
    const user =
      (await AdminModel.findById(userId)) ||
      (await EmployeModel.findById(userId));

    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    const facture = {
      Product: [],
      TotalQauntite: 0,
      TotalPrix: 0,
      totalOrder: Number(totalOrder),
      PrixReture: Number(changeToReturn),
    };

    const ventesAjoutees = [];

    for (const item of ventes) {
      if (!item.id || !item.qty) continue;

      const product = await productModel.findById(item.id);
      if (!product) continue;

      const qty = Number(item.qty);
      const price = Number(item.price || product.prix_vente);

      user.ventes.push({
        idProduct: product._id,
        name: product.name,
        nameEmp: user.name,
        price,
        quantite: qty,
        profite: (product.prix_vente - product.prix_achat) * qty,
        DateVante: new Date(),
      });

      facture.Product.push({
        name: product.name,
        price,
        quantite: qty,
        TotalPrix: price * qty,
      });

      facture.TotalQauntite += qty;
      facture.TotalPrix += price * qty;

      product.quantite -= qty;
      await product.save();
    }

    user.Facture.push(facture);
    await user.save();

    res.status(201).json({
      message: "success Operation",
      facture,
      ventes: ventesAjoutees,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

