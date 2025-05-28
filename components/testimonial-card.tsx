import { motion } from "framer-motion"
import Image from "next/image"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  avatar: string
}

export default function TestimonialCard({ quote, author, role, avatar }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 rounded-2xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-300" />
      <div className="relative bg-white rounded-2xl p-6 shadow-lg">
        <div className="mb-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-4"
          >
            <svg
              className="w-6 h-6 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-700 italic"
          >
            "{quote}"
          </motion.p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 rounded-full overflow-hidden">
            <Image
              src={avatar}
              alt={author}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="font-semibold"
            >
              {author}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-sm text-gray-500"
            >
              {role}
            </motion.div>
          </div>
        </div>
        <div className="absolute -bottom-1 left-4 right-4 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </div>
    </motion.div>
  )
}
