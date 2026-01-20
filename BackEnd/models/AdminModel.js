import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { data } from "react-router";
const AdminShema = new mongoose.Schema(
        {
            name:String,
            email:String,
            password :String,
            role:{
              type:String,
              default:"admin"
            },
           ventes:[
                       {
                       
                           idProduct:{
                            type:mongoose.Schema.Types.ObjectId,
                            ref:"Products"
                           },
                           name:String,

                           price:Number,
                           quantite:Number,
                           profite : Number,
                           DateVante :{
                            type:Date,
                            default:Date.now

                           }
       
                       }
                   ],
                   Facture:[
                    {
                      Product:[
                        {
                          name:String,
                          price:Number,
                          quantite:Number,
                          TotalPrix:Number
                        }
                      ],
                      TotalQauntite:Number,
                      TotalPrix:Number,
                      totalOrder:Number,
                      PrixReture:Number,
                             DateFacture :{
                            type:Date,
                            default:Date.now

                           }
                    }
                   ]

        }
)
AdminShema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("Admin",AdminShema)