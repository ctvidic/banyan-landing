interface ModuleCardProps {
  number: string
  title: string
  progress: number
}

export default function ModuleCard({ number, title, progress }: ModuleCardProps) {
  const isLocked = progress === 0;
  
  return (
    <div className={`glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group min-w-[300px] md:min-w-[350px] flex flex-col h-[180px] ${isLocked ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-start">
        <span className="text-4xl font-display font-bold text-emerald-600/20 group-hover:text-emerald-600/30 transition-colors">
          {number.padStart(2, '0')}
        </span>
        <div className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
          isLocked ? 'bg-gray-100 text-gray-500' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {isLocked ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Locked
            </>
          ) : (
            `${progress}% complete`
          )}
        </div>
      </div>
      <h3 className="text-xl font-bold mt-auto mb-4 line-clamp-2">{title}</h3>
      <div className={`w-full h-2 ${isLocked ? 'bg-gray-100' : 'bg-gray-100'} rounded-full overflow-hidden mt-auto`}>
        <div
          className={`h-full rounded-full ${
            isLocked ? 'bg-gray-200' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}
