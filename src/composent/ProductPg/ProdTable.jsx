import { IoInformationCircleOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { DeleteProduit, GetAllProduct } from "../../slices/SliceProduct";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState ,useRef  } from "react";
import ConfirmDelete from "../Dialog/ConfirmDelete";
import Dialog from "../Dialog/Dialog"; 
import { 
  HiOutlineHashtag, HiOutlineCube, HiOutlineTag, 
  HiOutlineUser, HiOutlineCalendar, HiOutlineCash, 
  HiOutlineTrendingUp 
} from "react-icons/hi";


export default function ProdTable() {
  const Dispatch = useDispatch()
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


  const { Produts, loading } = useSelector((state) => state.Product);

  const [openDailgoConfirmation, setOpenDailgoConfirmation] = useState(false);
  const [iddelete, setIdDelete] = useState('');

  const [openInfo, setOpenInfo] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
                      {item.quantite === 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.prix_achat ? item.prix_achat.toFixed(2) : "0.00"} Dh</td>
                  <td className="px-6 py-4">{item.categorie}</td>
                  <td className="px-6 py-4 font-bold">
                    <span style={{ color: isLowStock ? "#ff4d4d" : "azure" }}>{item.quantite}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
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
      
      <div className="w-full md:w-1/3 bg-gray-50 p-6 flex flex-col items-center justify-center border-r border-gray-100">
        <div className="w-20 h-20 bg-[#2C74B3] rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
          {selectedProduct.name.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-xl font-bold text-center text-gray-800 leading-tight mb-2">
          {selectedProduct.name}
        </h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-6">
          {selectedProduct.categorie}
        </p>
        
        <div className="bg-white p-2 rounded-lg shadow-inner border border-gray-200">
          <BarcodeDisplay value={selectedProduct.barcode} />
        </div>
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

    </div>
  );
}