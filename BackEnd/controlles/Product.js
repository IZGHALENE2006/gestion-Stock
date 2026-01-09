import express  from 'express'
import ProductModel from '../models/productModel.js'
//Add New Product
export const CreateProduct = async(req,res)=>{
const {name,quantite ,barcode,prix_achat,prix_vente,categorie, fournisseur,datecreate,status}  = req.body

const newProduct = await ProductModel.create({
   idAdmin:req.user.id,
    name,
   quantite,
   barcode,
   prix_achat,
   prix_vente,
   categorie,
   fournisseur,
   datecreate,
   status


})
if(!newProduct) return res.status(404).json({message:"Not Found"})
 res.status(201).json(newProduct)

}

//Get All Product Where idAmin
export const AllProduct = async(req,res)=>{
    const AllProduct = await ProductModel.find({idAdmin:req.user.id})
  res.status(201).json(AllProduct)

}