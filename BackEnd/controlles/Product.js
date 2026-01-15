import ProductModel from '../models/productModel.js';

// Add New Product
export const CreateProduct = async (req, res) => {
    try {
        const { name, quantite, barcode, prix_achat, prix_vente, categorie, fournisseur, datecreate, status } = req.body;

        const newProduct = await ProductModel.create({
            idAdmin: req.user.idAdmin,
            name,
            quantite: Number(quantite), 
            barcode,
            prix_achat,
            prix_vente,
            categorie,
            fournisseur,
            datecreate,
            status
        });

        if (!newProduct) return res.status(404).json({ message: "Not Found" });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//get All Product
export const AllProduct = async (req, res) => {
    try {
        const products = await ProductModel.find( {idAdmin: req.user.idAdmin});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Delete Product
export const DeleteProduct = async(req,res)=>{
    const {id} = req.params
    try{
       const currentproduct = await ProductModel.findByIdAndDelete(id)
       if(!currentproduct) return res.status(404).json({message:"Not Found"})
        res.status(200).json(currentproduct)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Update Product\
export const UpdateProduit = async(req,res)=>{
    const {id} = req.params
    const {name,quantite,prix_achat,prix_vente,categorie,fournisseur} = req.body

    try{
       const newProduct = await ProductModel.findByIdAndUpdate(id,{
           
            name,
            quantite: Number(quantite), 
      
            prix_achat,
            prix_vente,
            categorie,
            fournisseur,
         

       },{
        new:true
       })
       if(!newProduct) return res.status(404).json({message:"Not Found"})
    res.status(200).json(newProduct)

    }catch(err){
        res.status(500).json({ message: error.message });

    }
}