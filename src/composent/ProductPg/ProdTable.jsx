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
        lineColor: "#000",
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
  const { user, role } = useSelector(state => state.LoginAdmin);

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
    <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
      <div className={`p-3 bg-white rounded-xl shadow-sm ${color}`}> {icon} </div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm font-black text-slate-700">{value}</p>
      </div>
    </div>
  );

  if (loading) return <div className="p-20 text-center font-black text-slate-400 animate-pulse">CHARGEMENT...</div>;

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.1em]">Produit</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.1em]">Status</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.1em]">Prix Achat</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.1em]">Catégorie</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.1em]">Stock</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {Produts?.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50/80 transition-all group">
                <td className="px-6 py-4 font-black text-slate-700 uppercase text-xs">{item.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                    item.quantite > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {item.quantite > 0 ? "En Stock" : "Rupture"}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-600 text-sm">{item.prix_achat?.toFixed(2)} DH</td>
                <td className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">{item.categorie}</td>
                <td className="px-6 py-4">
                  <span className={`font-black text-sm ${item.quantite < 10 ? 'text-rose-500' : 'text-slate-700'}`}>
                    {item.quantite} <span className="text-[10px] opacity-50">PCS</span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    {role === "admin" ? (
                      <>
                        <button onClick={() => handleopenUpdate(item._id)} className="p-2 hover:bg-indigo-50 text-indigo-400 rounded-lg transition-colors"><CiEdit size={20}/></button>
                        <button onClick={() => HandleOpenInfo(item)} className="p-2 hover:bg-amber-50 text-amber-400 rounded-lg transition-colors"><IoInformationCircleOutline size={20}/></button>
                        <button onClick={() => HandleOpenDelete(item._id)} className="p-2 hover:bg-rose-50 text-rose-400 rounded-lg transition-colors"><MdDeleteOutline size={20}/></button>
                      </>
                    ) : <FaLock className="text-slate-200" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- OVERVIEW DIALOG (REFIXED) --- */}
      <Dialog isOpen={openInfo} onClose={() => setOpenInfo(false)} width="650px">
        {selectedProduct && (
          <div className="p-2">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Side: Visual */}
              <div className="w-full md:w-2/5 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div className="w-24 h-24 bg-indigo-500 rounded-[2.2rem] flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-indigo-100 mb-4">
                  {selectedProduct.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-lg font-black text-slate-800 uppercase text-center leading-tight">{selectedProduct.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{selectedProduct.categorie}</p>
                
                <div className="mt-6 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                  <BarcodeDisplay value={selectedProduct.barcode} />
                </div>

                <button onClick={handlePrint} className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                  <FaPrint size={14}/> Imprimer ({selectedProduct.quantite})
                </button>
              </div>

              {/* Right Side: Data */}
              <div className="flex-1 grid grid-cols-1 gap-3 py-2">
                <InfoItem icon={<HiOutlineCube size={20}/>} label="Stock Actuel" value={`${selectedProduct.quantite} Unités`} color="text-indigo-500" />
                <InfoItem icon={<HiOutlineUser size={20}/>} label="Fournisseur" value={selectedProduct.fournisseur || "Direct"} color="text-purple-500" />
                <InfoItem icon={<HiOutlineCash size={20}/>} label="Prix d'achat" value={`${selectedProduct.prix_achat?.toFixed(2)} DH`} color="text-amber-500" />
                <InfoItem icon={<HiOutlineTrendingUp size={20}/>} label="Prix de vente" value={`${selectedProduct.prix_vente?.toFixed(2)} DH`} color="text-emerald-500" />
                
                <div className="mt-4 flex items-center justify-center gap-2 text-slate-300">
                  <HiOutlineCalendar size={14}/>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Créé le: {new Date(selectedProduct.datecreate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>

      <ConfirmDelete open={openDailgoConfirmation} onClose={() => setOpenDailgoConfirmation(false)} onConfirm={HandleconfiremeDEleteProduit} title="Supprimer Produit" />
      <div style={{ display: "none" }}><PrintContainer ref={printRef} product={selectedProduct} /></div>
      <Dialog isOpen={openupdate} onClose={() => setopeopenupdaten(false)} title="Modifier Produit" width="550px">
        <UpdateProduit idupdate2={idupdate2} close={() => setopeopenupdaten(false)} />
      </Dialog>
      <Toaster position="bottom-right" />
    </div>
  );
}