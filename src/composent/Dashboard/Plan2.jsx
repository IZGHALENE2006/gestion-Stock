import { Doughnut } from "react-chartjs-2";
export default function Plan2({ data, options, maxColor, produitperc }) {
  const topProduct = produitperc && produitperc.length > 0 
    ? produitperc.reduce((prev, current) => (prev.percentage > current.percentage) ? prev : current)
    : null;

  return (
    <div className="h-full flex flex-col">
          <h3
          style={{borderColor :maxColor}}
          className="m-3 text-white border-l-3 pl-3 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
            Total des ventes par employé          
            </h3>
      
      <div className="flex min-h-65 justify-center items-center">
        <Doughnut 
          data={data} 
          options={{ 
            ...options, 
            cutout: '70%',
            plugins: { ...options.plugins, legend: { display: false } } 
          }} 
        />
      </div>

      {topProduct && (
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Catégorie dominante : {topProduct.name}</span>
            <span className="text-white font-bold">{topProduct.percentage}%</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500" 
              style={{ 
                width: `${topProduct.percentage}%`, 
                backgroundColor: maxColor 
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}