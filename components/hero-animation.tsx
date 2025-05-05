"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Leaf, Wifi } from "lucide-react"

export default function HeroAnimation() {
  const [mounted, setMounted] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  const rotateX = useTransform(y, [-20, 20], [5, -5])
  const rotateY = useTransform(x, [-20, 20], [-5, 5])
  const translateZ = useTransform(x, [-20, 20], [-30, 30])

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      const xPos = (clientX / innerWidth - 0.5) * 2
      const yPos = (clientY / innerHeight - 0.5) * 2
      mouseX.set(xPos * 20)
      mouseY.set(yPos * 20)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  if (!mounted) {
    return (
      <div className="relative h-full w-full flex items-center justify-center">
        <div className="h-[500px] w-[250px] bg-gray-100 rounded-3xl"></div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full perspective-1000">
      {/* Background Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white/80 to-blue-50/50 rounded-3xl"
        style={{
          rotateX,
          rotateY,
        }}
      />

      {/* Phone Frame */}
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 z-50"
        style={{
          rotateX,
          rotateY,
        }}
      >
        <div className="relative h-[600px] w-[300px] bg-gray-900 rounded-[3rem] shadow-xl overflow-hidden border-[12px] border-gray-900 font-sans">
          <div className="absolute top-0 left-0 right-0 h-6 bg-gray-900 flex justify-center items-center">
            <div className="h-2 w-24 rounded-full bg-gray-800"></div>
          </div>
          <div className="pt-6 h-full bg-white">
            {/* App Header */}
            <div className="bg-emerald-500 text-white p-4 flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                <Leaf className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="text-lg font-bold font-display">Banyan</div>
            </div>
            {/* App Content */}
            <div className="p-4 space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="text-sm text-gray-500 mb-1">Module 1</div>
                <div className="text-xl font-bold mb-3 font-display">Foundations of Money</div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="h-full bg-emerald-500"
                  ></motion.div>
                </div>
                <div className="text-sm text-right mt-2 text-gray-500">75% complete</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="text-xl font-bold mb-3 font-display">Investment Portfolio</div>
                <div className="flex justify-between text-sm mb-4">
                  <span>$100 invested</span>
                  <span className="text-emerald-500">+5.2%</span>
                </div>
                <div className="h-24 bg-gray-50 rounded-lg flex items-end gap-1 p-2">
                  {[30, 45, 40, 50, 48, 60, 55].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 1 }}
                      className="flex-1 bg-emerald-500/80 rounded-t-sm"
                    ></motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Credit Card Element */}
      <motion.div
        className="absolute top-[65%] left-[40%] w-72 h-44 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-2xl shadow-xl z-50 -rotate-6"
        animate={{
          y: [0, -10, 0],
          rotate: [-6, -5, -6],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        style={{
          rotateX,
          rotateY,
          translateZ,
        }}
      >
        {/* Card Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-32 w-32 border border-white/20 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `translate(-50%, -50%) scale(${Math.random() * 1 + 0.5})`,
              }}
            />
          ))}
        </div>

        <div className="p-6 text-white h-full flex flex-col justify-between relative">
          {/* Bank Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-emerald-500" />
            </div>
            <span className="font-semibold tracking-wider">BANYAN</span>
          </div>

          {/* Chip and Wireless */}
          <div className="flex items-center gap-3 my-4">
            <div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 flex flex-col gap-1 p-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-1 w-full bg-yellow-600/30 rounded-full" />
                ))}
              </div>
            </div>
            <Wifi className="w-6 h-6 text-white/90 rotate-90" />
          </div>

          <div className="space-y-4">
            {/* Card Number */}
            <div className="flex gap-3 font-mono text-lg tracking-wider">
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-white/40" />
                ))}
              </div>
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-white/40" />
                ))}
              </div>
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-white/40" />
                ))}
              </div>
            </div>

           
          </div>
        </div>

        {/* Hologram Effect */}
      </motion.div>

      {/* Savings Progress Ring - Moved here */}
      <motion.div
        className="absolute right-[10%] top-[15%] h-40 w-40 rounded-full
                   bg-white/10 backdrop-blur-md flex items-center justify-center
                   ring-4 ring-emerald-500/30 z-20"
        style={{ rotateX, rotateY }}        // reuse existing transforms for 3-D feel
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" className="h-24 w-24 rotate-[-90deg]">
          <circle cx="50" cy="50" r="40" stroke="#D1FAE5" strokeWidth="8" fill="none" />
          <motion.circle
            cx="50" cy="50" r="40"
            stroke="#10B981" strokeWidth="8" fill="none" strokeLinecap="round"
            strokeDasharray="251"          // 2πr
            strokeDashoffset="100"         // % complete (251 * (1 - 0.62))
            animate={{ strokeDashoffset: [100, 90, 100] }}  // little pulse around 62%
            transition={{ duration: 6, repeat: Infinity }}
          />
        </svg>
        <div className="absolute text-center">
          <p className="text-xs text-emerald-700/70">Savings Goal</p>
          <p className="text-lg font-bold text-emerald-600">62 %</p>
        </div>
      </motion.div>

      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-emerald-500/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              zIndex: 1
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}
