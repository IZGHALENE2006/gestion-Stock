import { Line } from "react-chartjs-2";
export default function Plan1({ data, options }) {
  return (
    <div className="h-80 w-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
          <h3 className="font-black text-slate-800 dark:text-slate-100 uppercase text-xs tracking-widest">
          Profit Analysis
          </h3>
        </div>

      </div>
      <div className="flex-1">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}