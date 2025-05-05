interface ModuleCardProps {
  number: string
  title: string
  description: string
  progress: number
}

export default function ModuleCard({ number, title, description, progress }: ModuleCardProps) {
  return (
    <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <span className="text-4xl font-display font-bold text-emerald-600/20 group-hover:text-emerald-600/30 transition-colors">
          {number}
        </span>
        <div className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {progress}% complete
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}
