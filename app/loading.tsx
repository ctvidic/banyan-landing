import { Leaf } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Leaf className="h-12 w-12 text-emerald-600 animate-pulse" />
          <div className="absolute inset-0 h-12 w-12 bg-emerald-600/20 rounded-full animate-ping" />
        </div>
        <p className="text-gray-600 animate-pulse">Loading your financial future...</p>
      </div>
    </div>
  )
} 