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
import RoadmapSection from "@/components/roadmap-section"
import Header from "@/components/Header"
import Genmoji from "@/components/Genmoji"
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
        <div className="p-1.5 bg-yellow-100 rounded-full">
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
      <Header />

      {/* Hero Section */}
      <section className="relative py-8 md:py-12 lg:py-16 bg-gradient-to-b from-emerald-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
        
        {/* Static gradient backgrounds for performance */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full filter blur-3xl"></div>

        <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-5 items-center relative">
          <div className="flex flex-col gap-6 max-w-lg lg:col-span-2">
            <motion.div 
              className="inline-flex items-center rounded-full border border-emerald-200/50 px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 mb-2 backdrop-blur-sm shadow-lg shadow-emerald-100/50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="font-semibold">⚡ Limited Early Access</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-300% animate-gradient">Future Millionaires</span> 🚀
              <br />
              <span className="text-2xl md:text-3xl lg:text-4xl">Start Their Journey</span>
            </h1>
            <p className="text-lg text-gray-600">
              The only financial literacy platform where teens master budgeting, saving, investing, and 
              entrepreneurship—while earning real money. <span className="font-medium text-gray-800">Designed for the next generation of leaders.</span>
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <motion.div 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100 hover:border-emerald-200 transition-all"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-base">💰</span>
                <span className="font-medium text-gray-700">Budgeting & Saving</span>
              </motion.div>
              <motion.div 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100 hover:border-emerald-200 transition-all"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-base">📈</span>
                <span className="font-medium text-gray-700">Real Investing</span>
              </motion.div>
              <motion.div 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100 hover:border-emerald-200 transition-all"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-base">🎮</span>
                <span className="font-medium text-gray-700">Earn While Learning</span>
              </motion.div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-2">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white rounded-full w-full sm:w-auto group relative overflow-hidden shadow-sm hover:shadow-md transition-all" onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}>
                <span className="relative z-10 flex items-center">
                  Reserve Your Spot
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
              <Button size="lg" variant="ghost" className="rounded-full w-full sm:w-auto text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 border border-gray-200" asChild>
                <Link href="#interactive-demo">Experience the Platform</Link>
              </Button>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-gray-400" />
                <span>Parent-approved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-gray-400" />
                <span>Portfolio-worthy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-gray-400" />
                <span>Exclusive community</span>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] sm:h-[450px] md:h-[550px] lg:col-span-3 lg:translate-x-[25%] xl:translate-x-[35%]">
            <HeroAnimation />
          </div>
        </div>
      </section>

      {/* Curriculum Alignment Section - With Logo Carousel */}
      <section className="py-12 md:py-16 border-y bg-gray-50/50">
        <div className="container">
          <h2 className="text-center text-lg font-medium text-gray-600 mb-10">
            Curriculum Aligned with Global Financial Literacy Frameworks & Leading Research
          </h2>
          {/* Carousel Wrapper */}
          <div className="relative overflow-hidden group">
            <motion.div 
              className="flex gap-x-12 md:gap-x-16 lg:gap-x-20"
              animate={{
                x: ['0%', '-50%']
              }}
              transition={{
                ease: 'linear', 
                duration: 20,
                repeat: Infinity
              }}
            >
              {/* First set of logos */}
              <div className="flex-shrink-0 h-12 flex items-center opacity-60 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0">
                <Image src="/alpha.png" alt="Alpha Org Logo" height={40} width={120} style={{ height: '40px', width: 'auto' }} />
              </div>
              <div className="flex-shrink-0 h-12 flex items-center opacity-60 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0">
                <Image src="/stanford.png" alt="Stanford University Logo" height={45} width={150} style={{ height: '45px', width: 'auto' }} />
              </div>
              <div className="flex-shrink-0 h-12 flex items-center opacity-60 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0">
                <Image src="/texas.png" alt="University of Texas Logo" height={50} width={160} style={{ height: '50px', width: 'auto' }} />
              </div>
              <div className="flex-shrink-0 h-12 flex items-center opacity-60 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0">
                <Image src="/ngpf.svg" alt="Next Gen Personal Finance Logo" height={45} width={150} style={{ height: '45px', width: 'auto' }} />
              </div>
              <div className="flex-shrink-0 h-12 flex items-center opacity-60 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0">
                <Image src="/jumpstart.webp" alt="JumpStart Logo" height={45} width={120} style={{ height: '45px', width: 'auto' }} />
              </div>
              <div className="flex-shrink-0 h-12 flex items-center opacity-60 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0">
                <Image src="/cee.png" alt="Council for Economic Education Logo" height={45} width={150} style={{ height: '45px', width: 'auto' }} />
              </div>
              
              {/* Second set of logos (duplicate for seamless loop) */}
              <div className="flex-shrink-0 h-12 flex items-center opacity-60 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0">
                <Image src="/alpha.png" alt="Alpha Org Logo" height={40} width={120} style={{ height: '40px', width: 'auto' }} />
              </div>
              <div className="flex-shrink-0 h-12 flex items-center opacity-60 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0">
                <Image src="/stanford.png" alt="Stanford University Logo" height={45} width={150} style={{ height: '45px', width: 'auto' }} />
              </div>
              <div className="flex-shrink-0 h-12 flex items-center opacity-60 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0">
                <Image src="/texas.png" alt="University of Texas Logo" height={50} width={160} style={{ height: '50px', width: 'auto' }} />
              </div>
              <div className="flex-shrink-0 h-12 flex items-center opacity-60 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0">
                <Image src="/ngpf.svg" alt="Next Gen Personal Finance Logo" height={45} width={150} style={{ height: '45px', width: 'auto' }} />
              </div>
              <div className="flex-shrink-0 h-12 flex items-center opacity-60 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0">
                <Image src="/jumpstart.webp" alt="JumpStart Logo" height={45} width={120} style={{ height: '45px', width: 'auto' }} />
              </div>
              <div className="flex-shrink-0 h-12 flex items-center opacity-60 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0">
                <Image src="/cee.png" alt="Council for Economic Education Logo" height={45} width={150} style={{ height: '45px', width: 'auto' }} />
                </div>
            </motion.div>
            {/* Gradient fade edges */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-50/50 to-transparent"></div>
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-50/50 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Dual Benefits Section - REPLACING Problem Agitation */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              The App They'll <span className="text-emerald-600">Actually Open</span>
            </h2>
            <p className="text-lg text-gray-600">
              Built for the TikTok generation. Trusted by parents who get it.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* For Teens */}
          <motion.div
              className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 border border-emerald-100"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
              <div className="flex items-center gap-3 mb-6">
                <Genmoji name="teen-success" size={48} />
                <h3 className="text-xl font-bold text-gray-900">For Teens</h3>
            </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">Turn Knowledge Into Cash</p>
                    <p className="text-sm text-gray-600">Earn up to $480/year just for learning. Your first investment fund starts here.</p>
              </div>
              </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">Start Building Wealth Now</p>
                    <p className="text-sm text-gray-600">Real investing. Real businesses. Real skills that put you ahead of 99% of your peers.</p>
              </div>
              </li>
                <li className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">Join Tomorrow's Leaders</p>
                    <p className="text-sm text-gray-600">Network with ambitious teens already building 6-figure businesses.</p>
              </div>
              </li>
                <li className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">Stand Out to Colleges</p>
                    <p className="text-sm text-gray-600">Portfolio-worthy achievements that make admissions officers take notice.</p>
              </div>
              </li>
            </ul>
          </motion.div>

            {/* For Parents */}
          <motion.div
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Genmoji name="proud-parent-smile" size={48} />
                <h3 className="text-xl font-bold text-gray-900">For Parents</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">Complete Visibility & Control</p>
                    <p className="text-sm text-gray-600">Monitor progress, set limits, approve investments. Peace of mind included.</p>
              </div>
                </li>
                <li className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">Elite College Differentiator</p>
                    <p className="text-sm text-gray-600">Documented entrepreneurship & investing experience that top schools value.</p>
              </div>
                </li>
                <li className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">Measurable ROI on Education</p>
                    <p className="text-sm text-gray-600">Track real portfolio growth and business revenue. Tangible results, not just grades.</p>
              </div>
                </li>
                <li className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">Curriculum You Can Trust</p>
                    <p className="text-sm text-gray-600">Research-based, parent-approved, teen-tested. No get-rich-quick schemes.</p>
              </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <RoadmapSection />

      {/* Gamification Section - NEW */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="container">
              <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
              >
            <div className="inline-flex items-center rounded-full border border-emerald-200 px-4 py-1.5 text-sm font-medium bg-emerald-50 text-emerald-700 mb-4">
              <span className="mr-2">🎮</span> Gamified Learning Experience
                </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Finally. Finance That Feels Like <span className="text-emerald-600">Leveling Up</span>
            </h2>
            <p className="text-lg text-gray-600">
              Daily streaks. Leaderboards. Real rewards. Because learning money shouldn't feel like homework.
            </p>
              </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Daily Streaks */}
          <motion.div
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">🔥</div>
                <div className="text-3xl font-bold text-orange-500">127</div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Daily Streaks</h3>
              <p className="text-sm text-gray-600 mb-4">
                Keep your streak alive! Learn every day to maintain your fire and earn bonus rewards.
              </p>
              <div className="flex gap-1">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-8 w-8 rounded ${i < 5 ? 'bg-orange-500' : 'bg-gray-200'} flex items-center justify-center text-xs font-bold text-white`}
                  >
                    {i < 5 ? '✓' : ''}
                  </div>
                ))}
              </div>
          </motion.div>

            {/* XP & Levels */}
              <motion.div 
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">⚡</div>
                <div className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  Level 23
          </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">XP & Levels</h3>
              <p className="text-sm text-gray-600 mb-4">
                Earn XP for every lesson, quiz, and achievement. Level up to unlock exclusive features!
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>2,340 XP</span>
                  <span>2,500 XP</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" style={{ width: '93.6%' }} />
                </div>
            </div>
              </motion.div>
          
            {/* Achievements */}
          <motion.div
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
          >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">🏆</div>
                <div className="text-sm font-medium text-gray-600">
                  28/50 unlocked
            </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Achievements</h3>
              <p className="text-sm text-gray-600 mb-4">
                Unlock special badges and rewards for mastering skills and reaching milestones.
            </p>
              <div className="grid grid-cols-5 gap-2">
                {['💎', '🚀', '💰', '📈', '🎯', '🌟', '🔒', '🔒', '🔒', '🔒'].map((emoji, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg ${i < 6 ? 'bg-emerald-50' : 'bg-gray-100'} flex items-center justify-center text-xl`}
                  >
                    {emoji}
              </div>
                ))}
              </div>
          </motion.div>
          </div>

          {/* Leaderboard Preview */}
              <motion.div
            className="mt-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Weekly Leaderboard 🥇</h3>
                <Link href="#" className="text-sm text-emerald-200 hover:text-white transition-colors">
                  View All →
                </Link>
          </div>
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'Alex C.', xp: '3,420', avatar: 'teen-girl-focused' },
                  { rank: 2, name: 'Sarah M.', xp: '3,180', avatar: 'teen-girl-success' },
                  { rank: 3, name: 'You', xp: '2,950', avatar: 'teen-success', highlight: true },
                ].map((player) => (
                  <div
                    key={player.rank}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      player.highlight ? 'bg-white/20' : 'bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold">#{player.rank}</div>
                      <Genmoji name={player.avatar as any} size={36} />
                      <div className="font-medium">{player.name}</div>
              </div>
                    <div className="text-sm font-medium">{player.xp} XP</div>
                  </div>
                ))}
              </div>
            </div>
              </motion.div>
        </div>
      </section>

      {/* Community Section - NEW */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-emerald-50/30 overflow-hidden">
        <div className="container">
              <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
              >
            <div className="inline-flex items-center rounded-full border border-emerald-200 px-4 py-1.5 text-sm font-medium bg-emerald-50 text-emerald-700 mb-4">
              <span className="mr-2">👥</span> Exclusive Community
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Teen's First <span className="text-emerald-600">Power Network</span>
            </h2>
            <p className="text-lg text-gray-600">
              An exclusive network of ambitious teens building businesses, trading stocks, and sharing strategies. 
              <span className="font-medium text-gray-800">Where future leaders connect today.</span>
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Trading Floor */}
          <motion.div
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">📊</div>
                  <h3 className="text-lg font-bold">Trading Floor</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-auto">LIVE</span>
            </div>
                <p className="text-sm text-gray-600 mb-4">
                  Share investment ideas, discuss market moves, and learn from teen traders making real profits.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">247 online now</span>
            </div>
                  <div className="text-xs text-gray-500">
                    Latest: "TSLA analysis by Jake M." • 2 min ago
              </div>
                </div>
            </div>
          </motion.div>
          
            {/* Startup Lab */}
          <motion.div
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">🚀</div>
                  <h3 className="text-lg font-bold">Startup Lab</h3>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full ml-auto">NEW</span>
        </div>
                <p className="text-sm text-gray-600 mb-4">
                  Find co-founders, get feedback on business ideas, and access exclusive startup resources.
                </p>
                <div className="flex -space-x-2 mb-2">
                  {[
                    { type: 'genmoji', name: 'teen-girl-success' },
                    { type: 'genmoji', name: 'cool-investor-teen' },
                    { type: 'genmoji', name: 'teen-girl-focused' },
                    { type: 'genmoji', name: 'focused-learning-face' },
                    { type: 'text', value: '+42' }
                  ].map((avatar, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium border-2 border-white overflow-hidden"
                    >
                      {avatar.type === 'text' ? (
                        avatar.value
                      ) : (
                        <Genmoji name={avatar.name as any} size={28} />
                      )}
        </div>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  46 active projects this month
                </div>
              </div>
            </motion.div>

            {/* Mentorship */}
          <motion.div
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">🎓</div>
                  <h3 className="text-lg font-bold">VIP Mentors</h3>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full ml-auto">PRO</span>
          </div>
                <p className="text-sm text-gray-600 mb-4">
                  Get 1-on-1 time with young millionaires, startup founders, and financial experts.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Genmoji name="teen-girl-success" size={32} />
                    <div className="text-sm">
                      <p className="font-medium">Sarah Chen</p>
                      <p className="text-xs text-gray-500">Founded $2M company at 19</p>
              </div>
                  </div>
                </div>
            </div>
          </motion.div>
          </div>

          {/* Community Stats */}
          <motion.div
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {[
              { stat: '1,000+', label: 'Waitlist Members' },
              { stat: '$40/mo', label: 'Teen Earning Potential' },
              { stat: '20+', label: 'Learning Modules' },
              { stat: '2025', label: 'Launch Year' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{item.stat}</div>
                <div className="text-sm text-gray-600">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Competitor Comparison Section - NEW */}
      <section className="py-16 md:py-20 lg:py-24 bg-white overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium bg-white text-gray-700 mb-4">
              Category Leader
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              We're Not a <span className="text-gray-400 line-through">Savings App</span>
              <br />
              We're a <span className="text-emerald-600">Wealth Education Platform</span>
            </h2>
            <p className="text-lg text-gray-600">
              Other apps teach saving. We teach wealth creation.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-700"></th>
                  <th className="p-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Leaf className="h-8 w-8 text-emerald-600" />
                      <span className="font-bold text-gray-900 text-lg">Banyan</span>
                      {/* <span className="text-xs text-emerald-600 font-medium">Premium</span> */}
              </div>
                  </th>
                  <th className="p-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-gray-500 text-sm">Greenlight</span>
            </div>
                  </th>
                  <th className="p-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-gray-500 text-sm">Traditional Banks</span>
              </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: 'Teens Earn Real Money',
                    banyan: { value: 'Up to $40/mo', icon: '💰' },
                    greenlight: { value: 'Chores only', icon: '😐' },
                    step: { value: 'No', icon: '❌' },
                    traditional: { value: 'No', icon: '❌' }
                  },
                  {
                    feature: 'Financial Education',
                    banyan: { value: '20+ Interactive Modules', icon: '🎓' },
                    greenlight: { value: 'Basic videos', icon: '📺' },
                    step: { value: 'Articles only', icon: '📄' },
                    traditional: { value: 'None', icon: '🚫' }
                  },
                  {
                    feature: 'Real Investing',
                    banyan: { value: 'Stocks & ETFs', icon: '📈' },
                    greenlight: { value: 'Limited', icon: '📊' },
                    step: { value: 'No', icon: '❌' },
                    traditional: { value: 'Separate account needed', icon: '🔒' }
                  },
                  {
                    feature: 'Gamification',
                    banyan: { value: 'Streaks, XP, Leaderboards', icon: '🏆' },
                    greenlight: { value: 'None', icon: '😴' },
                    step: { value: 'None', icon: '😴' },
                    traditional: { value: 'What\'s that?', icon: '🤷' }
                  },
                  {
                    feature: 'Teen Community',
                    banyan: { value: 'Exclusive Club', icon: '🔥' },
                    greenlight: { value: 'No', icon: '👎' },
                    step: { value: 'No', icon: '👎' },
                    traditional: { value: 'No', icon: '👎' }
                  },
                  {
                    feature: 'Modern Skills',
                    banyan: { value: 'Crypto, LLCs, Negotiation', icon: '🚀' },
                    greenlight: { value: 'No', icon: '🦕' },
                    step: { value: 'No', icon: '🦕' },
                    traditional: { value: 'LOL no', icon: '💀' }
                  },
                  {
                    feature: 'Monthly Cost',
                    banyan: { value: '$99.99*', icon: '✨' },
                    greenlight: { value: '$9.98+', icon: '💸' },
                    step: { value: 'Free', icon: '🤔' },
                    traditional: { value: '$5-25', icon: '💵' }
                  }
                ].map((row, i) => (
                  <motion.tr
                    key={i}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <td className="p-4 font-medium text-gray-700">{row.feature}</td>
                    <td className="p-4 text-center bg-emerald-50">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl">{row.banyan.icon}</span>
                        <span className="text-sm font-semibold text-emerald-700">{row.banyan.value}</span>
            </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xl opacity-70">{row.greenlight.icon}</span>
                        <span className="text-sm text-gray-600">{row.greenlight.value}</span>
              </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xl opacity-70">{row.traditional.icon}</span>
                        <span className="text-sm text-gray-600">{row.traditional.value}</span>
                      </div>
                    </td>
                  </motion.tr>
            ))}
              </tbody>
            </table>
            </div>

          <div className="text-center mt-8 space-y-2">
            <p className="text-sm text-gray-500">
              * Teens can earn back up to 40% through Learn to Earn program
            </p>
          </div>
        </div>
      </section>

      {/* AI-Powered Personalization Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium bg-white text-gray-700 mb-4">
              AI-Powered Personalization
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Custom-Built for <span className="text-emerald-600">Your Teen's Success</span>
            </h2>
            <p className="text-lg text-gray-600">
              Our AI learns how your teen thinks, adapts to their pace, and creates a personalized path to wealth. 
              <span className="font-medium text-gray-800">No two journeys are the same.</span>
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Personalized Path */}
            <motion.div 
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-emerald-600" />
                    </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Path Optimization</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Loves gaming? We'll teach investing through game mechanics. Into fashion? 
                  Learn business fundamentals by analyzing streetwear brands.
                </p>
                <div className="text-xs text-emerald-600 font-medium">
                  Adapts in real-time to interests & progress
                  </div>
              </div>
            </motion.div>

            {/* Learning Pace */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                   </div>
                <h3 className="font-semibold text-gray-900 mb-2">Perfect Pacing</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Speed demon or careful learner? Our AI adjusts lesson complexity and speed 
                  to keep your teen in the zone—challenged but never overwhelmed.
                </p>
                <div className="text-xs text-purple-600 font-medium">
                  86% better retention than one-size-fits-all
                  </div>
              </div>
            </motion.div>

            {/* Goal Tracking */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                    </div>
                <h3 className="font-semibold text-gray-900 mb-2">Predictive Goal Setting</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Want to start investing by 16? Launch a business by 18? Our AI creates a 
                  personalized roadmap and keeps them accountable.
                </p>
                <div className="text-xs text-orange-600 font-medium">
                  3x more likely to achieve financial goals
                  </div>
              </div>
            </motion.div>
          </div>

          {/* AI Demo Preview */}
          <motion.div
            className="mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full filter blur-3xl"></div>
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center">
                    <Cpu className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Your AI Financial Mentor</h3>
                    <p className="text-sm text-gray-300">Adapts to how your teen learns best</p>
                  </div>
                </div>
                
                {/* Banyan Score Visual */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-300">Banyan Score™</span>
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full">Live</span>
                    </div>
                    <div className="relative h-32 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-28 h-28 rounded-full border-8 border-white/20"></div>
                      </div>
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <svg className="w-28 h-28 -rotate-90">
                          <motion.circle
                            cx="56"
                            cy="56"
                            r="48"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 0.72 }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#14b8a6" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </motion.div>
                      <div className="flex flex-col items-center">
                        <motion.span
                          className="text-3xl font-bold"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 }}
                        >
                          720
                        </motion.span>
                        <span className="text-xs text-gray-400">(300-850)</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-2">
                      Gamified progress tracking that actually motivates
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Banyan Score™</span>
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Lessons adjust in real-time to keep them in flow
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Interest Mapping</span>
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Connects finance to what they already love
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Smart Reminders</span>
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        AI knows when they learn best
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
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
      <section id="testimonials" className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
        <div className="container relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium bg-white text-gray-700 mb-4">
              Early Feedback
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">From <span className="text-gray-400">Skeptics</span> to <span className="text-emerald-600">Believers</span></h2>
            <p className="text-lg text-gray-600">
              What early preview families are saying
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Teen Testimonial */}
            <TestimonialCard
              quote={<>This app actually makes learning about money fun. I've started investing and even opened my own small business. My parents are impressed with how much I've learned!</>}
              author="Jake M."
              role="Beta tester"
              avatar="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
            
            {/* Parent Testimonial */}
            <TestimonialCard
              quote={<>Finally, a financial education app my daughter actually uses! She's learning real skills while earning money. The parent controls give me peace of mind while she explores investing.</>}
              author="Maria Rodriguez"
              role="Early preview parent"
              avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d29tYW4lMjBoZWFkc2hvdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=80"
            />
            
            {/* Mixed Testimonial */}
            <TestimonialCard
              quote={<>The gamification keeps me motivated to learn every day. I love competing with friends on the leaderboard and earning rewards for completing lessons. Best financial app for teens!</>}
              author="Sophia L."
              role="Preview user"
              avatar="https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
          </div>
        </div>
      </section>

      {/* Modern Curriculum Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        <div className="container grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium bg-white text-gray-700 self-start">
              Next-Gen Curriculum
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Skills for the <span className="text-emerald-600">Real World</span>
            </h2>
            <p className="text-lg text-gray-600">
              Beyond traditional finance basics, we teach the skills that matter today—
              from launching startups to understanding crypto, from negotiating deals to building digital businesses.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span><strong>Digital Entrepreneurship:</strong> Launch online businesses that scale</span>
              </li>
              <li className="flex items-center gap-3">
                <Award className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span><strong>Business Fundamentals:</strong> LLCs, taxes, legal structures</span>
              </li>
              <li className="flex items-center gap-3">
                <Bitcoin className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span><strong>Modern Finance:</strong> Crypto, DeFi, and emerging markets</span>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span><strong>Life Skills:</strong> Negotiation, networking, personal branding</span>
              </li>
            </ul>
            <div className="flex items-center gap-4 mt-2">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">Plus:</span> Core financial literacy aligned with state requirements
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6"
          >
            {[ 
              { icon: CreditCard, label: "Credit Mastery" },
              { icon: GraduationCap, label: "College Finance" },
              { icon: MessageCircle, label: "Negotiation" },
              { icon: TrendingUp, label: "Stock Trading" },
              { icon: LineChart, label: "Online Business" },
              { icon: Globe, label: "Start an LLC" },
              { icon: DollarSign, label: "Tax Strategy" },
              { icon: Bitcoin, label: "Crypto Basics" },
              { icon: Award, label: "Startup Funding" },
            ].map((item, i) => (
              <motion.div 
                key={item.label}
                className="group relative flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 h-full hover:shadow-lg transition-all cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                <item.icon className="h-8 w-8 text-emerald-600 mb-3 relative z-10 transition-transform group-hover:scale-110" />
                <p className="text-sm font-medium text-gray-700 relative z-10">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Real Money Tools Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-white overflow-hidden">
        <div className="container grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="order-2 md:order-1"
          >
            <ParentDashboardCard />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 order-1 md:order-2"
          >
            <div className="inline-flex items-center rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium bg-white text-gray-700 self-start">
              Real Money Experience
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Real Money. Real Stakes. <span className="text-emerald-600">Real Learning.</span></h2>
            <p className="text-lg text-gray-600">
              No more monopoly money. When they're ready, they trade real stocks, spend real cash, 
              and learn real consequences—with training wheels you control.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span><strong>Progressive Access:</strong> Features unlock as skills improve</span>
              </li>
              <li className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span><strong>Parent Dashboard:</strong> Full visibility and control always</span>
              </li>
              <li className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span><strong>Real Investing:</strong> Start small, learn big</span>
              </li>
              <li className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span><strong>Enterprise Security:</strong> Bank-level protection, always secure</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-emerald-300/20 to-teal-300/20 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-tr from-purple-300/20 to-pink-300/20 rounded-full filter blur-3xl"></div>
        
        <div className="container relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div 
              className="inline-flex items-center rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium bg-white text-gray-700 mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Founding Members Only
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              An Investment in Their <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-300% animate-gradient">Future</span>
            </h2>
            <p className="text-lg text-gray-600">
              The price of one family dinner. The value of a lifetime of wealth.
            </p>
            </div>

          <motion.div 
            className="max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-xl opacity-30"></div>
              
              {/* Card */}
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Premium badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                    FOUNDERS PRICING
                  </div>
          </div>

            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Family Plan</h3>
              <div className="flex justify-center items-start my-8">
                    <span className="text-5xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">$99</span>
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">.99</span>
                <span className="text-gray-500 ml-1 mt-2">/month</span>
              </div>
                  
                  {/* Earn back highlight */}
                  <motion.div 
                    className="mb-8 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-sm font-medium text-emerald-700">
                      Your teen can earn back up to
                    </p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">
                      $40/month <Genmoji name="teen-success" size={32} className="inline-block align-middle" />
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">= Only $59.99 net cost!</p>
                  </motion.div>
                  
              <ul className="space-y-4 mb-8">
                {[
                      { text: "20+ interactive modules", icon: BookOpen },
                      { text: "Parent dashboard", icon: Shield },
                      { text: "Metal debit card + investing", icon: CreditCard },
                      { text: "Up to 3 teen accounts", icon: Users },
                      { text: "Private community", icon: Award },
                ].map((feature, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-center"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <feature.icon className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature.text}</span>
                      </motion.li>
                ))}
              </ul>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-full shadow-lg" 
                    size="lg" 
                    onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <span className="flex items-center justify-center gap-2">
                Join the Waitlist
                      <ArrowRight className="h-4 w-4" />
                    </span>
              </Button>
                  <p className="text-sm text-gray-500 mt-4">Cancel anytime • No hidden fees</p>
            </div>
          </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA / Waitlist Form Section */}
      <section id="waitlist-form" className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full filter blur-3xl opacity-20"></div>
        <div className="container text-center relative">
          <div className="inline-flex items-center rounded-full border border-white/30 px-4 py-1.5 text-sm font-medium bg-white/20 backdrop-blur text-white mb-4">
            <CalendarDays className="h-4 w-4 mr-2" />
            Early Access Opening Soon
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 max-w-2xl mx-auto">
            Be Part of Something <span className="text-emerald-300">Bigger</span>
          </h2>
          <p className="text-xl mb-2 max-w-2xl mx-auto opacity-90">
            We're not just building an app. 
            <span className="font-bold"> We're building the future of financial education.</span>
          </p>
          <p className="text-lg mb-8 max-w-xl mx-auto opacity-80">
            Join forward-thinking families who believe their teens deserve better.
          </p>
          
          {/* Replace placeholder form with the WaitlistForm component */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto mt-8"
          >
            <WaitlistForm /> 
          </motion.div>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Free to join waitlist</span>
        </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Bonus month for early joiners</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Be first when we launch</span>
            </div>
          </div>

          {/* Social Proof */}
          <motion.div
            className="mt-12 flex items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-300">20+</div>
              <div className="text-sm opacity-80">Learning modules</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-300">100%</div>
              <div className="text-sm opacity-80">Secure platform</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-300">
                2025
              </div>
              <div className="text-sm opacity-80">Launch year</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 md:py-8 bg-gray-900 text-gray-300">
        <div className="container">
          {/* Commented out navigation sections until pages are created
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Press Kit
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    How It Works
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
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
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
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-emerald-500" />
              <span className="font-bold text-white">Banyan</span>
            </div>
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} Banyan Financial Education. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Scary Page Link - Bottom Right */}
      <a
        href="/reality-check"
        className="fixed bottom-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 group"
      >
        <span className="text-sm font-semibold">Reality Check</span>
        <svg
          className="w-4 h-4 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </a>
    </main>
  )
}