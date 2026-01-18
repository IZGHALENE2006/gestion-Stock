    import mongoose from 'mongoose'


    export const ProductShema  = new mongoose.Schema(
        {
            idAdmin:{
             type: mongoose.Schema.Types.ObjectId,
             ref: "Admin"
             },
            name:String,
            quantite:Number,
            barcode:String,
            prix_achat:Number,
            prix_vente:Number,
            profite:Number,
            categorie:String,
            fournisseur:String,
            datecreate:Date,
            dateupdate:Date,
            status:Boolean
        
    }
    )
    export default mongoose.model("Products",ProductShema)
