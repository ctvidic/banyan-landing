import { motion } from "framer-motion"

interface FeatureCardProps {
  icon?: React.ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-blue-50 opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div className="relative z-10">
        {icon && (
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="mb-4 inline-block rounded-xl bg-emerald-100/80 p-3"
          >
            {icon}
          </motion.div>
        )}
        
        <motion.h3 
          className="mb-2 text-xl font-bold"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
        >
          {title}
        </motion.h3>
        
        <p className="text-gray-600">{description}</p>
      </div>
      
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-300 group-hover:w-full" />
    </motion.div>
  )
}
