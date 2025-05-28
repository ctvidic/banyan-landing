import { motion } from "framer-motion"
import { CheckCircle2, Circle, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

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
    date: "April 2025",
    status: "completed"
  },
  {
    title: "Interactive Learning Platform",
    description: "Enhanced digital platform with gamified learning experiences",
    date: "May 2025",
    status: "current"
  },
  {
    title: "Teen Debit Card",
    description: "Parent-controlled debit card with real-time monitoring",
    date: "July 2024",
    status: "upcoming"
  },
  {
    title: "Savings Account",
    description: "High-yield savings account with automated savings features",
    date: "August 2024",
    status: "upcoming"
  },
  {
    title: "Investing Account",
    description: "UTMA/UGMA accounts with educational investment tools",
    date: "September 2025",
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
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? roadmapItems.length - 1 : prevIndex - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === roadmapItems.length - 1 ? 0 : prevIndex + 1
    )
  }

  const currentItem = roadmapItems[currentIndex]

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
          {/* Timeline line - hidden on mobile, visible on md+ */}
          <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gray-200" />

          {/* Desktop Grid View */}
          <div className="hidden md:grid md:grid-cols-5 gap-8 relative">
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

          {/* Mobile Carousel View */}
          <div className="md:hidden relative">
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <StatusIcon status={currentItem.status} />
              </div>
              <motion.div
                key={currentItem.title}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg w-full max-w-sm mx-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-blue-50 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative z-10">
                  <span className="text-sm font-medium text-emerald-600 mb-2 block">
                    {currentItem.date}
                  </span>
                  <h3 className="text-lg font-bold mb-2">{currentItem.title}</h3>
                  <p className="text-gray-600 text-sm">{currentItem.description}</p>
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-300 group-hover:w-full" />
              </motion.div>
            </div>

            {/* Navigation Buttons for Mobile */}
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
                aria-label="Previous roadmap item"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
                aria-label="Next roadmap item"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            
            {/* Progress Dots */}
            <div className="flex justify-center mt-4 space-x-2">
              {roadmapItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    currentIndex === index ? 'bg-emerald-500' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to item ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 