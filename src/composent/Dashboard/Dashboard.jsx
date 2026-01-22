import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler } from "chart.js";
import { IoPeopleOutline, IoCubeOutline, IoTrendingUpOutline, IoWalletOutline } from "react-icons/io5";
import Card from "./Card";
import Time from "../La Caisse/DateTime";
import { getMe } from "../../slices/SliceLoginAdmin";
import { GetAllProduct } from "../../slices/SliceProduct";
import { GetAllEmploye } from '../../slices/sliceEmploye';
import { GetAllCatefory } from "../../slices/SilceCategory";
import { Percentage } from "./logic.js";
import Plan1 from "./Plan1";
import Plan2 from "./Plan2";
import Plan3 from "./Plan3";
import Plan4 from "./Plan4";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

export default function Dashboard() {
  const { user, token } = useSelector((state) => state.LoginAdmin);
  const { Produts } = useSelector((state) => state.Product);
  const { Employe } = useSelector(state => state.Employe);
  const { Category } = useSelector((state) => state.category);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && !user) dispatch(getMe());
    dispatch(GetAllProduct());
    dispatch(GetAllEmploye());
    dispatch(GetAllCatefory());
  }, [token, dispatch, user]);

  const totalprix = Produts.reduce((acc, product) => acc + product.prix_vente * product.quantite, 0);

  // 1. Chart Options fate7in
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { color: "#64748b", font: { weight: '600' } } },
      tooltip: { backgroundColor: "#fff", titleColor: "#1e293b", bodyColor: "#475569", borderColor: "#f1f5f9", borderWidth: 1 }
    },
    scales: {
      y: { grid: { color: "#f8fafc" }, ticks: { color: "#cbd5e1" } },
      x: { grid: { display: false }, ticks: { color: "#cbd5e1" } }
    }
  };

  // 2. T3rif dial l-Data (khass ykono hna bash t-khdem l-Plan1Data)
  const Plan1Data = {
    labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    datasets: [{
      label: "Profit",
      data: [12000, 19000, 15000, 22000, 18000, 25000, 5000],
      borderColor: "#4f46e5",
      backgroundColor: "rgba(79, 70, 229, 0.1)",
      fill: true,
      tension: 0.4,
    }]
  };

  const Plan2Data = {
    labels: Category.map(cat => cat.name),
    datasets: [{
      data: Category.map(cat => Produts.filter(p => p.categorie === cat.name).length),
      backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'],
      borderColor: '#ffffff',
      borderWidth: 4,
    }]
  };

  const Employees = [
    { name: "Ayoub", data: [20, 15, 30, 25, 15, 35, 60], color: "#4f46e5" },
    { name: "Mehdi", data: [15, 25, 20, 30, 35, 45, 55], color: "#10b981" },
    { name: "Basker", data: [10, 20, 25, 20, 30, 40, 50], color: "#ef4444" },
  ];

  const Plan3Data = {
    labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    datasets: Employees.map((emp) => ({
      label: emp.name,
      data: emp.data,
      borderColor: emp.color,
      tension: 0.4,
    }))
  };

  const Plan4Data = {
    labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    datasets: [{
      label: "Valeur Totale",
      data: [10000, 15000, 12000, 18000, 14000, 20000, 8000],
      backgroundColor: "#8b5cf6",
      borderRadius: 8,
    }]
  };

  const stats = [
    { label: "Employés", value: Employe?.length || "0", icon: <IoPeopleOutline />, gradient: "from-blue-400", text: "text-blue-500" },
    { label: "Produits", value: Produts?.length || "0", icon: <IoCubeOutline />, gradient: "from-orange-400", text: "text-orange-500" },
    { label: "Profit (jour)", value: "45,000 DH", icon: <IoTrendingUpOutline />, gradient: "from-emerald-400", text: "text-emerald-500" },
    { label: "Valeur Totale", value: totalprix.toLocaleString() + " DH", icon: <IoWalletOutline />, gradient: "from-purple-400", text: "text-purple-500" },
  ];

  const produitperc = Percentage(Produts.map(p => p.categorie));

  if (user?.role === "Employe") return null;

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Dashboard</h1>
          <p className="text-slate-400 font-medium italic text-sm">Rapport d'activité pour {user?.name}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
          <h1 className="text-indigo-600 font-black text-xl leading-none"><Time /></h1>
          <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-widest">{new Date().toLocaleDateString("fr-FR")}</p>
        </div>
      </div>

      {/* Cards */}
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => <Card data={stat} key={i} />)}
      </div>

      {/* Grid dial les Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <Plan1 data={Plan1Data} options={chartOptions} />
        </div>
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <Plan2 data={Plan2Data} options={chartOptions} maxColor="#4f46e5" produitperc={produitperc} /> 
        </div>
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <Plan3 data={Plan3Data} options={chartOptions} /> 
        </div>
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <Plan4 data={Plan4Data} options={chartOptions} /> 
        </div>
      </div>
    </div>
  );
}