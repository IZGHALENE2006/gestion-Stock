    import mongoose from 'mongoose'


    export const ProductShema  = new mongoose.Schema(
        {
            idAdmin:{
             type: mongoose.Schema.Types.ObjectId,
             ref: "Admin"
             },
            name:String,
            image:{ type:String, default:"" },
            quantite:Number,
            barcode:String,
            code_article:{ type:String, trim:true, maxlength:80 },
            importBarcodeKey:{ type:String, select:false },
            importArticleKey:{ type:String, select:false },
            type_article:{ type:String, trim:true, maxlength:80 },
            stock_virtuel:{ type:Number, min:0 },
            stock_reel:{ type:Number, min:0 },
            prix_achat:Number,
            prix_vente:Number,
            prix_gros:{ type:Number, default:null, min:0 },
            frais_total:{ type:Number, default:0, min:0 },
            frais_quantite:{ type:Number, default:0, min:0 },
            frais_unitaire:{ type:Number, default:0, min:0 },
            profite:Number,
            categorie:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Categories",
                required:true
            },
            fournisseur:String,
            datecreate:Date,
            dateupdate:Date,
            status:Boolean
        
    }
    )
    // These indexes only cover imported records and do not alter legacy barcodes.
    ProductShema.index({ idAdmin:1, importBarcodeKey:1 }, { unique:true, partialFilterExpression:{ importBarcodeKey:{ $type:"string" } } });
    ProductShema.index({ idAdmin:1, importArticleKey:1 }, { unique:true, partialFilterExpression:{ importArticleKey:{ $type:"string" } } });
    export default mongoose.model("Products",ProductShema)
