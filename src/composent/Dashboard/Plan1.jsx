import { Line } from "react-chartjs-2";
export default function Plan1({ data, options }) {
  return (
    <div className="h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
        <h3 className="text-slate-800 font-black uppercase text-xs tracking-widest">Analyse des Profits</h3>
      </div>
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}