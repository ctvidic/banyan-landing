"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { Leaf, Wifi, Lightbulb, ShieldCheck } from "lucide-react"
import Image from "next/image"

export default function HeroAnimation() {
  const [mounted, setMounted] = useState(false)
  const [showCoin, setShowCoin] = useState(false)
  const [coinKey, setCoinKey] = useState(0)
  const [currentScreen, setCurrentScreen] = useState(0)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  const rotateX = useTransform(y, [-20, 20], [5, -5])
  const rotateY = useTransform(x, [-20, 20], [-5, 5])
  const translateZ = useTransform(x, [-20, 20], [-30, 30])

  // Trigger coin animation on scroll transitions
  useEffect(() => {
    const scrollTimes = [0.2, 0.4, 0.6] // Only when scrolling down to screens 2, 3, 4
    const duration = 24000 // 24 seconds total duration
    
    const triggerCoin = () => {
      setShowCoin(true)
      setCoinKey(prev => prev + 1)
      setTimeout(() => setShowCoin(false), 1500) // Hide after 1.5 seconds
    }

    // Trigger coin for each transition
    const startAnimation = () => {
      scrollTimes.forEach((time, index) => {
        setTimeout(() => {
          triggerCoin()
          setCurrentScreen(index + 1)
        }, time * duration)
      })
    }

    // Start initial animation
    startAnimation()
    
    // Repeat animation
    const interval = setInterval(startAnimation, duration)

    return () => {
      clearInterval(interval)
    }
  }, [])

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
        {/* Coin Animation - Positioned relative to phone */}
        <AnimatePresence>
          {showCoin && (
            <motion.div
              key={coinKey}
              className="absolute -top-5 right-0 z-[200]"
              initial={{ scale: 0, opacity: 0, y: 0 }}
              animate={{ 
                scale: [0, 1.1, 1, 1, 0.9],
                opacity: [0, 1, 1, 1, 0],
                y: [0, -20, -30, -40, -60]
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                duration: 1.5,
                times: [0, 0.2, 0.4, 0.7, 1],
                ease: "easeOut"
              }}
            >
              <Image
                src="/coins.png"
                alt="Coins"
                width={56}
                height={56}
                className="drop-shadow-lg"
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="relative h-[600px] w-[300px] bg-gray-900 rounded-[3rem] shadow-xl overflow-hidden border-[12px] border-gray-900 font-sans">
          <div className="absolute top-0 left-0 right-0 h-6 bg-gray-900 flex justify-center items-center">
            <div className="h-2 w-24 rounded-full bg-gray-800"></div>
          </div>
          <div className="pt-6 h-full bg-white">
            {/* App Header - Updated */}
            <div className="bg-emerald-500 text-white p-4 flex items-center justify-between gap-2">
              {/* Left Side: Logo + Title */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="text-lg font-bold font-display">Banyan</div>
              </div>
              {/* Right Side: Banyan Score */}
              <div className="flex flex-col items-end">
                <span className="text-xs font-medium text-white/80 leading-none">Score</span>
                <div className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-white/90"/>
                  <span className="text-lg font-bold leading-none">720</span>
                </div>
              </div>
            </div>
            {/* App Content */}
            <div className="relative h-[calc(100%-80px)] overflow-hidden">
              <motion.div
                className="absolute inset-0"
                animate={{
                  y: [
                    "0%",      // Start at screen 1
                    "0%",      // Hold on screen 1
                    "-102%",   // Slight overshoot past screen 2
                    "-100%",   // Settle on screen 2
                    "-100%",   // Hold on screen 2
                    "-202%",   // Slight overshoot past screen 3
                    "-200%",   // Settle on screen 3
                    "-200%",   // Hold on screen 3
                    "-302%",   // Slight overshoot past screen 4
                    "-300%",   // Settle on screen 4
                    "-300%",   // Hold on screen 4
                    "2%",      // Slight overshoot when returning
                    "0%"       // Back to start
                  ]
                }}
                transition={{
                  duration: 24,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [
                    0,      // Start
                    0.15,   // Hold screen 1
                    0.18,   // Overshoot to screen 2
                    0.2,    // Settle on screen 2
                    0.35,   // Hold screen 2
                    0.38,   // Overshoot to screen 3
                    0.4,    // Settle on screen 3
                    0.55,   // Hold screen 3
                    0.58,   // Overshoot to screen 4
                    0.6,    // Settle on screen 4
                    0.75,   // Hold screen 4
                    0.78,   // Overshoot back
                    0.8     // Back to start
                  ]
                }}
              >
                {/* Screen 1: Current Content */}
                <div className="h-full p-4 space-y-4">
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

                  {/* AI Assist Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 shadow-sm border border-blue-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-blue-100 rounded-full mt-1">
                        <Lightbulb size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-800 mb-1">AI Suggestion</p>
                        <p className="text-xs text-gray-600">Nice progress on saving! 🎯 Consider allocating a bit more towards your 'College Fund' goal this week.</p> 
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Screen 2: Fullscreen Panda Video */}
                <div className="h-full relative bg-black">
                  <video 
                    className="w-full h-full object-cover"
                    src="/panda.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur text-white px-3 py-2 rounded-lg">
                    <p className="text-xs font-medium mb-1">Now Learning</p>
                    <p className="text-sm font-bold">Smart Spending Habits</p>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-emerald-500/90 backdrop-blur text-white px-3 py-2 rounded-lg">
                    <p className="text-xs mb-1">Daily Streak</p>
                    <p className="text-lg font-bold flex items-center gap-1">14 <span className="text-sm">🔥</span></p>
                  </div>
                </div>

                {/* Screen 3: Achievements & Rewards */}
                <div className="h-full p-4 space-y-4 flex flex-col justify-center">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-xl font-bold mb-4 font-display">Recent Achievements</div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                        <span className="text-2xl">🏆</span>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">First Investment!</p>
                          <p className="text-xs text-gray-600">Made your first stock purchase</p>
                        </div>
                        <span className="text-emerald-600 font-bold">+$5</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <span className="text-2xl">💎</span>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">Quiz Master</p>
                          <p className="text-xs text-gray-600">Scored 100% on 5 quizzes</p>
                        </div>
                        <span className="text-emerald-600 font-bold">+$10</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                        <span className="text-2xl">🚀</span>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">7-Day Streak!</p>
                          <p className="text-xs text-gray-600">Keep learning every day</p>
                        </div>
                        <span className="text-emerald-600 font-bold">+$3</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 text-white">
                    <div className="text-sm font-medium mb-1">Total Earned</div>
                    <div className="text-3xl font-bold mb-2">$47.50</div>
                    <div className="text-xs opacity-90">This month • Top 10% of users</div>
                  </div>
                </div>

                {/* Screen 4: Community */}
                <div className="h-full p-4 space-y-4 flex flex-col justify-center">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-xl font-bold mb-3 font-display">Community Feed</div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm">
                          <Image
                            src="/genmojis/teen-girl-success.png"
                            alt="Sarah"
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">Sarah M.</p>
                          <p className="text-xs text-gray-600">Just hit my first $1000 in investments! 🚀</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500">2m ago</span>
                            <span className="text-xs text-emerald-600">❤️ 24</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                          <Image
                            src="/genmojis/teen-investor.png"
                            alt="Alex"
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">Alex T.</p>
                          <p className="text-xs text-gray-600">Started my dropshipping business today!</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500">5m ago</span>
                            <span className="text-xs text-emerald-600">❤️ 18</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">
                          <Image
                            src="/genmojis/teen-focused.png"
                            alt="Jordan"
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">Jordan K.</p>
                          <p className="text-xs text-gray-600">Completed the crypto module! Mind = blown 🤯</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500">8m ago</span>
                            <span className="text-xs text-emerald-600">❤️ 31</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                    <p className="text-sm font-semibold text-purple-800 mb-1">Weekly Challenge</p>
                    <p className="text-xs text-gray-600">Complete 5 lessons to unlock bonus content!</p>
                    <div className="mt-2 flex gap-1">
                      {[1,2,3,4,5].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full ${i <= 3 ? 'bg-purple-500' : 'bg-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Credit Card Element - Hidden on smaller screens */}
      <motion.div
        className="hidden xl:block absolute top-[55%] left-[25%] w-[32rem] h-[20rem] z-50 -rotate-6"
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
        <Image
          src="/metallic_card.png"
          alt="Banyan Credit Card"
          width={512}
          height={320}
          className="w-full h-full object-contain drop-shadow-xl"
        />
      </motion.div>

      {/* Savings Progress Ring - Hidden on smaller screens */}
      <motion.div
        className="hidden xl:flex absolute right-[32%] top-[15%] h-40 w-40 rounded-full
                   bg-white/10 backdrop-blur-md items-center justify-center
                   ring-4 ring-emerald-500/30 z-20"
        style={{ rotateX, rotateY }}        // reuse existing transforms for 3-D feel
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" className="h-32 w-32 rotate-[-90deg]">
          <circle cx="50" cy="50" r="40" stroke="#D1FAE5" strokeWidth="8" fill="none" />
          <motion.circle
            cx="50" cy="50" r="40"
            stroke="#10B981" strokeWidth="8" fill="none" strokeLinecap="round"
            strokeDasharray="251"          // 2πr
            strokeDashoffset="94.125"         // % complete (251 * (1 - 0.625))
            animate={{ strokeDashoffset: [251, 94.125] }}  // Animate from 0 to 62.5%
            transition={{ duration: 1.5, repeat: 0, ease: "easeOut", delay: 1.5 }} // Animate once on load
          />
        </svg>
        {/* Revert to flex centering, use translate-y to nudge label up */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Adjust text positioning */}
          <p className="text-lg font-bold text-emerald-600 -translate-y-1">$25<span className="text-sm font-normal text-gray-500">/mo</span></p>
          <p className="text-xs font-medium text-emerald-700 translate-y-1">Earned Back</p>
        </div>
      </motion.div>

      {/* Parent Notification - Hidden on smaller screens */}
      <motion.div
        className="hidden xl:flex absolute left-[-30%] top-[15%] w-52 bg-white rounded-xl shadow-lg p-2 z-[100]"
        initial={{ opacity: 0, x: -50 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          y: [0, -5, 0]
        }}
        transition={{
          opacity: { delay: 0.8, duration: 0.5 },
          x: { delay: 0.8, duration: 0.5 },
          y: { delay: 1.3, duration: 3, repeat: Infinity }
        }}
        style={{ rotateX, rotateY }}
      >
        <div className="flex items-start gap-2">
          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 text-xs">Module Earnings!</h4>
            <p className="text-xs text-gray-600 mt-1">You earned $5 for mastering Budgeting! 🚀</p>
            <p className="text-xs text-emerald-600 mt-1">Just now</p>
          </div>
        </div>
      </motion.div>

      {/* New Bottom Left Notification - Hidden on smaller screens */}
      <motion.div
        className="hidden xl:flex absolute left-[-32%] bottom-[20%] w-56 bg-blue-50 rounded-xl shadow-lg p-3 z-[100]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          y: [0, -5, 0]
        }}
        transition={{
          opacity: { delay: 1.7, duration: 0.5 },
          scale: { delay: 1.7, duration: 0.5 },
          y: { delay: 2.2, duration: 3, repeat: Infinity }
        }}
        style={{ rotateX, rotateY }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-blue-800">Module Mastery</h4>
            <p className="text-sm text-gray-600">You've earned +25 points for your savings skills!</p>
          </div>
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
