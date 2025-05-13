import { motion } from "framer-motion"
import { CheckCircle2, Circle, Clock } from "lucide-react"

interface RoadmapItem {
  title: string
  description: string
  date: string
  status: "completed" | "current" | "upcoming"
}

const roadmapItems: RoadmapItem[] = [
  {
    title: "Financial Literacy Curriculum",
    description: "Comprehensive financial education platform for students",
    date: "Q1 2024",
    status: "completed"
  },
  {
    title: "Interactive Learning Platform",
    description: "Enhanced digital platform with gamified learning experiences",
    date: "Q2 2024",
    status: "current"
  },
  {
    title: "Teen Debit Card",
    description: "Parent-controlled debit card with real-time monitoring",
    date: "Q3 2024",
    status: "upcoming"
  },
  {
    title: "Savings Account",
    description: "High-yield savings account with automated savings features",
    date: "Q4 2024",
    status: "upcoming"
  },
  {
    title: "Investing Account",
    description: "UTMA/UGMA accounts with educational investment tools",
    date: "Q1 2025",
    status: "upcoming"
  }
]

const StatusIcon = ({ status }: { status: RoadmapItem["status"] }) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-6 w-6 text-emerald-500" />
    case "current":
      return <Circle className="h-6 w-6 text-blue-500" />
    case "upcoming":
      return <Clock className="h-6 w-6 text-gray-400" />
  }
}

export default function RoadmapSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Our Roadmap</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Building the future of financial education, one milestone at a time
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-8 left-0 w-full h-0.5 bg-gray-200" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex flex-col items-center">
                  <div className="mb-4">
                    <StatusIcon status={item.status} />
                  </div>
                  
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl w-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-blue-50 opacity-0 transition-opacity group-hover:opacity-100" />
                    
                    <div className="relative z-10">
                      <span className="text-sm font-medium text-emerald-600 mb-2 block">
                        {item.date}
                      </span>
                      <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-300 group-hover:w-full" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 