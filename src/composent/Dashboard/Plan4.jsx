import { Bar } from "react-chartjs-2";
export default function Plan4({ data, options }) {
  return (
    <div className="h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-6 bg-purple-600 rounded-full" />
        <h3 className="text-slate-800 dark:text-slate-100 font-black uppercase text-xs tracking-widest">
          Total Value (DH)</h3>
      </div>
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}