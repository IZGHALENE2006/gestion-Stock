import mongoose  from "mongoose";
 
const UserCriditShema = new mongoose.Schema({
    idUser:{
           type:mongoose.Schema.Types.ObjectId,
           ref:"Admin"
    },
     name:{
        type:String,
        required:true
     },
    cin:{
      type:String
    },
    phone:{
      type:String
    },
  email:  {
    type:String
    },
     Qauntite:{
        type:Number,
        default:0,
        
     }
     ,
     Total:{
          type:Number,
        default:0
        }
,
Paye:{
    type:Number,
    default:0
},
Date:{
   type:Date,
   default:new Date()
},
produit:[
{
    id:String,
  nom:String,
  prix:Number,
  Paiement:Number,
  Quantite:Number
}

]
})
const UserCriditModele = mongoose.model("UserCridit",UserCriditShema)
export default UserCriditModele