import EmployeModel from '../models/EmployeModele.js'

//Add Employe 

export const AddEmploye= async(req,res)=>{
    const {name,phone,cin,email,password,color,isActive} =req.body
    const item  = await EmployeModel.findOne({email})
     if(item) return res.status(400).json({message:"email if exite"})
        const cinExist = await EmployeModel.findOne({ cin });
if (cinExist) {
  return res.status(400).json({ message: "CIN already exists" });
}

    if (!cin) {
      return res.status(400).json({ message: "CIN is required" });
    }
    if (!name) {
      return res.status(400).json({ message: "nom is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }
      if (!password) {
      return res.status(400).json({ message: "password is required" });
    }
    if (cin.length < 6 || cin.length > 8) {
      return res.status(400).json({ message: "CIN length must be between 6 and 8 digits" });
    }

        const newEmploye  = await EmployeModel.create({
        idAdmin :req.user.id || null,
        name,
         cin,
        phone,
       
        email,
        password,
        color,
        isActive
        
    })
    if(!newEmploye) return res.status(404).json({message:"Not Found"})
     res.status(201).json(newEmploye)
}

//LoginEmploye 
export const LoginEmploye = async(req,res)=>{
    const {email,password} = req.body
       const Employes = await EmployeModel.findOne({email})
     if (!Employes) return res.status(404).json({message: "Email incorrect"} )
    const isMatch  = await bcrypt.compare(password,Employes.password)   
        if(!isMatch) return res.status(404).json({ message: "Password incorrect" });

        if(Employes.isActive==false){
            res.status(404).json("Votre compte a été temporairement suspendu par l’administrateur")
        }   
        //create Token
        const Token = jwt.sign(
            {
                id:Employes._id,
                role:Employes.role
            },
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        )
        
  
        res.json(
            {
                Token,
                Employe:{
                    id:Employes._id,
                    name:Employes.name,
                    email:Employes.email,
                     role:Employes.role   
                }
            }
        )
}

//Get All employe

export const AllEmploye = async(req,res)=>{
    const AllEmp = await EmployeModel.find({idAdmin:req.user.id})
    res.status(200).json(AllEmp)
}