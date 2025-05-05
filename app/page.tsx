"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Leaf, BookOpen, TrendingUp, Shield, XCircle, AlertTriangle, MinusCircle, GraduationCap, Gamepad2, Lock, Cpu, Users, BookCopy, MessageCircle, BarChart3, Globe, Bitcoin, Settings, Award, LifeBuoy, ScrollText, HeartHandshake, PiggyBank, CircleDollarSign, LineChart, Code, CalendarDays, DollarSign, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import TestimonialCard from "@/components/testimonial-card"
import CurriculumAccordion from "@/components/curriculum-accordion"
import FeatureCard from "@/components/feature-card"
import HeroAnimation from "@/components/hero-animation"
import MobileMenu from "@/components/mobile-menu"
import ModuleCard from "@/components/module-card"
import { motion } from "framer-motion"

export default function Home() {
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
          <nav className="hidden md:flex items-center gap-6">
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
          </nav>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            {/* <Link
              href="/login"
              className="text-sm font-medium hover:text-emerald-600 transition-colors hidden md:block"
            >
              Log in
            </Link> */}
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

        <div className="container grid gap-8 md:grid-cols-2 items-center relative">
          <div className="flex flex-col gap-6 max-w-lg">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 animate-gradient-x">
                Grow
              </span>{" "}
              your child's financial future
            </h1>
            <p className="text-lg text-gray-600">
              Empower your teen with practical financial skills for today's world. Banyan uses interactive lessons on modern topics to unlock access to a real spending card and investing platform—all under your control.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 rounded-full" onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}> 
                Join the Waitlist
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
                Parent-controlled
              </div>
            </div>
          </div>
          <div className="relative h-[350px] sm:h-[400px] md:h-[500px]">
            <HeroAnimation />
          </div>
        </div>
      </section>

      {/* Trusted By Section -> Curriculum Alignment Section */}
      <section className="py-12 md:py-16 border-y bg-gray-50/50 backdrop-blur-sm">
        <div className="container">
          <h2 className="text-center text-lg font-medium text-gray-600 mb-10">
            Curriculum Aligned with Global Financial Literacy Frameworks & Leading Research
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 md:gap-x-16 lg:gap-x-20">
            {[ 
              { src: "/alpha.png", alt: "Alpha Org Logo", height: 40 }, 
              { src: "/stanford.png", alt: "Stanford University Logo", height: 45 },
              { src: "/texas.png", alt: "University of Texas Logo", height: 50 },
              // Add more logos here as needed, e.g.:
              // { src: "/ngpf_logo.png", alt: "NGPF Logo", height: 30 },
              // { src: "/jumpstart_logo.png", alt: "Jump$tart Logo", height: 40 },
            ].map((logo, i) => (
              <div key={i} className="relative opacity-60 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0">
                <Image 
                  src={logo.src} 
                  alt={logo.alt} 
                  height={logo.height}
                  width={0} // Width is auto based on height 
                  style={{ width: 'auto', height: `${logo.height}px` }}
                  unoptimized // If using static export or specific image config
                />
              </div>
            ))}
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
            <h2 className="text-3xl md:text-4xl font-bold">Master Real-World Finance, Then Practice Safely</h2>
            <p className="text-lg text-gray-600">
              Banyan teaches practical, relevant skills like interpreting market news, understanding online income streams (e.g., social media), and startup fundamentals. Mastery unlocks the Banyan Card & investing platform for hands-on experience, guided by learned principles.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>Navigate modern topics: fintech, basic crypto concepts, personal branding online.</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>Earn access to real financial tools through demonstrated knowledge.</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>Build confidence by applying learned strategies in a controlled environment.</span>
              </li>
            </ul>
            <Button size="lg" variant="outline" className="rounded-full self-start mt-4" asChild>
              <Link href="#curriculum">Explore the Curriculum</Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6"
          >
            {[ 
              // Foundational
              { icon: PiggyBank, label: "Budgeting Basics" },
              { icon: CircleDollarSign, label: "Saving Strategies" },
              { icon: LineChart, label: "Investing Fundamentals" },
              // Modern / Practical
              { icon: MessageCircle, label: "News Literacy" },
              { icon: Globe, label: "Startup Fundamentals" },
              { icon: Bitcoin, label: "Fintech & Crypto Basics" },              
              // Extras
              { icon: Users, label: "Online Income Streams" },
              { icon: Settings, label: "Personal Branding" },
              { icon: BarChart3, label: "Market Analysis" },
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
            className="relative h-80 md:h-96 bg-emerald-800/50 rounded-xl flex items-center justify-center order-last md:order-first"
          >
            <p className="text-emerald-300/70 italic">[Placeholder: Image/Animation showing adaptive path or Credit Score dashboard]</p>
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
            <h2 className="text-3xl md:text-4xl font-bold">Intelligent Guidance That Adapts & Motivates</h2>
            <p className="text-lg text-emerald-200">
              An initial diagnostic tailors the curriculum to your teen's level. Our AI identifies knowledge gaps, adapts lesson difficulty, and uses spaced repetition to ensure retention. The unique Credit Score Counter gamifies progress!
            </p>
            <ul className="space-y-3 text-emerald-100">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span>Personalized skill tree avoids repeating already known concepts.</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span>AI-driven feedback and adaptive difficulty keeps learning efficient.</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span>Gamified Credit Score (300-850) tracks mastery and unlocks rewards.</span>
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
            <h2 className="text-3xl md:text-4xl font-bold">Real Practice, Real Safety Nets</h2>
            <p className="text-lg text-gray-600">
              The Banyan Card and investing platform are unlocked progressively as modules are mastered. Parents deposit funds upfront and set release schedules tied to learning milestones, ensuring teens practice with real money only after proving their understanding.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>Fund access is gated by learning progress and module completion.</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>Set flexible spending/investing limits, category restrictions, and alerts.</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>Gain peace of mind with full oversight via the parent dashboard.</span>
              </li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="relative h-80 md:h-96 bg-gray-200 rounded-xl flex items-center justify-center"
          >
            <p className="text-gray-500 italic">[Placeholder: Image/Animation showing parent dashboard / control features]</p>
          </motion.div>
        </div>
      </section>

      {/* --- NEW SECTION 4: Comparison Table --- */}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Smarter Way to Build Financial Futures</h2>
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
                  feature: "Learn-to-Unlock Real Tools",
                  banyan: 'yes',
                  traditional: 'na',
                  allowance: 'no',
                  investing: 'no',
                },
                {
                  icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /> </svg>,
                  feature: "Real Spending Card",
                  banyan: 'yes',
                  traditional: 'no',
                  allowance: 'yes',
                  investing: 'limited',
                },
                {
                  icon: <TrendingUp size={18} className="text-gray-500 mr-2" />, 
                  feature: "Real Investing Platform",
                  banyan: 'yes',
                  traditional: 'no',
                  allowance: 'limited',
                  investing: 'yes',
                },
                {
                  icon: <Shield size={18} className="text-gray-500 mr-2" />, 
                  feature: "Granular Parental Controls",
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
                  feature: "Engaging Gamification (Credit Score)",
                  banyan: 'yes',
                  traditional: 'no',
                  allowance: 'limited',
                  investing: 'no',
                },
                {
                  icon: <Code size={18} className="text-gray-500 mr-2" />, 
                  feature: "Tier 1 Engineering Team",
                  banyan: 'yes',
                  traditional: 'na',
                  allowance: 'limited',
                  investing: 'limited',
                },
                {
                  icon: <DollarSign size={18} className="text-gray-500 mr-2" />, 
                  feature: "Tier 1 Investors",
                  banyan: 'yes',
                  traditional: 'na',
                  allowance: 'limited',
                  investing: 'limited',
                },
                {
                  icon: <Zap size={18} className="text-gray-500 mr-2" />, 
                  feature: "AI-First Development",
                  banyan: 'yes',
                  traditional: 'no',
                  allowance: 'limited',
                  investing: 'limited',
                },
                {
                  icon: <HeartHandshake size={18} className="text-gray-500 mr-2" />, 
                  feature: "Focus on Long-Term Financial Health",
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

      {/* --- NEW SECTION 5: Skill Tree Visualization --- */}
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
              Structured Learning Path
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Follow a Clear Path to Financial Mastery</h2>
            <p className="text-lg text-gray-600">
              Our 20-module curriculum is structured like a skill tree, guiding teens from foundational concepts to advanced topics progressively. See the journey ahead!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-[400px] md:h-[500px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-200"
          >
            <p className="text-gray-400 italic text-center">[Placeholder: Interactive Skill Tree Graphic]<br/>Nodes for modules, lines showing prerequisites, tool icons unlocked at milestones.</p>
          </motion.div>
        </div>
      </section>

      {/* --- NEW SECTION 6: Credit Score / XP Gauge --- */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-emerald-50/50 to-white overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center rounded-full border border-emerald-200 px-4 py-1.5 text-sm font-medium bg-emerald-50 text-emerald-700 mb-4">
              Gamified Progress Tracking
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Level Up Your Financial Knowledge!</h2>
            <p className="text-lg text-gray-600">
              Our unique Banyan Score (300-850) works like an XP system, rewarding accuracy, consistency, and module completion. Track progress, earn badges, and unlock rewards!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative max-w-lg mx-auto h-64 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-8 border border-gray-100"
          >
            <p className="text-5xl md:text-6xl font-bold text-emerald-600 mb-4">720</p>
            <p className="text-xl font-semibold text-gray-700 mb-2">Banyan Score (Proficient)</p>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full w-[70%]"></div> {/* Example: 720 is roughly 70% of 300-850 range */}
            </div>
            <p className="text-sm text-gray-500 mt-4">Score increases with completed lessons and daily streaks.</p>
            {/* Placeholder for gauge/animation */}
          </motion.div>
        </div>
      </section>

      {/* --- NEW SECTION 7: Funding Mechanism Flow --- */}
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
              Learn, Earn, Practice
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Connecting Knowledge to Real-World Action</h2>
            <p className="text-lg text-gray-600">
              See how learning directly translates into safe, practical experience with real money, all under parental supervision.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative max-w-4xl mx-auto h-[250px] md:h-[300px] flex items-center justify-around p-4"
          >
            {/* Placeholder for Flow Diagram/Animation */}
            <div className="text-center flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-2"><Users size={24} className="text-blue-600"/></div>
              <p className="font-semibold">1. Parents Add Funds</p>
              <p className="text-xs text-gray-500">Set deposit amount</p>
            </div>
            <div className="text-gray-300"><ArrowRight size={32}/></div>
            <div className="text-center flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center mb-2"><BookOpen size={24} className="text-yellow-600"/></div>
              <p className="font-semibold">2. Teens Learn & Master</p>
              <p className="text-xs text-gray-500">Complete modules</p>
            </div>
            <div className="text-gray-300"><ArrowRight size={32}/></div>
            <div className="text-center flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /> </svg>
              </div>
              <p className="font-semibold">3. Unlock Card/Invest</p>
              <p className="text-xs text-gray-500">Funds released</p>
            </div>
             <div className="text-gray-300"><ArrowRight size={32}/></div>
            <div className="text-center flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-2"><TrendingUp size={24} className="text-purple-600"/></div>
              <p className="font-semibold">4. Practice Safely</p>
              <p className="text-xs text-gray-500">Parental oversight</p>
            </div>
             {/* Dashed connecting lines could be added absolutely positioned behind */}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-300/20 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="container relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="inline-flex items-center rounded-full border border-emerald-200 px-4 py-1.5 text-sm font-medium bg-emerald-50 text-emerald-700 mb-4">
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Financial education that grows with your child</h2>
            <p className="text-lg text-gray-600">
              Banyan combines interactive learning with real-world financial experience, all under your supervision.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <BookOpen className="h-8 w-8 text-emerald-600" />,
                title: "Practical, Modern Curriculum",
                description: "Go beyond basics. Learn to interpret financial news, understand startups, navigate modern finance, and more."
              },
              {
                icon: <TrendingUp className="h-8 w-8 text-emerald-600" />,
                title: "Real-World Finance Tools",
                description: "Unlock a real spending card and investing platform by completing learning modules. Apply knowledge safely."
              },
              {
                icon: <Shield className="h-8 w-8 text-emerald-600" />,
                title: "Safe Parental Oversight",
                description: "You approve funds, set spending/investing limits, and monitor all activity on the real card and platform."
              },
              {
                icon: <Leaf className="h-8 w-8 text-emerald-600" />,
                title: "Track Financial Growth",
                description: "Monitor your child's learning progress and watch their financial confidence and portfolio grow."
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> </svg>,
                title: "Engaging & Fun Learning",
                description: "Gamified challenges, quizzes, and rewards keep students motivated to build crucial financial skills."
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> </svg>,
                title: "Prepare for Independence",
                description: "Build the financial confidence and knowledge needed for college, careers, and lifelong success."
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-emerald-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
        <div className="container relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="inline-flex items-center rounded-full border border-emerald-200 px-4 py-1.5 text-sm font-medium bg-emerald-50 text-emerald-700 mb-4">
              How it works
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Banyan works</h2>
            <p className="text-lg text-gray-600">A simple process that builds financial literacy and responsibility</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            {[
              {
                step: 1,
                title: "Parents deposit funds",
                description: "You control how much money to add to your child's account."
              },
              {
                step: 2,
                title: "Students complete modules",
                description: "Interactive lessons teach essential financial concepts."
              },
              {
                step: 3,
                title: "Unlock Real Financial Tools",
                description: "Completing modules grants access to the Banyan card and investing platform, reinforcing lessons."
              }
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20, rotateX: 45 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                whileHover={{ 
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                viewport={{ once: true }}
                transition={{ 
                  delay: i * 0.2,
                  duration: 0.5
                }}
                className="glass rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all transform perspective-1000"
              >
                <motion.div 
                  className="bg-gradient-to-br from-emerald-400 to-emerald-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6 relative"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-white font-bold text-xl">{item.step}</span>
                  <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                </motion.div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-1 w-full bg-gradient-to-r from-emerald-300 to-emerald-500 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="curriculum" className="py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="container relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center rounded-full border border-emerald-200 px-4 py-1.5 text-sm font-medium bg-emerald-50 text-emerald-700 mb-4">
              Curriculum
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive financial curriculum</h2>
            <p className="text-lg text-gray-600">
              Our 20-module curriculum covers everything your child needs for financial success, focusing on practical skills for the modern world like interpreting news and understanding entrepreneurship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <ModuleCard
              number="01"
              title="Foundations of Money"
              description="Income, functions of money, needs vs. wants, and opportunity cost."
              progress={85}
            />
            <ModuleCard
              number="02"
              title="Financial Psychology"
              description="Emotional influences, SMART goals, habit formation, and debiasing techniques."
              progress={65}
            />
            <ModuleCard
              number="03"
              title="Payment Methods"
              description="Cash, checks, debit/credit, mobile wallets, P2P apps, and digital banking security."
              progress={40}
            />
          </div>

          <div className="max-w-3xl mx-auto">
            <CurriculumAccordion />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
        <div className="container relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center rounded-full border border-emerald-200 px-4 py-1.5 text-sm font-medium bg-emerald-50 text-emerald-700 mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What parents are saying</h2>
            <p className="text-lg text-gray-600">
              Join thousands of parents who've helped their children build financial confidence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <TestimonialCard
              quote="My daughter learned more about investing in three months with Banyan than I learned in my entire life."
              author="Jennifer K."
              role="Parent of 11th grader"
              avatar="/placeholder.svg?height=40&width=40"
            />
            <TestimonialCard
              quote="I love that I can deposit funds but still control what my son can access. It's the perfect balance of freedom and supervision."
              author="Michael T."
              role="Parent of 10th grader"
              avatar="/placeholder.svg?height=40&width=40"
            />
            <TestimonialCard
              quote="The curriculum is impressive. My child is actually excited about learning financial concepts and has started saving money."
              author="Sarah L."
              role="Parent of 9th grader"
              avatar="/placeholder.svg?height=40&width=40"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-300/20 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="container relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center rounded-full border border-emerald-200 px-4 py-1.5 text-sm font-medium bg-emerald-50 text-emerald-700 mb-4">
              Pricing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-gray-600">Invest in your child's financial future</p>
          </div>

          <div className="max-w-md mx-auto glass rounded-2xl shadow-md overflow-hidden border border-white/20">
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Family Plan</h3>
              <div className="flex justify-center items-baseline my-8">
                <span className="text-5xl font-extrabold">$9.99</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Full access to all 20 curriculum modules",
                  "Parent dashboard with progress tracking",
                  "Real investing experience with parental controls",
                  "Up to 3 child accounts included",
                  "Cancel anytime",
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
            Ready to Empower Your Teen?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join the Banyan waitlist for early access and updates.</p>
          
          {/* Simple Waitlist Form Placeholder */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto mt-8"
          >
            <form className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-grow px-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button size="lg" type="submit" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100 rounded-full">
                Join Waitlist
              </Button>
            </form>
            <p className="text-sm mt-4 text-white/70">We'll notify you as soon as Banyan is ready!</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 bg-gray-900 text-gray-300">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
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
