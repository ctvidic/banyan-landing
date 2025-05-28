"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Leaf, BookOpen, TrendingUp, Shield, XCircle, AlertTriangle, MinusCircle, GraduationCap, Gamepad2, Lock, Cpu, Users, BookCopy, MessageCircle, BarChart3, Globe, Bitcoin, Settings, Award, LifeBuoy, ScrollText, HeartHandshake, PiggyBank, CircleDollarSign, LineChart, Code, CalendarDays, DollarSign, Zap, User, CreditCard, BarChartHorizontal, Bell, ToggleRight, ToggleLeft, Map, FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import TestimonialCard from "@/components/testimonial-card"
import CurriculumAccordion from "@/components/curriculum-accordion"
import FeatureCard from "@/components/feature-card"
import HeroAnimation from "@/components/hero-animation"
import MobileMenu from "@/components/mobile-menu"
import ModuleCard from "@/components/module-card"
import { WaitlistForm } from "./components/WaitlistForm"
import { motion } from "framer-motion"
import React, { useState, useRef, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import InteractiveDemo from "@/components/interactive-demo/InteractiveDemo"

// Parent Dashboard Card Component (Optional Helper)
const ParentDashboardCard = () => {
  // Use state for toggles to make them interactive on hover/click if desired later
  const [cardEnabled, setCardEnabled] = useState(true);
  const [investEnabled, setInvestEnabled] = useState(false);

  return (
    <motion.div
      className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-gray-200 overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
        <div className="flex items-center gap-3">
          <Image
            src="/unnamed.jpg"
            alt="Alex's Profile Photo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-800">Tom's Account</p>
            <p className="text-xs text-gray-500">Managed by You</p>
          </div>
        </div>
        <div className="p-1.5 bg-yellow-100 rounded-full animate-pulse">
          <Bell size={16} className="text-yellow-600" />
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Card Toggle */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Card Spending</span>
          </div>
          <motion.div 
            onClick={() => setCardEnabled(!cardEnabled)} 
            className="cursor-pointer p-0.5 rounded-full"
            animate={{ backgroundColor: cardEnabled ? "#10b981" : "#e5e7eb" }}
            transition={{ duration: 0.3 }}
          >
            {cardEnabled ? 
              <ToggleRight size={28} className="text-white" /> : 
              <ToggleLeft size={28} className="text-gray-500" />
            }
          </motion.div>
        </div>

        {/* Investing Toggle */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <BarChartHorizontal size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Investing Access</span>
          </div>
          <motion.div 
            onClick={() => setInvestEnabled(!investEnabled)} 
            className="cursor-pointer p-0.5 rounded-full"
            animate={{ backgroundColor: investEnabled ? "#10b981" : "#e5e7eb" }}
            transition={{ duration: 0.3 }}
          >
            {investEnabled ? 
              <ToggleRight size={28} className="text-white" /> : 
              <ToggleLeft size={28} className="text-gray-500" />
            }
          </motion.div>
        </div>

        {/* Spending Limit */}
        <div className="p-3 bg-gray-50 rounded-lg">
           <p className="text-sm font-medium text-gray-700 mb-1">Weekly Spend Limit</p>
           <div className="flex items-center justify-between">
             <span className="text-xl font-bold text-gray-800">$50.00</span>
             <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Active</span>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [dragConstraintsWidth, setDragConstraintsWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current && constraintsRef.current) {
      const scrollableWidth = carouselRef.current.scrollWidth;
      const viewportWidth = constraintsRef.current.offsetWidth;
      setDragConstraintsWidth(Math.max(0, scrollableWidth - viewportWidth));
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 border-b border-gray-100/20 supports-[backdrop-filter]:bg-white/30">
        <div className="container flex h-16 items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Leaf className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">Banyan</span>
          </motion.div>
          {/* <nav className="hidden md:flex items-center gap-6">
            {["Features", "Curriculum", "Testimonials", "Pricing"].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link 
                  href={`#${item.toLowerCase()}`} 
                  className="text-sm font-medium hover:text-emerald-600 transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all group-hover:w-full" />
            </Link>
              </motion.div>
            ))}
          </nav> */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-full" onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}>Join Waitlist</Button>
            <MobileMenu />
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-20 lg:py-24 bg-gradient-to-b from-emerald-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-300/30 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>

        <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-5 items-center relative">
          <div className="flex flex-col gap-6 max-w-lg lg:col-span-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              <span className="font-bold text-emerald-600">Pay</span> Your Child to Learn
            </h1>
            <p className="text-lg text-gray-600">
              They'll master real‑world money skills and earn up to $40/mo back from your subscription.
            </p>
            <div className="flex flex-col md:flex-row gap-4 mt-2">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 rounded-full w-full sm:w-auto" onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}>
                Join the Waitlist – It's Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="ghost" className="rounded-full w-full sm:w-auto" asChild>
                <Link href="#how-it-works">How It Works</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] sm:h-[450px] md:h-[550px] lg:col-span-3 lg:translate-x-[25%] xl:translate-x-[35%]">
            <HeroAnimation />
          </div>
        </div>
      </section>

      {/* --- NEW SECTION 1: Modern Skills -> Real Tools --- */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-emerald-50/50 overflow-hidden">
        <div className="container grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center rounded-full border border-emerald-200 px-4 py-1.5 text-sm font-medium bg-emerald-50 text-emerald-700 self-start">
              Future-Ready Financial Skills
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Master Real-World Finance, Then Practice Safely ✨</h2>
            <p className="text-lg text-gray-600">
              Banyan builds core financial skills—<span className="font-semibold">earning, investing, saving, and budgeting</span>—via interactive modules and testing. Mastery unlocks modern financial topics like market analysis, online income, and startup basics, leading to safe practice with the Banyan Card & investing platform.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>Explore advanced modern topics: fintech evolution, crypto's role, and online entrepreneurship. 🚀</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>Engage with interactive modules and simulations to solidify understanding. 🎮</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>Earn access to real financial tools through demonstrated knowledge. 🔑</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>Build confidence by applying learned strategies in a controlled environment. 🛡️</span>
              </li>
            </ul>
            {/* <Button size="lg" variant="outline" className="rounded-full self-start mt-4" asChild>
              <Link href="#curriculum">Explore the Curriculum</Link>
            </Button> */}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6"
          >
            {[ 
              // Selected Modules based on provided curriculum
              { icon: PiggyBank, label: "Budgeting & Expenses" },        // Module 5
              { icon: CircleDollarSign, label: "Saving Strategies" },     // Implicit Module 10
              { icon: LineChart, label: "Investing & Stocks" },       // Module 10
              { icon: TrendingUp, label: "Practical Investing" },     // Module 10a
              // { icon: BarChart3, label: "Investment Metrics" },       // Module 10b
              { icon: CreditCard, label: "Credit Fundamentals" },    // Module 7
              { icon: Globe, label: "Entrepreneurship Basics" },   // Module 12
              // { icon: Bitcoin, label: "Fintech & Crypto" },        // Module 18
              // { icon: Users, label: "Online Income Streams" },    // Module 12 (Implied)
              { icon: GraduationCap, label: "Paying for College" },     // Module 13
              { icon: Shield, label: "Insurance & Risk" },       // Module 9
              { icon: Zap, label: "Digital Payments" },        // Module 3
            ].map((item, i) => (
              <motion.div 
                key={item.label}
                className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 h-full"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="p-3 bg-emerald-100 rounded-full mb-3">
                  <item.icon size={24} className="text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-gray-700 mt-auto pt-2">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
          </div>
      </section>

      {/* --- NEW SECTION 2: AI-Powered Guidance --- */}
      <section className="py-16 md:py-20 lg:py-24 bg-emerald-900/95 text-white overflow-hidden">
        <div className="container grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="relative h-80 md:h-96 flex items-center justify-center order-last md:order-first"
          >
            <div className="relative w-64 h-64 md:w-72 md:h-72">
              {/* SVG Gauge */}
              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
                <circle 
                  cx="100" 
                  cy="100" 
                  r="80" 
                  stroke="#10b981" // emerald-500
                  strokeOpacity="0.2" 
                  strokeWidth="12" 
                  fill="none" 
                />
                <motion.circle 
                  cx="100" 
                  cy="100" 
                  r="80" 
                  stroke="#10b981" // emerald-500
                  strokeWidth="12" 
                  fill="none" 
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)" // Start from top
                  strokeDasharray="502.65" // 2 * pi * 80
                  initial={{ strokeDashoffset: 502.65 }} // Start empty
                  whileInView={{ strokeDashoffset: 120.63 }} // ~76% full for 720 score (502.65 * (1 - 0.76))
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                />
              </svg>
              {/* Score Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  className="text-5xl md:text-6xl font-bold text-emerald-300"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: 0.8 }}
                >
                  720
                </motion.span>
                <span className="text-sm font-medium text-emerald-400/80 mt-1">Banyan Score</span>
                <span className="text-xs text-emerald-500 mt-0.5">(Proficient)</span>
              </div>
              {/* Animated Score Contributor Popups */}
              <motion.div
                className="absolute top-[20%] left-[15%] text-xs bg-emerald-700/80 px-2 py-1 rounded-md shadow-md"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }}
                viewport={{ once: true }}
                transition={{ delay: 1.5, duration: 2, times: [0, 0.2, 0.8, 1] }}
              >
                +8 Accuracy
              </motion.div>
              <motion.div
                className="absolute bottom-[25%] right-[10%] text-xs bg-emerald-700/80 px-2 py-1 rounded-md shadow-md"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: [0, 1, 1, 0], y: [-10, 0, 0, 10] }}
                viewport={{ once: true }}
                transition={{ delay: 1.8, duration: 2, times: [0, 0.2, 0.8, 1] }}
              >
                +3 Consistency
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center rounded-full border border-emerald-500 px-4 py-1.5 text-sm font-medium bg-emerald-700 text-emerald-100 self-start">
              Personalized Learning Path
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Intelligent Guidance That Adapts & Motivates 🧠</h2>
            <p className="text-lg text-emerald-200">
              An initial diagnostic tailors the curriculum to your teen's level. Our AI identifies knowledge gaps, adapts lesson difficulty, and uses spaced repetition to ensure retention. The unique Credit Score Counter gamifies progress!
            </p>
            <ul className="space-y-3 text-emerald-100">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span>Personalized skill tree avoids repeating already known concepts. 🌳</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span>AI-driven feedback and adaptive difficulty keeps learning efficient. 🤖</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span>Gamified Credit Score (300-850) tracks mastery and unlocks rewards. 🏆</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* --- NEW SECTION 3: Safe Real-World Practice --- */}
      <section className="py-16 md:py-20 lg:py-24 bg-gray-50 overflow-hidden">
        <div className="container grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium bg-white text-gray-600 self-start">
              Controlled Hands-On Experience
          </div>
            <h2 className="text-3xl md:text-4xl font-bold">Real Practice, Real Safety Nets 🔒</h2>
            <p className="text-lg text-gray-600">
              The Banyan Card and investing platform are unlocked progressively as modules are mastered. Parents deposit funds upfront and set release schedules tied to learning milestones, ensuring teens practice with real money only after proving their understanding.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>Fund access is gated by learning progress and module completion. 📚</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>Set flexible spending/investing limits, category restrictions, and alerts. ⚙️</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>Gain peace of mind with full oversight via the parent dashboard. 👀</span>
              </li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="relative flex items-center justify-center"
          >
            <ParentDashboardCard />
          </motion.div>
        </div>
      </section>

      {/* --- NEW SECTION 4: Comparison Table --- */}
      {false && (
      <section className="py-16 md:py-20 lg:py-24 bg-white overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center rounded-full border border-emerald-200 px-4 py-1.5 text-sm font-medium bg-emerald-50 text-emerald-700 mb-4">
              Why Banyan?
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Smarter Way to Build Financial Futures 💰</h2>
            <p className="text-lg text-gray-600">
              See how Banyan compares to traditional methods and other apps, offering a unique blend of modern education, safe real-world practice, and intelligent guidance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="min-w-[800px] bg-white">
              {/* Header Row - Updated */}
              <div className="grid grid-cols-5 sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
                <div className="px-4 py-3 font-semibold text-gray-600 text-sm col-span-1 flex items-center">Feature</div>
                {/* Banyan Header */}
                <div className="px-4 py-3 font-semibold text-emerald-600 text-sm text-center col-span-1 flex items-center justify-center gap-2">
                  <Leaf size={18} />
                  <span className="font-display">Banyan</span>
              </div>
                {/* Traditional Ed Header */}
                <div className="px-4 py-3 font-semibold text-gray-600 text-sm text-center col-span-1 flex items-center justify-center gap-2">
                  <GraduationCap size={18} />
                  <span>Traditional Ed</span>
            </div>
                {/* Allowance Apps Header */}
                <div className="px-4 py-3 font-semibold text-gray-600 text-sm text-center col-span-1 flex items-center justify-center">Allowance Apps</div>
                {/* Investing Apps Header */}
                <div className="px-4 py-3 font-semibold text-gray-600 text-sm text-center col-span-1 flex items-center justify-center">Investing Apps</div>
              </div>

              {/* Data Rows - Updated Again */}
              {[
                {
                  icon: <BookCopy size={18} className="text-gray-500 mr-2" />,
                  feature: "Modern Practical Curriculum",
                  banyan: 'yes',
                  traditional: 'no',
                  allowance: 'limited',
                  investing: 'limited',
                },
                {
                  icon: <GraduationCap size={18} className="text-gray-500 mr-2" />,
                  feature: "Structured & Adaptive Learning",
                  banyan: 'yes',
                  traditional: 'no',
                  allowance: 'no',
                  investing: 'no',
                },
                {
                  icon: <Lock size={18} className="text-gray-500 mr-2" />,
                  feature: "Learn-to-Unlock Real Money",
                  banyan: 'yes',
                  traditional: 'na',
                  allowance: 'no',
                  investing: 'no',
                },
                {
                  icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /> </svg>,
                  feature: "Debit Card",
                  banyan: 'yes',
                  traditional: 'no',
                  allowance: 'yes',
                  investing: 'limited',
                },
                {
                  icon: <TrendingUp size={18} className="text-gray-500 mr-2" />,
                  feature: "Investing Platform",
                  banyan: 'yes',
                  traditional: 'no',
                  allowance: 'limited',
                  investing: 'yes',
                },
                {
                  icon: <Shield size={18} className="text-gray-500 mr-2" />,
                  feature: "Optional Parental Controls",
                  banyan: 'yes',
                  traditional: 'na',
                  allowance: 'yes',
                  investing: 'limited',
                },
                {
                  icon: <Cpu size={18} className="text-gray-500 mr-2" />,
                  feature: "AI Personalization & Guidance",
                  banyan: 'yes',
                  traditional: 'no',
                  allowance: 'no',
                  investing: 'no',
                },
                {
                  icon: <Gamepad2 size={18} className="text-gray-500 mr-2" />,
                  feature: "Engaging Gamification",
                  banyan: 'yes',
                  traditional: 'no',
                  allowance: 'limited',
                  investing: 'no',
                },


                {
                  icon: <HeartHandshake size={18} className="text-gray-500 mr-2" />,
                  feature: "Long-Term Financial Focus",
                  banyan: 'yes',
                  traditional: 'limited',
                  allowance: 'limited',
                  investing: 'yes',
                },
              ].map((row, index) => (
                <div key={index} className={`grid grid-cols-5 gap-4 px-4 py-4 text-sm border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <div className="col-span-1 font-medium text-gray-700 flex items-center">{row.icon}{row.feature}</div>
                  {[row.banyan, row.traditional, row.allowance, row.investing].map((value, cellIndex) => {
                    let IconComponent = MinusCircle;
                    let iconColor = "text-gray-400";
                    switch (value) {
                      case 'yes':
                        IconComponent = CheckCircle;
                        iconColor = "text-emerald-500";
                        break;
                      case 'no':
                        IconComponent = XCircle;
                        iconColor = "text-red-500";
                        break;
                      case 'limited':
                        IconComponent = AlertTriangle;
                        iconColor = "text-yellow-500";
                        break;
                      case 'na':
                      default:
                        IconComponent = MinusCircle;
                        iconColor = "text-gray-400";
                        break;
                    }
                    return (
                      <div key={cellIndex} className={`col-span-1 flex items-center justify-center`}>
                        <IconComponent size={20} className={iconColor} />
            </div>
                    );
                  })}
              </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      )}

      {/* --- NEW How it Works Section --- */}
      <section id="how-it-works" className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-emerald-50/50 to-white relative overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-300/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
          >
            <div className="inline-flex items-center rounded-full border border-emerald-200 px-4 py-1.5 text-sm font-medium bg-emerald-100 text-emerald-700 mb-4">
              Learn to Earn Explained
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Turn Learning into Earning 💡</h2>
            <p className="text-lg text-gray-600">
              Our unique Learn to Earn program directly rewards your teen's engagement. A portion of your monthly subscription fee is set aside, and your child can earn back up to 80% of it—that's potentially $40 each month!—based on their progress through the curriculum, quiz scores, and consistent learning habits.
            </p>
          </motion.div>

          {/* --- Moved Learn -> Quiz -> Earn Steps Here --- */}
          <TooltipProvider delayDuration={200}>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start text-center mb-12 md:mb-16" // Added margin-bottom
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }} // Adjusted amount for earlier trigger
              transition={{ duration: 0.5, delay: 0.2 }} // Adjusted delay
            >
              {/* Step 1: Learn */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center cursor-default bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                    <div className="p-3 bg-emerald-100 rounded-full mb-4 relative">
                      <BookOpen size={24} className="text-emerald-600" />
                      <div className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">1</div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Learn</h3>
                    <p className="text-sm text-gray-600 mt-auto pt-2">Master Finance Skills</p> { /* Adjusted styling */}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p>Complete interactive modules covering essential modern financial topics.</p>
                </TooltipContent>
              </Tooltip>

              {/* Step 2: Quiz */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center cursor-default bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                    <div className="p-3 bg-emerald-100 rounded-full mb-4 relative">
                      <FileQuestion size={24} className="text-emerald-600" />
                       <div className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">2</div>
                   </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Quiz</h3>
                    <p className="text-sm text-gray-600 mt-auto pt-2">Test Your Knowledge</p> { /* Adjusted styling */}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p>Solidify your understanding by passing quizzes after each module.</p>
                </TooltipContent>
              </Tooltip>

              {/* Step 3: Earn */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center cursor-default bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                    <div className="p-3 bg-emerald-100 rounded-full mb-4 relative">
                      <DollarSign size={24} className="text-emerald-600" />
                      <div className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">3</div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Earn $</h3>
                    <p className="text-sm text-gray-600 mt-auto pt-2">Get Rewarded Daily</p> { /* Adjusted styling */}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p>Earn real money back from your subscription based on your progress.</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          </TooltipProvider>
          {/* --- End Moved Steps --- */}

           <motion.p 
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5, delay: 0.4 }}
             className="text-center text-gray-500 text-sm mt-12 max-w-xl mx-auto"
            >
             The earned amount is added to the teen's Banyan account balance, available for spending or investing through the platform.
           </motion.p>
        </div>
      </section>

      {/* --- NEW SECTION FOR INTERACTIVE DEMO --- */}
      <section id="interactive-demo" className="py-6 md:py-8 lg:py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Try Our Interactive Lesson!</h2>
            <p className="text-lg text-gray-600 mt-2">Get a taste of how Banyan makes learning fun and engaging.</p>
          </div>
          <InteractiveDemo />
        </div>
      </section>

      {/* Testimonials Section */}
      {/*
      <section id="testimonials" className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
        <div className="container relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center rounded-full border border-emerald-200 px-4 py-1.5 text-sm font-medium bg-emerald-50 text-emerald-700 mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What parents are saying 💬</h2>
            <p className="text-lg text-gray-600">
              Join thousands of parents who've helped their children build financial confidence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <TestimonialCard
              quote="My daughter learned more about investing in three months with Banyan than I learned in my entire life."
              author="Jennifer K."
              role="Parent of 11th grader"
              avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d29tYW4lMjBoZWFkc2hvdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=80"
            />
            <TestimonialCard
              quote="I love that I can deposit funds but still control what my son can access. It's the perfect balance of freedom and supervision."
              author="Michael T."
              role="Parent of 10th grader"
              avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
            <TestimonialCard
              quote="The curriculum is impressive. My child is actually excited about learning financial concepts and has started saving money."
              author="Sarah L."
              role="Parent of 9th grader"
              avatar="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </div>
        </div>
      </section>
      */}

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-300/20 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="container relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center rounded-full border border-emerald-200 px-4 py-1.5 text-sm font-medium bg-emerald-50 text-emerald-700 mb-4">
              Pricing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing 💎</h2>
            <p className="text-lg text-gray-600">Invest in your child's financial future</p>
          </div>

          <div className="max-w-md mx-auto glass rounded-2xl shadow-md overflow-hidden border border-white/20">
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Family Plan</h3>
              <div className="flex justify-center items-start my-8">
                <span className="text-5xl font-extrabold">$99</span>
                <span className="text-2xl font-extrabold">.99</span>
                <span className="text-gray-500 ml-1 mt-2">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Full access to all 20 curriculum modules 📚",
                  "Parent dashboard with progress tracking 📊",
                  "Guided investing with parental controls 📈",
                  "Up to 3 child accounts included 👨‍👩‍👧‍👦",
                  "Cancel anytime ✅",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-full" size="lg" onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}>
                Join the Waitlist
              </Button>
              <p className="text-sm text-gray-500 mt-4">Be the first to know when we launch!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Waitlist Form Section */}
      <section id="waitlist-form" className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="container text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 max-w-2xl mx-auto">
            Ready to Empower Your Teen? ✨
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join the Banyan waitlist for early access and updates.</p>
          
          {/* Replace placeholder form with the WaitlistForm component */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto mt-8"
          >
            <WaitlistForm /> 
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-10 bg-gray-900 text-gray-300">
        <div className="container">
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div>
              <h3 className="font-bold text-white mb-4">Banyan</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Curriculum
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Partners
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Developers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div> */}
          <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Leaf className="h-5 w-5 text-emerald-500" />
              <span className="font-bold text-white">Banyan</span>
            </div>
            <p className="text-sm">© {new Date().getFullYear()} Banyan Financial Education. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
