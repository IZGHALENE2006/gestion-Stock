import { useState } from "react";
import "./Product.css"
import { IoFileTrayStackedOutline } from "react-icons/io5";
import { IoWalletOutline } from "react-icons/io5";
import { IoBagRemoveOutline } from "react-icons/io5";
import { IoBanOutline } from "react-icons/io5";
import Dialog from "../Dialog/Dialog";
import ProductList from "./ProductList";


export default function ProductPg() {
    const [open , setOpen] = useState(false)

  return (
    <div>
        <div className="flex p-6 gap-5">
            <div className="ProductsCard flex justify-center items-center gap-5">
                <div>
                    <IoFileTrayStackedOutline size={35} color="azure"/>
                </div>
                <div className="text-xl">
                    <h1 className="text-[#ffffff87]">Count Product</h1>
                    <h1 className="ml-3 text-2xl"><b>15</b></h1>
                </div>

            </div>
            <div className="ProductsCard flex justify-center items-center gap-5">
                <div>
                    <IoBagRemoveOutline size={35} color="azure"/>
                </div>
                <div className="text-xl">
                    <h1 className="text-[#ffffff87]">Low Stock</h1>
                    <h1 className="ml-3 text-2xl"><b>5</b></h1>
                </div>
            </div>
            <div className="ProductsCard flex justify-center items-center gap-5">
                <div>
                    <IoBanOutline size={35} color="azure"/>
                </div>
                <div className="text-xl">
                    <h1 className="text-[#ffffff87]">Out Of Stock</h1>
                    <h1 className="ml-3 text-2xl"><b>0</b></h1>
                </div>
            </div>
            <div className="ProductsCard flex justify-center items-center gap-5">
                <div>
                    <IoWalletOutline size={37} color="azure"/>
                </div>
                <div className="text-xl">
                    <h1 className="text-[#ffffff87]">Total Price</h1>
                    <h1 className="ml-2"><b>20.00 dh</b></h1>
                </div>
            </div>


        </div>
        
        <div>
            <ProductList />
        </div>


            <Dialog isOpen={open} onClose={() => setOpen(false)} title="Product Details">
                    <input type="text" />
            </Dialog>










    </div>
  )
}
