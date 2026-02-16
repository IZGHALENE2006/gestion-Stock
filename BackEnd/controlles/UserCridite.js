import UserCriditModele from "../models/userCidit.js";



//Add User Cridite 

export const AddUserCridite = async (req, res) => {
  const { name, cin, email, phone } = req.body;

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const checkEmail = await UserCriditModele.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const checkCin = await UserCriditModele.findOne({ cin });
    if (checkCin) {
      return res.status(400).json({ message: "CIN already exists" });
    }

    const newUser = await UserCriditModele.create({
      idUser: req.user.id,
      name,
      cin,
      email,
      phone,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//Get all User cridit


export const AllUserCridite = async(req,res)=>{
try{
        const AllUserCridite = await UserCriditModele.find({idUser:req.user.id})
    if(!AllUserCridite) return res.status(404).json({message:"Not Fonnd"})
    res.json(AllUserCridite)
}catch(error){
    res.status(500).json(error.message)
   
}
}


//Delete User Cridite 
export const DeleteUsercridite = async(req,res)=>{
       const {id} = req.params
      try{
         const DeleteUsercridite = await UserCriditModele.findByIdAndDelete(id)
       if(!DeleteUsercridite) return res.status(404).json({message:"Not Found"})
        res.json(DeleteUsercridite)
      }catch(err){
             res.status(500).json({message:err.message})
      }
}