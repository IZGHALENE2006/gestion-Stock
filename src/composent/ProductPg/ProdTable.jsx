import { IoInformationCircleOutline } from "react-icons/io5";
import { MdDeleteForever, MdDeleteOutline, MdPrint } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { DeleteProduit, GetAllProduct } from "../../slices/SliceProduct";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef, forwardRef } from "react";
import ConfirmDelete from "../Dialog/ConfirmDelete";
import Dialog from "../Dialog/Dialog";
import {
  HiOutlineHashtag, HiOutlineCube, HiOutlineTag,
  HiOutlineUser, HiOutlineCalendar, HiOutlineCash,
  HiOutlineTrendingUp
} from "react-icons/hi";
import { FaPrint } from "react-icons/fa";

import toast, { Toaster } from 'react-hot-toast';
import { useReactToPrint } from "react-to-print";
import JsBarcode from "jsbarcode";
import UpdateProduit from "./updateProduit";

// Separate component for the printable area to avoid style conflicts
const PrintContainer = forwardRef(({ product }, ref) => {
  if (!product) return null;
  const labels = Array.from({ length: product.quantite || 0 });

  return (
    <div ref={ref} style={{ padding: "1px 1px", display: "flex", flexWrap: "wrap", gap: "15px" }}>
      {labels.map((_, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: "5px", textAlign: "center", width: "200px" }}>
          <p style={{ fontSize: "10px", fontWeight: "bold", margin: "0 0 2px 0" }}>{product.name}</p>
          <BarcodeDisplay value={product.barcode} />
          <p style={{ fontSize: "10px", margin: "2px 0 0 0" }}>{product.prix_vente} Dh</p>
        </div>
      ))}
    </div>
  );
});

// Extracted BarcodeDisplay for reuse
const BarcodeDisplay = ({ value }) => {
  const barcodeRef = useRef(null);
  useEffect(() => {
    if (barcodeRef.current && value) {
      JsBarcode(barcodeRef.current, value, {
        format: "EAN13",
        lineColor: "#000",
        width: 1.5,
        height: 50,
        displayValue: true,
        fontSize: 14,
        background: "transparent"
      });
    }
  }, [value]);
  return <svg ref={barcodeRef} className="mx-auto"></svg>;
};

