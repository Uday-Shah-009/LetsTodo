export default function StatCard({ title, value, color }) {
  return (
    <div className="p-5 rounded-xl border border-gray-200 dark:border-[#1e293b] bg-white dark:bg-[#0b1329] shadow-sm hover:border-gray-300 dark:hover:border-slate-700 transition-all">

      <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
        {title}
      </p>

      <h2 className={`text-2xl font-bold mt-2 ${color}`}>
        {value}
      </h2>

    </div>
  )
}