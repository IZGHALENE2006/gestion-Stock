
import CategoryModel from '../models/Category.js'

//Add New Category
export const AddCategory = async(req,res)=>{
    const {name,DateCreate} = req.body
try{
        const NewCategory = await CategoryModel.create({
        idAdmin:req.user.id,
        name,
        DateCreate
    })
  if(!NewCategory) return res.status(404).json({message:"Not Found"})
    res.satus(201).json(NewCategory)
}catch(err){
    res.status(500).json({message:"Server Error"})
}
}
//All Category
export const GetCategory = async(req,res)=>{
    const Categoreis = await CategoryModel.find({idAdmin:req.user.id})
    res.json(Categoreis)
}