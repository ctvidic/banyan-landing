"use client"

import Link from "next/link"
import { Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import MobileMenu from "@/components/mobile-menu"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface HeaderProps {
  showJoinWaitlist?: boolean;
  theme?: 'light' | 'dark';
}

export default function Header({ showJoinWaitlist = true, theme = 'light' }: HeaderProps) {
  const isDark = theme === 'dark';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = ["Features", "Testimonials", "Pricing"];

  return (
    <header className={`sticky top-0 z-50 w-full backdrop-blur-xl border-b ${
      isDark 
        ? 'bg-gray-900/70 border-gray-800/20 supports-[backdrop-filter]:bg-gray-900/30' 
        : 'bg-white/70 border-gray-100/20 supports-[backdrop-filter]:bg-white/30'
    }`}>
      <div className="container flex h-20 items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <Leaf className={`h-8 w-8 ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`} />
            <span className={`text-2xl md:text-3xl font-display font-bold bg-clip-text text-transparent ${
              isDark 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
            }`}>
              Banyan
            </span>
          </Link>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-medium hover:text-emerald-600 transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all group-hover:w-full" />
              </Link>
            ))}
            <Link
              href="/bill-negotiator"
              className="text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-2"
            >
              <span>Bill Negotiator</span>
              <span className="text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">TRY</span>
            </Link>
          </nav>
          {showJoinWaitlist && (
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 rounded-full" 
              onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Join Waitlist
            </Button>
          )}
          <MobileMenu />
        </motion.div>
      </div>
    </header>
  );
} 