export default function ProdTable() {
  const Dispatch = useDispatch();
  const printRef = useRef();

  const { Produts, loading } = useSelector((state) => state.Product);
  const [openDailgoConfirmation, setOpenDailgoConfirmation] = useState(false);
  const [iddelete, setIdDelete] = useState('');
  const [openInfo, setOpenInfo] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

const handlePrint = useReactToPrint({
  contentRef: printRef, // Use contentRef instead of content callback
  documentTitle: `Barcodes_${selectedProduct?.name}`,
});

  const InfoItem = ({ icon, label, value, subValue, subColor = "text-gray-400" }) => (
    <div className="flex gap-3">
      <div className="mt-1 text-xl">{icon}</div>
      <div>
        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tight">{label}</p>
        <p className="text-md font-semibold text-gray-800">{value}</p>
        {subValue && <p className={`text-[9px] font-medium ${subColor}`}>{subValue}</p>}
      </div>
    </div>
  );

  function HandleOpenDelete(id) {
    setIdDelete(id);
    setOpenDailgoConfirmation(true);
  }

  function HandleOpenInfo(product) {
    setSelectedProduct(product);
    setOpenInfo(true);
  }

  function HandleconfiremeDEleteProduit() {
    Dispatch(DeleteProduit(iddelete))
    setOpenDailgoConfirmation(false);
    toast.success('Product Delete Succefuly.', {
      icon: <MdDeleteForever size={22} />,
      style: { border: '1px solid #d40700', padding: '16px', color: '#d40700', backgroundColor: "#fffffe" },
    });
  }
  //LogicUpdate
//State open
const [openupdate,setopeopenupdaten] = useState(false)
const [idupdate2,setidupdate] = useState('')
//function HandleopenUpdate
function handleopenUpdate(id){
  setopeopenupdaten(true)
  setidupdate(id)
  
}
  useEffect(() => {
    Dispatch(GetAllProduct());
  }, [Dispatch]);

  if (loading) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="">
      <div className="relative overflow-x-auto shadow-md">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-[#2C74B3] text-white">
            <tr>
              <th scope="col" className="px-6 py-3">Product name</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Buy Price</th>
              <th scope="col" className="px-6 py-3">Category</th>
              <th scope="col" className="px-6 py-3">Quantity</th>
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Produts && Produts.map((item, index) => {
              const isLowStock = item.quantite < 10;
              return (
                <tr key={item._id || index} className="border-b border-gray-500 hover:bg-[#2C74B3]/35 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                  <td className="px-6 py-4 font-bold">
                    <span style={{ color: item.quantite > 0 ? "#00ce00" : "#ff4d4d" }}>
                      {item.quantite > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.prix_achat ? item.prix_achat.toFixed(2) : "0.00"} Dh</td>
                  <td className="px-6 py-4">{item.categorie}</td>
                  <td className="px-6 py-4 font-bold">
                    <span style={{ color: isLowStock ? "#ff4d4d" : "azure" }}>{item.quantite}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3" onClick={()=>handleopenUpdate(item._id)}>
                      <CiEdit size={22} className="text-sky-500 cursor-pointer" />
                      <IoInformationCircleOutline
                        size={22}
                        className="text-amber-500 cursor-pointer hover:scale-110"
                        onClick={() => HandleOpenInfo(item)}
                      />
                      <MdDeleteOutline
                        size={22}
                        className="text-red-500 cursor-pointer"
                        onClick={() => HandleOpenDelete(item._id)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDelete
        open={openDailgoConfirmation}
        onClose={() => setOpenDailgoConfirmation(false)}
        onConfirm={HandleconfiremeDEleteProduit}
        title={"Delete Product"}
        message={"Êtes-vous certain(e) de vouloir supprimer ce produit?"}
      />

      <Dialog
        bgcolor={"#FFFFFF"}
        isOpen={openInfo}
        onClose={() => setOpenInfo(false)}
        title="Product Overview"
        width="700px"
      >
        {selectedProduct && (
          <div className="flex flex-col md:flex-row gap-0 overflow-hidden -m-2">
            <div className="w-full md:w-1/3 bg-gray-50 px-6 flex flex-col items-center justify-center border-r border-gray-100">
              <div className="w-20 h-20 bg-[#2C74B3] rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                {selectedProduct.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-center text-gray-800 leading-tight mb-2">
                {selectedProduct.name}
              </h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-6">
                {selectedProduct.categorie}
              </p>

              <div className="bg-white p- ml-0.5 px-2 rounded-lg shadow-inner border border-gray-200">
                <BarcodeDisplay value={selectedProduct.barcode} />
              </div>
              
              {/* PRINT BUTTON REPLACED B TAG */}
            <button 
              onClick={handlePrint}
              className="
                cursor-pointer
                relative group mt-4 flex items-center justify-center p-1 px-8 h-12 rounded-3xl overflow-hidden text-white font-bold text-sm
                bg-linear-to-r from-[#2C74B3] via-[#72511462] via-[#2cb386] to-[#2cb386]
                bg-size-[250%_auto]
                transition-all duration-1000 ease-in-out
                hover:bg-right
                border border-white/10
              "
            >
              {/* The Text */}
              <span className="relative z-10 transition-transform duration-500 group-hover:-translate-x-3">
                Print Barcodes
              </span>

              {/* The Icon */}
              <span className="absolute right-0 translate-x-full opacity-0 transition-all duration-500 group-hover:-translate-x-3 group-hover:opacity-100 z-10">
                <FaPrint size={19}/>
              </span>
            </button>
            <span className="text-center text-gray-500 text-[12px]">X({selectedProduct.quantite})</span>
            </div>

            <div className="w-full md:w-2/3 p-6 bg-white">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">

                <div className="col-span-2 flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <HiOutlineHashtag className="text-[#2C74B3] text-xl" />
                    <span className="text-sm font-medium text-gray-600">Status</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${selectedProduct.quantite > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {selectedProduct.quantite > 0 ? 'In Stock' : 'Out of stock'}
                  </span>
                </div>

                <InfoItem
                  icon={<HiOutlineCube className="text-blue-500" />}
                  label="Quantity"
                  value={`${selectedProduct.quantite} pcs`}
                  subValue={selectedProduct.quantite < 10 ? "Low Stock Alert" : "Stock Healthy"}
                  subColor={selectedProduct.quantite < 10 ? "text-red-500" : "text-green-500"}
                />

                <InfoItem
                  icon={<HiOutlineUser className="text-purple-500" />}
                  label="Supplier"
                  value={selectedProduct.fournisseur || "Direct"}
                />

                <InfoItem
                  icon={<HiOutlineCash className="text-amber-500" />}
                  label="Buy Price"
                  value={`${selectedProduct.prix_achat?.toFixed(2)} Dh`}
                />

                <InfoItem
                  icon={<HiOutlineTrendingUp className="text-emerald-500" />}
                  label="Sell Price"
                  value={`${selectedProduct.prix_vente?.toFixed(2)} Dh`}
                />

                <div className="col-span-2 mt-2 pt-4 border-t flex justify-center items-center gap-2 text-gray-600">
                  <HiOutlineCalendar />
                  <span className="text-xs italic">Registered on {new Date(selectedProduct.datecreate).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>
      
      {/* Hidden container for printing */}
      <div style={{ display: "none"}}>
        <PrintContainer ref={printRef} product={selectedProduct} />
      </div>

  <Dialog bgcolor={"#FFFFFF"} width="550px" isOpen={openupdate} onClose={() => setopeopenupdaten(false)} title="modifie  Produit">
              <UpdateProduit idupdate2={idupdate2} close={()=>setopeopenupdaten(false)} />
        </Dialog>
      <Toaster />
    </div>
  );
}