import {Line} from "react-chartjs-2";
export default function Plan1({data , options}) {
  return (
    <div>

        <div className="flex justify-between items-center mb-6">
          <h3 className="ml-3 text-white border-l-3 border-sky-600 pl-3 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
            Total des ventes par employé          
            </h3>
        </div>
        <div className="h-80">
          <Line data={data} options={options} />
        </div>

    </div>
  )
}
