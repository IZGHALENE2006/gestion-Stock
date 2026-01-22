import { Line } from "react-chartjs-2";
export default function Plan1({ data, options }) {
  return (
    <div className="h-80 w-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
          <h3 className="font-black text-slate-800 dark:text-slate-100 uppercase text-xs tracking-widest">
            Analyse des Profits
          </h3>
        </div>
        <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
          +12.5% vs last week
        </span>
      </div>
      <div className="flex-1">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}