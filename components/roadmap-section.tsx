import { motion } from "framer-motion";
import { Check, Clock, ArrowRight, CreditCard, PiggyBank, TrendingUp } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";

// Interface for milestone data
interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "completed" | "current" | "upcoming";
  icon: React.ReactNode;
}

export default function RoadmapSection() {
  // Ref for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // State to track scroll position for showing/hiding indicators
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);

  // Monitor scroll position to update gradients
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      
      // Show left gradient when scrolled right
      setShowLeftGradient(scrollLeft > 20);
      
      // Hide right gradient when near the end
      setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 20);
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
      
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Milestone data with mock dates and details
  const milestones: Milestone[] = [
    {
      id: "curriculum",
      title: "Financial Literacy Curriculum",
      description: "Interactive lessons covering essential financial concepts for teens",
      date: "Q1 2023",
      status: "completed",
      icon: <Clock className="h-5 w-5 text-emerald-600" />,
    },
    {
      id: "platform",
      title: "Financial Literacy Platform",
      description: "Comprehensive learning platform with progress tracking and rewards",
      date: "Current",
      status: "current",
      icon: <Check className="h-5 w-5 text-emerald-600" />,
    },
    {
      id: "debit-card",
      title: "Debit Card Integration",
      description: "Secure spending card with parental controls and spending insights",
      date: "Q3 2024",
      status: "upcoming",
      icon: <CreditCard className="h-5 w-5 text-emerald-600" />,
    },
    {
      id: "savings",
      title: "Savings Account",
      description: "Goal-based savings with interest and parental matching options",
      date: "Q1 2025",
      status: "upcoming",
      icon: <PiggyBank className="h-5 w-5 text-emerald-600" />,
    },
    {
      id: "investing",
      title: "Teen Investing Account (UTMA/UGMA)",
      description: "Custodial investing accounts with educational content and guided investing",
      date: "Q3 2025",
      status: "upcoming",
      icon: <TrendingUp className="h-5 w-5 text-emerald-600" />,
    },
  ];

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="roadmap" className="py-16 md:py-20 lg:py-20 bg-gradient-to-b from-white to-emerald-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-300/20 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="container relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center rounded-full border border-emerald-200 px-4 py-1.5 text-sm font-medium bg-emerald-50 text-emerald-700 mb-4">
            Our Journey
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Roadmap to Financial Freedom 🚀</h2>
          <p className="text-lg text-gray-600">
            Our vision for helping students build lifelong financial skills and independence
          </p>
        </div>

        {/* Horizontal Timeline - Scrollable Carousel */}
        <div className="relative mt-10 mb-12">
          {/* Horizontal line - set z-10 to always be above cards */}
          <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 z-20 pointer-events-none"></div>
          
          {/* Scrollable container - ensure min-w-0 and overflow-x-auto */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto overflow-y-visible pb-10 pt-2 scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent min-w-0"
          >
            <div className="flex flex-nowrap px-4">
              {milestones.map((milestone, index) => (
                <motion.div 
                  key={milestone.id}
                  className="flex-shrink-0 w-80 mx-4 first:ml-0 mb-4"
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex flex-col items-center">
                    {/* Timeline connector and dot */}
                    <motion.div
                      className={`h-12 w-12 rounded-full flex items-center justify-center z-10 mb-6 ${
                        milestone.status === "completed"
                          ? "bg-emerald-100 border-2 border-emerald-600"
                          : milestone.status === "current"
                          ? "bg-emerald-600"
                          : "bg-gray-100 border-2 border-dashed border-gray-400"
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {milestone.status === "completed" ? (
                        <Check className="h-6 w-6 text-emerald-600" />
                      ) : milestone.status === "current" ? (
                        <Clock className="h-6 w-6 text-white" />
                      ) : (
                        <ArrowRight className="h-6 w-6 text-gray-400" />
                      )}
                    </motion.div>

                    {/* Content box */}
                    <div
                      className="w-full"
                    >
                      <div
                        className={`group h-full rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg border ${
                          milestone.status === "completed"
                            ? "border-emerald-200"
                            : milestone.status === "current"
                            ? "border-emerald-500"
                            : "border-gray-200"
                        }`}
                        style={{ pointerEvents: 'auto', zIndex: 10 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-blue-50 opacity-0 transition-opacity group-hover:opacity-0 rounded-xl pointer-events-none" />
                        
                        <div className="relative z-10">
                          <div
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium mb-3 ${
                              milestone.status === "completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : milestone.status === "current"
                                ? "bg-emerald-600 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {milestone.date}
                          </div>
                          <h3 className="text-xl font-bold mb-3">{milestone.title}</h3>
                          <p className="text-gray-600">{milestone.description}</p>
                        </div>
                        
                        <div
                          className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full ${
                            milestone.status === "completed"
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-300"
                              : milestone.status === "current"
                              ? "bg-gradient-to-r from-emerald-600 to-emerald-400"
                              : "bg-gradient-to-r from-gray-400 to-gray-300"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Gradient overlays for smooth fade effect - with responsive state */}
          {showLeftGradient && (
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-emerald-50 to-transparent pointer-events-none z-10"></div>
          )}
          {showRightGradient && (
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-emerald-50 to-transparent pointer-events-none z-10"></div>
          )}
        </div>

        {/* Mobile Timeline (Vertical) */}
        <div className="block md:hidden mt-8">
          <motion.div
            className="relative max-w-sm mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Vertical line - visible only on mobile */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400 to-emerald-600"></div>

            {/* Timeline items */}
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                className="relative mb-8 last:mb-0 flex flex-col pl-14"
                variants={itemVariants}
              >
                {/* Timeline connector and dot - mobile version */}
                <div className="absolute left-4 top-7 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <motion.div
                    className={`h-10 w-10 rounded-full flex items-center justify-center z-10 ${
                      milestone.status === "completed"
                        ? "bg-emerald-100 border-2 border-emerald-600"
                        : milestone.status === "current"
                        ? "bg-emerald-600"
                        : "bg-gray-100 border-2 border-dashed border-gray-400"
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {milestone.status === "completed" ? (
                      <Check className="h-5 w-5 text-emerald-600" />
                    ) : milestone.status === "current" ? (
                      <Clock className="h-5 w-5 text-white" />
                    ) : (
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    )}
                  </motion.div>
                </div>

                {/* Content box */}
                <motion.div
                  className="w-full"
                  whileHover={{ y: -5 }}
                >
                  <div
                    className={`group rounded-xl bg-white p-5 shadow-md transition-shadow hover:shadow-lg border ${
                      milestone.status === "completed"
                        ? "border-emerald-200"
                        : milestone.status === "current"
                        ? "border-emerald-500"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-blue-50 opacity-0 transition-opacity group-hover:opacity-100 rounded-xl" />
                    
                    <div className="relative z-10">
                      <div
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium mb-2 ${
                          milestone.status === "completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : milestone.status === "current"
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {milestone.date}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-emerald-100">{milestone.icon}</div>
                        <h3 className="text-base font-bold">{milestone.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                    
                    <div
                      className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full ${
                        milestone.status === "completed"
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-300"
                          : milestone.status === "current"
                          ? "bg-gradient-to-r from-emerald-600 to-emerald-400"
                          : "bg-gradient-to-r from-gray-400 to-gray-300"
                      }`}
                    />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}