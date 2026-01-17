import {Bar} from "react-chartjs-2";
export default function Plan1({data , options}) {
  return (
    <div>

        <div className="flex justify-between items-center mb-6">
          <h3 className="ml-3 text-white border-l-3 border-purple-600 pl-3 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
            Valeur Totale (dh)

            </h3>
        </div>
        <div className="h-80">
          <Bar data={data} options={options} />
        </div>

    </div>
  )
}
