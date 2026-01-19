import EmployeModel from '../models/EmployeModele.js';
import AdminModel from '../models/AdminModel.js';
import productModel from '../models/productModel.js';
import mongoose from 'mongoose';

export const AddVente = async (req, res) => {
  try {
    const ventes = Array.isArray(req.body) ? req.body : req.body.cart;
   
    if (!ventes || ventes.length === 0) {
      return res.status(400).json({ message: "السلة فارغة" });
    }

    const userId = req.user.id;
    let user = await AdminModel.findById(userId) || await EmployeModel.findById(userId);

    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

    const ventesAjoutees = [];

    for (const item of ventes) {


      if (!item.id || !item.qty) continue; 

      const product = await productModel.findById(item.id)
      if (!product) continue

      const singleProfit = product.prix_vente - product.prix_achat;
      const totalProfit = singleProfit * Number(item.qty);

      const nouvelleVente = {
        idProduct: product._id,
        name: product.name,
        nameEmp:user.name,
        price: Number(item.price || product.prix_vente), 
        quantite: Number(item.qty),
        profite: totalProfit,
        DateVante: new Date(),
      }

      //Add New Facture 

      user.ventes.push(nouvelleVente);
      ventesAjoutees.push(nouvelleVente);
       const nouvelleFacture = {
        name: product.name,
        price: Number(item.price ||product.prix_vente),
        quantite: Number(item.qty),
        TotalPrix: Number(item.price)*Number(item.qty),
      };
      
       user.Facture.Product.push(nouvelleFacture)
      product.quantite = (product.quantite || 0) - Number(item.qty);
      await product.save();
    }

    await user.save();

    return res.status(201).json({
      message: "تمت العملية بنجاح",
      lastVentes: ventesAjoutees
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
