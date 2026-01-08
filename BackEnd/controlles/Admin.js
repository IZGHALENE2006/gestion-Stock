import Admin from '../models/AdminModel.js'

export const CreatAdmin = async(req,res)=>{
    const {name,email,password}  = req.body
       const Admins = await Admin.findOne({email})
     if(Admins) return res.status(400).json({message:"email if exite"})
    const admin = await Admin.create({name,email,password})
    if(!admin) return res.status(404).json({message:"Not Found"})
        res.status(201).json(admin)    
}

