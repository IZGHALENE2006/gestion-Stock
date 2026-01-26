import { IoInformationCircleOutline, IoSearchOutline, IoTrashOutline } from "react-icons/io5";
import { MdDeleteForever, MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { useEffect, useState, useRef, forwardRef } from "react";
import ConfirmDelete from "../Dialog/ConfirmDelete";
import Dialog from "../Dialog/Dialog";
import {
  HiOutlineHashtag, HiOutlineCube, HiOutlineTag,
  HiOutlineUser, HiOutlineCalendar, HiOutlineCash,
  HiOutlineTrendingUp
} from "react-icons/hi";
import { FaPrint, FaLock } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import { useReactToPrint } from "react-to-print";
import JsBarcode from "jsbarcode";
import { useDispatch, useSelector } from "react-redux";
import { DeleteProduit, GetAllProduct } from "../../slices/SliceProduct";
import UpdateProduit from "./updateProduit";

// --- Printable Component ---
const PrintContainer = forwardRef(({ product }, ref) => {
  if (!product) return null;
  const labels = Array.from({ length: product.quantite || 0 });
  return (
    <div ref={ref} style={{ padding: "10px", display: "flex", flexWrap: "wrap", gap: "15px" }}>
      {labels.map((_, i) => (
        <div key={i} style={{ border: "1px solid #eee", padding: "10px", textAlign: "center", width: "180px" }}>
          <p style={{ fontSize: "10px", fontWeight: "bold", marginBottom: "5px" }}>{product.name}</p>
          <BarcodeDisplay value={product.barcode} />
          <p style={{ fontSize: "12px", marginTop: "5px", fontWeight: "900" }}>{product.prix_vente} DH</p>
        </div>
      ))}
    </div>
  );
});

const BarcodeDisplay = ({ value }) => {
  const barcodeRef = useRef(null);
  useEffect(() => {
    if (barcodeRef.current && value) {
      JsBarcode(barcodeRef.current, value, {
        format: "EAN13",
        lineColor: document.documentElement.classList.contains('dark') ? "#fff" : "#000",
        background: "transparent",
        width: 1.2,
        height: 40,
        displayValue: true,
        fontSize: 12,
      });
    }
  }, [value]);
  return <svg ref={barcodeRef} className="mx-auto"></svg>;
};

export default function ProdTable() {
  const Dispatch = useDispatch();
  const printRef = useRef();
  const { Produts, loading } = useSelector((state) => state.Product);
  const { role } = useSelector(state => state.LoginAdmin);

  const [openDailgoConfirmation, setOpenDailgoConfirmation] = useState(false);
  const [iddelete, setIdDelete] = useState('');
  const [openInfo, setOpenInfo] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openupdate, setopeopenupdaten] = useState(false);
  const [idupdate2, setidupdate] = useState('');

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Labels_${selectedProduct?.name}`,
  });

  useEffect(() => {
    Dispatch(GetAllProduct());
  }, [Dispatch]);

  const HandleOpenDelete = (id) => { (setIdDelete(id), setOpenDailgoConfirmation(true)) };
  const HandleOpenInfo = (product) => { (setSelectedProduct(product), setOpenInfo(true)) };
  const handleopenUpdate = (id) => { (setidupdate(id), setopeopenupdaten(true)) };

  const HandleconfiremeDEleteProduit = () => {
    Dispatch(DeleteProduit(iddelete));
    setOpenDailgoConfirmation(false);
    toast.success('Produit supprimé', { icon: '🗑️' });
  };

  const InfoItem = ({ icon, label, value, color }) => (
    <div className="bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-4">
      <div className={`p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm ${color}`}> {icon} </div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm font-black text-slate-700 dark:text-slate-200">{value}</p>
      </div>
    </div>
  );

  if (loading) return <div className="p-20 text-center font-black text-emerald-500 animate-pulse">CHARGEMENT...</div>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-4xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Produit</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Status</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Prix Achat</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Catégorie</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Stock</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {Produts?.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all group">
                <td className="px-6 py-4 font-black text-slate-700 dark:text-slate-200 uppercase text-xs">{item.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                    item.quantite > 0 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'
                  }`}>
                    {item.quantite > 0 ? "En Stock" : "Rupture"}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 text-sm">{item.prix_vente?.toFixed(2)} DH</td>
                <td className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">{item.categorie?.name||"not valid"}</td>
                <td className="px-6 py-4">
                  <span className={`font-black text-sm ${item.quantite < 10 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
                    {item.quantite} <span className="text-[10px] opacity-50">PCS</span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    {role === "admin" ? (
                      <>
                        <button onClick={() => handleopenUpdate(item._id)} className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-500 rounded-lg transition-colors"><CiEdit size={20}/></button>
                        <button onClick={() => HandleOpenInfo(item)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 rounded-lg transition-colors"><IoInformationCircleOutline size={20}/></button>
                        <button onClick={() => HandleOpenDelete(item._id)} className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-400 rounded-lg transition-colors"><MdDeleteOutline size={20}/></button>
                      </>
                    ) : <FaLock className="text-slate-200 dark:text-slate-700" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- OVERVIEW DIALOG --- */}
      <Dialog 
        title={"Information"}
        bgcolor={document.documentElement.classList.contains('dark') ? "#0f172a" : "#ffffff"}
        isOpen={openInfo} onClose={() => setOpenInfo(false)} width="650px">
        {selectedProduct && (
          <div className="p-2">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Side: Visual */}
              <div className="w-full md:w-2/5 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
                <div className="w-24 h-24 bg-emerald-500 rounded-[2.2rem] flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-emerald-100 dark:shadow-none mb-4">
                  {selectedProduct.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase text-center leading-tight">{selectedProduct.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest">{selectedProduct.categorie?.name||"not Valide"}</p>
                
                <div className="p-3">
                  <BarcodeDisplay value={selectedProduct.barcode} />
                </div>

                <button onClick={handlePrint} className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                  <FaPrint size={14}/> Imprimer ({selectedProduct.quantite})
                </button>
              </div>

              {/* Right Side: Data */}
              <div className="flex-1 grid grid-cols-1 gap-3 py-2">
                <InfoItem icon={<HiOutlineCube size={20}/>} label="Stock Actuel" value={`${selectedProduct.quantite} Unités`} color="text-emerald-500" />
                <InfoItem icon={<HiOutlineUser size={20}/>} label="Fournisseur" value={selectedProduct.fournisseur || "Direct"} color="text-slate-500" />
                <InfoItem icon={<HiOutlineCash size={20}/>} label="Prix d'achat" value={`${selectedProduct.prix_achat?.toFixed(2)} DH`} color="text-rose-500" />
                <InfoItem icon={<HiOutlineTrendingUp size={20}/>} label="Prix de vente" value={`${selectedProduct.prix_vente?.toFixed(2)} DH`} color="text-emerald-500" />
                
                <div className="mt-4 flex items-center justify-center gap-2 text-slate-300 dark:text-slate-600">
                  <HiOutlineCalendar size={14}/>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Créé le: {new Date(selectedProduct.datecreate).toLocaleDateString()}</span>
                </div>
              </div>  
            </div>
          </div>
        )}
      </Dialog>

      <ConfirmDelete
       open={openDailgoConfirmation} onClose={() => setOpenDailgoConfirmation(false)} onConfirm={HandleconfiremeDEleteProduit} title="Supprimer Produit" />
      <div style={{ display: "none" }}><PrintContainer ref={printRef} product={selectedProduct} /></div>
      <Dialog 
        bgcolor={document.documentElement.classList.contains('dark') ? "#0f172a" : "#ffffff"}
      
      isOpen={openupdate} onClose={() => setopeopenupdaten(false)} title="Modifier Produit" width="550px">
        <UpdateProduit idupdate2={idupdate2} close={() => setopeopenupdaten(false)} />
      </Dialog>
      <Toaster position="bottom-right" />
    </div>
  );
}