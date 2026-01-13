import express from 'express'
import mongoose from 'mongoose'


const ShemaEmploye = new mongoose.Schema(
    {
        idAdmin:Object,
        name:String,
        phone:String,
        email:String,
        password:String,
        isActive:Boolean,
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
        }


    }
)
ShemaEmploye.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});
export default mongoose.model('Employes',ShemaEmploye)