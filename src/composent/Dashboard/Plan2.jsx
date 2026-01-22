import { Doughnut } from "react-chartjs-2";
export default function Plan2({ data, options, maxColor, produitperc }) {
  const topProduct = produitperc?.length > 0 
    ? produitperc.reduce((prev, current) => (prev.percentage > current.percentage ? prev : current))
    : null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: maxColor }} />
        <h3 className="text-slate-800 font-black uppercase text-xs tracking-widest">Ventes par Catégorie</h3>
      </div>
      <div className="flex-1 flex justify-center items-center min-h-65">
        <Doughnut data={data} options={{ ...options, cutout: '75%', plugins: { ...options.plugins, legend: { display: false } } }} />
      </div>
      {topProduct && (
        <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-500 font-bold uppercase">{topProduct.name}</span>
            <span className="text-slate-800 font-black">{topProduct.percentage}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="h-full transition-all duration-500" style={{ width: `${topProduct.percentage}%`, backgroundColor: maxColor }} />
          </div>
        </div>
      )}
    </div>
  );
}