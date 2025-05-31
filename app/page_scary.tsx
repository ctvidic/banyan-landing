"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Leaf, BookOpen, TrendingUp, Shield, XCircle, AlertTriangle, MinusCircle, GraduationCap, Gamepad2, Lock, Cpu, Users, BookCopy, MessageCircle, BarChart3, Globe, Bitcoin, Settings, Award, LifeBuoy, ScrollText, HeartHandshake, PiggyBank, CircleDollarSign, LineChart, Code, CalendarDays, DollarSign, Zap, User, CreditCard, BarChartHorizontal, Bell, ToggleRight, ToggleLeft, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import TestimonialCard from "@/components/testimonial-card"
import CurriculumAccordion from "@/components/curriculum-accordion"
import FeatureCard from "@/components/feature-card"
import HeroAnimation from "@/components/hero-animation"
import MobileMenu from "@/components/mobile-menu"
import ModuleCard from "@/components/module-card"
import { WaitlistForm } from "./components/WaitlistForm"
import RoadmapSection from "@/components/roadmap-section"
import Header from "@/components/Header"
import { motion } from "framer-motion"
import React, { useState, useRef, useLayoutEffect } from "react"

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

  // HERO SCROLL ANIMATION STATE
  const [showText, setShowText] = useState(true);
  const [showApp, setShowApp] = useState(false);
  
  useLayoutEffect(() => {
    if (!carouselRef.current || !constraintsRef.current) return;
    const scrollableWidth = carouselRef.current.scrollWidth;
    const viewportWidth = constraintsRef.current.offsetWidth;
    setDragConstraintsWidth(Math.max(0, scrollableWidth - viewportWidth));
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      // Text is always visible (removed the scroll-based logic for text)
      setShowText(true);
      // Show app after 30% of viewport height scrolled
      setShowApp(scrollY > vh * 0.3);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-black">
      {/* Navigation */}
      <Header theme="dark" showJoinWaitlist={false} />

      {/* HERO SECTION PINNED UNTIL MAIN SECTION */}
      <div style={{ position: 'relative', zIndex: 20 }}>
        {/* Pinned Hero Section */}
        <div
          style={{
            position: 'sticky',
            top: '0px',
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: 20,
            overflow: 'hidden',
          }}
        >
          <section className="relative min-h-screen w-full overflow-hidden bg-black">
            {/* Full-viewport hero image */}
            <Image
              src="/basement-dweller-2-wide.png"
              alt="A worried young adult in a basement, symbolizing fear of failure to launch"
              fill
              priority
              className="object-cover w-full h-full absolute inset-0 z-0"
              style={{ filter: 'brightness(0.7)' }}
            />
            {/* Scroll-driven overlays */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between h-screen container mx-auto">
              {/* Left: Headline and subheadline, fade/slide in on scroll */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={showText ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                transition={{ duration: 0.8 }}
                className="flex-1 flex flex-col justify-center items-start h-full px-4 md:px-0 pointer-events-none"
                style={{ color: 'white', maxWidth: '600px' }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
                  26 Years Old and Living in Mom's Basement.<br className="hidden md:block" />
                  {/* Secure Their Financial Future Today */}
                </h1>
                <p className="text-lg md:text-2xl font-medium drop-shadow-md">
                  Don't let your child be a statistic. Teach your teen the skills to be financially independent for life.
                </p>
                {/* Statistics bar */}
                {/* <div className="mt-8 flex flex-wrap gap-4 md:gap-8">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                    <p className="text-2xl font-bold text-emerald-400">68%</p>
                    <p className="text-sm text-gray-300">fear kids will be worse off</p>
                  </div>
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                    <p className="text-2xl font-bold text-emerald-400">46%</p>
                    <p className="text-sm text-gray-300">of Gen Z need family help</p>
                  </div>
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                    <p className="text-2xl font-bold text-emerald-400">25%</p>
                    <p className="text-sm text-gray-300">of parents in debt for basics</p>
                  </div>
                </div> */}
              </motion.div>
              {/* Right: App preview, fade/slide in on further scroll, now absolutely positioned
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={showApp ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden md:block absolute top-[20%] right-[-8vw] h-[400px] sm:h-[450px] md:h-[550px] w-[350px] lg:w-[400px] xl:w-[480px]"
                style={{ zIndex: 30 }}
              >
                <HeroAnimation />
              </motion.div> */}
            </div>
          </section>
        </div>
        {/* Floating Button - Moved outside of nested components */}
        <motion.button
          type="button"
          className="fixed bottom-8 right-8 z-[9999] inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
          onClick={() => window.location.href = '/'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ pointerEvents: 'auto' }}
        >
          <Leaf className="mr-2 h-4 w-4" />
          Tell me more about Banyan
        </motion.button>
        {/* Spacer to allow scrolling through hero before main content */}
        <div style={{ height: '40vh', width: '100%' }}></div>
      </div>

    {/* --- NEW SECTION 1: WHY BANYAN? --- */}
    <section className="py-8 md:py-10 lg:py-12 bg-gray-900 overflow-hidden">
      <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-4"
          >
            {/* <div className="inline-flex items-center rounded-full border border-emerald-500/20 px-4 py-1.5 text-sm font-medium bg-emerald-500/10 text-emerald-400 mb-4">
              Why Banyan?
            </div> */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Prevent financial failure before it starts 🚨</h2>
            <p className="text-lg text-gray-300">
              68% of parents fear their kids will be worse off financially. Don't let yours be one of them. 
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Source: <a href="https://www.cnbc.com/2021/07/21/many-americans-think-children-will-be-financially-worse-off-than-their-parents.html" target="_blank" rel="noopener noreferrer" className="underline">CNBC</a>
            </p>
          </motion.div>

        </div>
      </section>

      {/* --- NEW SECTION 1B: BAD HABITS START EARLY --- */}
      <section className="py-8 md:py-10 lg:py-12 bg-gray-950 overflow-hidden">
        <div className="container grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 order-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">Bad Habits Start Early</h2>
            <div className="text-base text-gray-400 font-normal mb-2">They don't teach this in school.</div>
            <p className="text-lg text-gray-300">
              Teens learn to swipe, not save. Without a foundation in smart money habits, spending becomes impulsive—and saving becomes foreign.
            </p>
            {/* <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">
                <span className="text-emerald-400 font-semibold">43%</span> of Gen Z overspend every week, with 32% overspending on hobbies
              </p>
              <p className="text-xs text-gray-500 mt-1">Source: <a href="https://www.firstmerchants.com/resources/learn/blogs/blog-detail/resource-library/2024/12/23/generational-spending-habits--how-gen-x--z-and-millennials-compare" target="_blank" rel="noopener noreferrer" className="underline">First Merchants Bank</a></p>
            </div> */}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center order-2"
          >
            <Image
              src="/teen-overspend.png"
              alt="Teen overspending illustration"
              width={420}
              height={420}
              className="rounded-xl shadow-lg object-contain bg-gray-900"
              priority={false}
            />
          </motion.div>
        </div>
      </section>

       {/* --- NEW SECTION 1C: DEBT AND DEPENDENCY --- */}
       <section className="py-8 md:py-10 lg:py-12 bg-gray-900 overflow-hidden">
        <div className="container grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 order-1 md:order-2"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">Debt and Dependency</h2>
            <div className="text-base text-gray-400 font-normal mb-2">Credit before comprehension.</div>
            <p className="text-lg text-gray-300">
            From credit cards to student loans, financial traps are everywhere. Without proper guidance, it's easy to slip into debt and hard to climb out.
            </p>
            <div className="mt-6 space-y-3">
              {/* <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400">
                  The average Gen Z borrower owes <span className="text-emerald-400 font-semibold">$22,948</span> in student loan debt, with 64% making payments under $200/month
                </p>
                <p className="text-xs text-gray-500 mt-1">Source: <a href="https://educationdata.org/student-loan-debt-by-generation" target="_blank" rel="noopener noreferrer" className="underline">Education Data Initiative</a></p>
              </div> */}
              {/* <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400">
                  Gen Z has added <span className="text-emerald-400 font-semibold">$50 billion</span> in auto loan debt since 2020, with 10% paying over 40% of their income on car payments.
                </p>
                <p className="text-xs text-gray-500 mt-1">Source: <a href="https://www.autoweek.com/news/industry-news/a43141284/auto-loans-unpaid-gen-z/" target="_blank" rel="noopener noreferrer" className="underline">AutoWeek/Federal Reserve</a></p>
              </div> */}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center order-2 md:order-1"
          >
            <Image
              src="/dweller-tesla.png"
              alt="Teen overspending illustration"
              width={420}
              height={420}
              className="rounded-xl shadow-lg object-contain bg-gray-900"
              priority={false}
            />
          </motion.div>
        </div>
      </section>

      {/* --- NEW SECTION 1D: UNDEREMPLOYMENT --- */}
      <section className="py-8 md:py-10 lg:py-12 bg-gray-950 overflow-hidden">
        <div className="container grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 order-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">Earning Potential Wasted</h2>
            <div className="text-base text-gray-400 font-normal mb-2">Years of education, and nothing to show for it.</div>
            <p className="text-lg text-gray-300">
            Teens who never learned to value money often struggle to earn it, or settle for less than they're worth.
            </p>
            {/* <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">
                <span className="text-emerald-400 font-semibold">41%</span> of recent college graduates are underemployed, working in jobs that don't require a degree
              </p>
              <p className="text-xs text-gray-500 mt-1">Source: <a href="https://www.newyorkfed.org/research/college-labor-market/college-labor-market_underemployment_rates" target="_blank" rel="noopener noreferrer" className="underline">Federal Reserve Bank of New York</a></p>
            </div> */}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center order-2"
          >
            <Image
              src="/dweller-underemployed.png"
              alt="Teen overspending illustration"
              width={420}
              height={420}
              className="rounded-xl shadow-lg object-contain bg-gray-900"
              priority={false}
            />
          </motion.div>
        </div>
      </section>

     

      {/* --- NEW SECTION 1D: INVESTING IN THE FUTURE --- */}
      <section className="py-8 md:py-10 lg:py-12 bg-gray-900 overflow-hidden">
        <div className="container grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 order-1 md:order-2"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">Late to Investing</h2>
            <div className="text-base text-gray-400 font-normal mb-2">You can never get lost time back.</div>
            <p className="text-lg text-gray-300">
            Most adults begin investing too little, too late, and miss out on years of compound growth.
            </p>

            {/* <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">
                Starting to invest at 35 instead of 25 means you need to save <span className="text-emerald-400 font-semibold">2x as much</span> monthly to reach the same retirement goal
              </p>
              <p className="text-xs text-gray-500 mt-1">Source: <a href="https://www.cnbc.com/2024/01/05/suze-orman-young-people-dont-get-compound-interest.html" target="_blank" rel="noopener noreferrer" className="underline">CNBC</a></p>
            </div> */}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center order-2 md:order-1"
          >
            <Image
              src="/dweller-old.png"
              alt="Teen overspending illustration"
              width={420}
              height={420}
              className="rounded-xl shadow-lg object-contain bg-gray-900"
              priority={false}
            />
          </motion.div>
        </div>
      </section>

      {/* --- NEW SECTION 1E: Solution --- */}
      <section className="py-8 md:py-10 lg:py-12 bg-gray-950 overflow-hidden">
        <div className="container grid md:grid-cols-2 gap-12 md:gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 order-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">The Solution</h2>
            {/* <div className="text-base text-gray-400 font-normal mb-2">Credit before comprehension.</div> */}
            <p className="text-lg text-gray-300">
            It doesn't have to be this way. With the tools Banyan provides, your child can learn to earn, save, and invest while they're still young.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center order-2"
          >
            <Image
              src="/teen-happy-rich.png"
              alt="Teen overspending illustration"
              width={420}
              height={420}
              className="rounded-xl shadow-lg object-contain bg-gray-900"
              priority={false}
            />
          </motion.div>
        </div>
      </section>

      {/* Final Statistics Section - The Reality Check */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl"></div>
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Reality Check 📊</h2>
            <p className="text-lg text-gray-300">
              These aren't just numbers. They're a wake-up call for every parent.
            </p>
          </motion.div>

          {/* Statistics Grid */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center"
              >
                <div className="text-5xl font-bold text-emerald-400 mb-2">57%</div>
                <p className="text-gray-300">of 18-24 year-olds still live with parents</p>
                <p className="text-xs text-gray-500 mt-2">Source: <a href="https://www.usatoday.com/story/news/nation/2024/06/04/gen-z-living-at-home/73958955007/" target="_blank" rel="noopener noreferrer" className="underline">U.S. Census 2022</a></p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center"
              >
                <div className="text-5xl font-bold text-emerald-400 mb-2">82%</div>
                <p className="text-gray-300">can't afford to move out on their income</p>
                <p className="text-xs text-gray-500 mt-2">Source: <a href="https://www.apartmentlist.com/research/most-young-adults-live-with-parents-since-1940" target="_blank" rel="noopener noreferrer" className="underline">Apartment List 2022</a></p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center"
              >
                <div className="text-5xl font-bold text-emerald-400 mb-2">$1,400</div>
                <p className="text-gray-300">average monthly parent support to adult children</p>
                <p className="text-xs text-gray-500 mt-2">Source: <a href="https://fortune.com/2025/03/26/millennial-gen-z-adult-children-parents-monthly-payments-retirement/" target="_blank" rel="noopener noreferrer" className="underline">Fortune 2025</a></p>
              </motion.div>
            </div>

            {/* Additional alarming stat */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 bg-red-900/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/30 text-center"
            >
              <p className="text-lg text-white">
                <span className="text-3xl font-bold text-red-400">1 in 3</span> adults aged 25-34 still live in their parents' home
              </p>
              <p className="text-sm text-red-200 mt-2">The highest rate since the Great Depression</p>
              <p className="text-xs text-red-300 mt-1">Source: <a href="https://www.cnbc.com/2024/11/17/why-many-young-adults-in-the-us-are-still-living-with-their-parents.html" target="_blank" rel="noopener noreferrer" className="underline">CNBC 2024</a></p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tell me about Banyan */}
      <section id="waitlist-form" className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="container text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 max-w-2xl mx-auto">
            Don't Wait for a Crisis. Secure Your Teen's Future Today ✨
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-emerald-100">Give your teen the financial head start they deserve.</p>
          
          <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-full mt-4" size="lg" onClick={() => window.location.href = '/'}>
            See the Banyan difference.
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 bg-gray-950 text-gray-400">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div>
              <h3 className="font-bold text-white mb-4">Banyan</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Curriculum
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Partners
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Developers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
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
