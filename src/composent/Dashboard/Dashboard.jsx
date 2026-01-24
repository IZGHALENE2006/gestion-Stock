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
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: { 
      display: false // Hiding legend often looks cleaner for single-line charts
    },
    tooltip: { 
      padding: 12,
      backgroundColor: "#1e293b",
      titleFont: { size: 14, weight: 'bold' },
      cornerRadius: 12,
      displayColors: false
    }
  },
  scales: {
    y: { 
      beginAtZero: true,
      grid: { 
        color: "rgba(148, 163, 184, 0.1)", // Very faint lines
        drawBorder: false 
      },
      ticks: { 
        color: "#94a3b8",
        callback: (value) => value.toLocaleString() + ' DH' 
      } 
    },
    x: { 
      grid: { display: false }, 
      ticks: { color: "#94a3b8" } 
    }
  }
};

  // 2. T3rif dial l-Data (khass ykono hna bash t-khdem l-Plan1Data)
const Plan1Data = {
  labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  datasets: [{
    label: "Profit (DH)",
    data: [12000, 19000, 15000, 22000, 18000, 25000, 5000],
    borderColor: "#19b393", // Indigo-500
    borderWidth: 3,
    pointBackgroundColor: "#19b393",
    pointBorderColor: "#19b393",
    pointHoverRadius: 6,
    // This creates a nice fade effect under the line
    backgroundColor: (context) => {
      const ctx = context.chart.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, 250);
      gradient.addColorStop(0, "rgba(25, 179, 147, 0.4)");
      gradient.addColorStop(1, "rgba(25, 179, 147, 0)");
      return gradient;
    },
    fill: true,
    tension: 0.4,
  }]
};
const isDarkMode = document.documentElement.classList.contains('dark');
const Plan2Data = {
  labels: Category?.map(cat => cat.name),
  datasets: [{
    data: Category?.map(cat => Produts.filter(p => p.categorie === cat.name).length),
    /* Modern vibrant colors that pop in both modes */
    backgroundColor: [
      '#f59e0b', // Amber 500
      '#06b6d4', // Cyan 500
      '#ec4899', // Pink 500
      '#10b981', // Emerald 500
      '#6366f1', // Indigo 500
    ],
    /* Change border color based on mode for a seamless look */
    borderColor: isDarkMode ? '#0f172a' : '#ffffff', 
    borderWidth: 4,
    hoverOffset: 15,
    borderRadius: 8, // Adds slightly rounded edges to the doughnut segments
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
    { 
      label: "Employés", 
      value: Employe?.length || "0", 
      icon: <IoPeopleOutline />, 
      gradient: "from-blue-400 to-blue-600", 
      text: "text-blue-500 dark:text-blue-400", 
      bg: "bg-blue-500/50",
      bgIcon: "bg-blue-50 dark:bg-blue-900/20" 
    },
    { 
      label: "Produits", 
      value: Produts?.length || "0", 
      icon: <IoCubeOutline />, 
      gradient: "from-orange-400 to-orange-600", 
      text: "text-orange-500 dark:text-orange-400", 
      bg: "bg-orange-50/50",
      bgIcon: "bg-orange-50 dark:bg-orange-900/20" 
    },
    { 
      label: "Profit (jour)", 
      value: "45,000 DH", 
      icon: <IoTrendingUpOutline />, 
      gradient: "from-emerald-400 to-emerald-600", 
      text: "text-emerald-500 dark:text-emerald-400", 
      bg: "bg-emerald-50/50",
      bgIcon: "bg-emerald-50 dark:bg-emerald-900/20" 
    },
    { 
      label: "Valeur Totale", 
      value: totalprix.toLocaleString() + " DH", 
      icon: <IoWalletOutline />, 
      gradient: "from-purple-400 to-purple-600", 
      text: "text-purple-500 dark:text-purple-400", 
      bg: "bg-purple-50/50",
      bgIcon: "bg-purple-50 dark:bg-purple-900/20" 
    },
  ];

  const produitperc = Percentage(Produts.map(p => p.categorie));

  if (user?.role === "Employe") return null;

const dataset = Plan2Data.datasets[0];
const data = dataset.data;

const maxIndex = data?.indexOf(Math.max(...data));
const maxColor = dataset.backgroundColor[maxIndex];


  return (
   <div className="p-8 bg-gray-100 dark:bg-[#1e293b] min-h-screen space-y-8 transition-colors duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">
            Dashboard
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-medium italic text-sm">
            Rapport d'activité pour {user?.name}
          </p>
        </div>
        <div className="text-center">
          <h1 className="text-[#19b393] font-black text-xl leading-none"><Time /></h1>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-widest">
            {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>

      {/* Cards Section */}
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => <Card data={stat} key={i} />)}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        
        {/* Plan 1 */}
        <div className="lg:col-span-4 bg-linear-to-br from-white to-slate-50 dark:from-slate-900/40 dark:to-slate-900/70 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 shadow-sm transition-all hover:shadow-md">
          <Plan1 data={Plan1Data} options={chartOptions} />
        </div>

        {/* Plan 2 */}
        <div className="lg:col-span-2 bg-linear-to-br from-white to-slate-50 dark:from-slate-900/40 dark:to-slate-900/70 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 shadow-sm transition-all hover:shadow-md">
          <Plan2 data={Plan2Data} options={chartOptions} maxColor={maxColor} produitperc={produitperc} /> 
        </div>

        {/* Plan 3 */}
        <div className="lg:col-span-3 bg-linear-to-l from-white to-slate-50 dark:from-slate-900/40 dark:to-slate-900/70 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 shadow-sm transition-all hover:shadow-md">
          <Plan3 data={Plan3Data} options={chartOptions} /> 
        </div>

        {/* Plan 4 */}
        <div className="lg:col-span-3 bg-linear-to-br from-white to-slate-50 dark:from-slate-900/30 dark:to-slate-900/70 rounded-[2.5rem] border border-slate-100 dark:border-slate-700  p-8 shadow-sm transition-all hover:shadow-md">
          <Plan4 data={Plan4Data} options={chartOptions} /> 
        </div>

      </div>
    </div>
  );
}