export default function StatCard({ title, value, color }) {
  return (
    <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>

      <h2 className={`text-2xl font-semibold mt-2 ${color}`}>
        {value}
      </h2>

    </div>
  )
}