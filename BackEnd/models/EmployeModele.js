import mongoose from 'mongoose'

import bcrypt from "bcryptjs";

const ShemaEmploye = new mongoose.Schema(
    {
        idAdmin:Object,
        name:String,
        phone:String,
        cin:String,
        email:String,
        password:String,
        isActive:Boolean,
        color:String,
        action:{
            delete:{
                type:Boolean,
                default:false,
            },add:{
                   type:Boolean,
                default:false,
            },update:{
                   type:Boolean,
                default:false,
            }
        },
        role:{
            type:String,
            default:"Employe"
        },

       datecreate:{
        type:Date,
        default:new Date()
       },
           ventes:[
                        {
                       
                           idProduct :{
                            type:mongoose.Schema.Types.ObjectId,
                            ref:"Products"
                           },
                           name:String,
                           nameEmp:String,

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
                        nameEmp:String,
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

export default mongoose.model('Employes',ShemaEmploye)