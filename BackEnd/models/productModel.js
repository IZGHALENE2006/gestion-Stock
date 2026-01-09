import mongoose from 'mongoose'


export const ProductShema  = new mongoose.Schema(
    {
        idAdmin:Object,
        name:String,
        quantite:Number,
        barcode:String,
        prix_achat:Number,
        prix_vente:Number,
        categorie:String,
        fournisseur:String,
        datecreate:Date,
        dateupdate:Date,
        status:Boolean

}
)

export default mongoose.model("Products",ProductShema)
