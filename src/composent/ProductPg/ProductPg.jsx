import { useState } from "react";
import "./Product.css"
import { IoFileTrayStackedOutline } from "react-icons/io5";
import { IoWalletOutline } from "react-icons/io5";
import { IoBagRemoveOutline } from "react-icons/io5";
import { IoBanOutline } from "react-icons/io5";
import ProductList from "./ProductList";
import { useSelector } from "react-redux";

export default function ProductPg() {
  const {Produts,loading } = useSelector((state)=>state.Product)
  const Total  = Produts.reduce((somme,item)=>{
    return somme+=item.prix_achat 
  },0)
  return (
    <div className="">
        <div className="flex p-6 gap-5">
   <div className="flex flex-wrap gap-6">
  <div className="ProductsCard flex items-center gap-3">
    <IoFileTrayStackedOutline size={35} color="azure"/>
    <div>
      <h1 className="text-[#ffffff87] text-sm">Count Product</h1>
      <h1 className="text-2xl font-bold">{Produts.length}</h1>
    </div>
  </div>

  <div className="ProductsCard flex items-center gap-3">
    <IoBagRemoveOutline size={35} color="azure"/>
    <div>
      <h1 className="text-[#ffffff87] text-sm">Low Stock</h1>
      <h1 className="text-2xl font-bold">5</h1>
    </div>
  </div>

  <div className="ProductsCard flex items-center gap-3">
    <IoBanOutline size={35} color="azure"/>
    <div>
      <h1 className="text-[#ffffff87] text-sm">Out Of Stock</h1>
      <h1 className="text-2xl font-bold">0</h1>
    </div>
  </div>

  <div className="ProductsCard flex items-center gap-3">
    <IoWalletOutline size={37} color="azure"/>
    <div>
      <h1 className="text-[#ffffff87] text-sm">Total Price</h1>
      <h1 className="text-2xl font-bold">{Total}dh</h1>
    </div>
  </div>
</div>



        </div>
        
        <div>
            <ProductList />
        </div>
    </div>
  )
}
