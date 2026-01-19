import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,PointElement,LineElement,Title,Tooltip,Legend,ArcElement,Filler} from "chart.js";
import { IoPeopleOutline, IoCubeOutline, IoTrendingUpOutline, IoWalletOutline } from "react-icons/io5";
import Card from "./Card";
import Time from "../La Caisse/DateTime"
import { getMe } from "../../slices/SliceLoginAdmin";
import { GetAllProduct } from "../../slices/SliceProduct";
import { DeleteEmploye, GetAllEmploye } from '../../slices/sliceEmploye';
import { GetAllCatefory, DeleteCategory } from "../../slices/SilceCategory";
 import { Percentage } from "./logic.js";

import Plan1 from "./Plan1";
import Plan2 from "./Plan2";
import Plan3 from "./Plan3";
import Plan4 from "./Plan4";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";



ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, 
  LineElement, Title, Tooltip, Legend, ArcElement, Filler
);

export default function Dashboard() {
  
  const { user, token } = useSelector((state) => state.LoginAdmin);
  const { Produts, loading } = useSelector((state) => state.Product); 
  const { Employe } = useSelector(state => state.Employe);
  const { Category } = useSelector((state) => state.category);
  

  const dispatch = useDispatch();
  
  useEffect(() => {
    if (token && !user) {
      dispatch(getMe());
    }
    dispatch(GetAllProduct());
    dispatch(GetAllEmploye());
    dispatch(GetAllCatefory());

    
  }, [token, dispatch, user]);

  const totalprix = Produts.reduce((acc, product) => acc + product.prix_vente * product.quantite, 0);
  
  
  
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#94a3b8",
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#94a3b8",
        bodyColor: "#fff",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 10,
        displayColors: false
      }
    },
    scales: {
      y: { grid: { color: "#334155", drawBorder: false }, ticks: { color: "#64748b" } },
      x: { grid: { display: false }, ticks: { color: "#64748b" } }
    }
  };
  //////////// 1 ////////////////////////
  const Plan1Data = {
    labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    datasets: [{
      label: "Profit",
      data: [12000, 19000, 0, 0, 0, 0, 5000],
      borderColor: "#2C74B3",
      backgroundColor: "rgba(44, 116, 179, 0.1)",
      fill: true,
      tension: 0.4,
      pointRadius: 4,
    }]
  };
  //////////// 2 ////////////////////////
  const Plan2Data = {
    labels: Category.map(cat => cat.name),
    datasets: [
      {
        data: Category.map(cat =>
          Produts.filter(p => p.categorie === cat.name).length
        ),
        backgroundColor: ['#2C74B3', '#10b981', '#f59e0b', '#EE4B2B'],
        borderColor: '#1e293b',
        borderWidth: 5,
      }
    ]
  }

  
  
  //////////// 3 ////////////////////////
  const Employees = [
    {
    name: "Ayoub",
    data: [20, 15, 30, 25, 15, 35, 60],
    color: "#2C74B3",
  },
  {
    name: "Maehdi",
    data: [15, 25, 20, 30, 35, 45, 55],    ////////////// hna fin at7et data ta3 employe mn backend
    color: "#10b981",
  },
  {
    name: "Basker",
    data: [10, 20, 25, 20, 30, 40, 50],
    color: "#EE4B2B",
  },
];

const Plan3Data ={
    labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    datasets: Employees.map((employee) => ({
      label: employee.name,
      data: employee.data,
      borderColor: employee.color,
      tension: 0.4,
      pointRadius: 4,
    }))
  }



  //////////// 4 ////////////////////////

  const Plan4Data = {
    labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    datasets: [{
      label: "Profit",
      data: [12000, 19000, 0, 0, 0, 0, 0],
      borderColor: "#2C74B3",
      backgroundColor: "#9E67DA80",
      fill: true,
      tension: 0.4,
      pointRadius: 4,
    }]
  };


//data ta3 les card maehdi
const stats = [
  {
    label: "Employés",
    value: Employe ? Employe.length : "0" ,
    icon: <IoPeopleOutline />,
    border: "hover:border-blue-500/50",
    gradient: "from-blue-500/50",
    text: "text-blue-400",
  },
  {
    label: "Produits",
    value: Produts ? Produts.length : "0",
    icon: <IoCubeOutline />,
    border: "hover:border-orange-500/50",
    gradient: "from-orange-500/50",
    text: "text-orange-400",
  },
  {
    label: "Profit (jour)",
    value: "45,000 DH",
    icon: <IoTrendingUpOutline />,
    border: "hover:border-emerald-500/50",
    gradient: "from-emerald-500/50",
    text: "text-emerald-400",
    
  },
  {
    label: "Valeur Totale",
    value: totalprix.toFixed(2) + " DH",
    icon: <IoWalletOutline />,
    border: "hover:border-purple-500/50",
    gradient: "from-purple-500/50",
    text: "text-purple-400",
  },
];


const dataset = Plan2Data.datasets[0];
const data = dataset.data;


const produitperc = Percentage(Produts.map(p => p.categorie))

const maxIndex = data.indexOf(Math.max(...data));

const maxColor = dataset.backgroundColor[maxIndex];



  return (
    <div className="p-6 bg-[#0f172a] min-h-screen space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Tableau de Bord</h1>
          <p className="text-slate-500 text-sm">Bienvenue {user.name}, Voici un aperçu de votre activité</p>
        </div>
        <div className="text-center">
          <h1 className="text-white font-semibold w-25"><Time /></h1>
          <p className="text-slate-500 text-sm">{new Date().toLocaleDateString("en-GB")}</p>
        </div>
      </div>

    
      <div className="gap-6 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card data={stat} key={i} />
        ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">

          {/* ///////////////////////////////////////// */}

        <div className="lg:col-span-4 bg-[#1e293b] rounded-3xl border border-slate-700 p-6">
          
          <Plan1 data={Plan1Data} options={chartOptions} />

        </div>

          {/*////////////////////////////////////*/}

        <div className="bg-[#1e293b] rounded-3xl lg:col-span-2 border border-slate-700 p-6 flex flex-col">
          <Plan2 data={Plan2Data} options={chartOptions} maxColor={maxColor} produitperc={produitperc} /> 

        </div>
        
        {/*////////////////////////////////////*/}


        <div className="bg-[#1e293b] lg:col-span-3 rounded-3xl border border-slate-700 p-6 flex flex-col">
          
          <Plan3 data={Plan3Data} options={chartOptions} /> 
          
        </div>
        <div className="bg-[#1e293b] lg:col-span-3 rounded-3xl border border-slate-700 p-6 flex flex-col">
          
          <Plan4 data={Plan4Data} options={chartOptions} /> 
          
        </div>
        
      </div>
    </div>
  );
}