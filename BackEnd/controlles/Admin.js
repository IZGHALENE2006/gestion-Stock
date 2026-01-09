import Admin from '../models/AdminModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
//Register Admin
export const CreatAdmin = async(req,res)=>{
    const {name,email,password}  = req.body
       const Admins = await Admin.findOne({email})
     if(Admins) return res.status(400).json({message:"email if exite"})
    const admin = await Admin.create({name,email,password})
    if(!admin) return res.status(404).json({message:"Not Found"})
        res.status(201).json(admin)    
}

//Login Admin

export const LoginAdmin = async(req,res)=>{
    const {email,password} = req.body
       const Admins = await Admin.findOne({email})
     if (!Admins) return res.status(404).json({message: "Email incorrect"} )
    const isMatch  = await bcrypt.compare(password,Admins.password)   
        if(!isMatch) return res.status(404).json({ message: "Password incorrect" });
        //create Token
        const Token = jwt.sign(
            { id:Admins._id,
                role: "admin"   
             },
            process.env.JWT_SECRET,
            { expiresIn:"1d" })
            //res
        res.json(
            {
                Token,
                admin:{
                    id:Admins._id,
                    name:Admins.name,
                    email:Admins.email,
                     role: "admin"   
                }
            }
        )
}