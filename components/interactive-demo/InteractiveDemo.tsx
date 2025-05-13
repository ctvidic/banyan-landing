import React, { useState } from 'react';
import LessonSlide from './LessonSlide'; // Import the LessonSlide component
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion components

// Define the slide data structure
interface SlideData {
  id: number;
  title: string;
  content: string; // For now, content is a string. We can make it React.ReactNode later for more complex content.
  imageSrc?: string;
}

// Array of slide data based on your provided content
const lessonSlidesData: SlideData[] = [
  {
    id: 1,
    title: "How Do You Pay?",
    content: "Payment methods (cash, cards, digital) buy things like lattes or sneakers. Cash is physical, good for small buys. Widely accepted, but lost cash is gone + no spending record. 80% of teens use cash for quick buys, but digital is rising. Your $3 soda choice?",
    imageSrc: "/wallet.png"
  },
  {
    id: 2,
    title: "Checks and Debit Cards",
    content: "Checks: Secure for big payments (rent, fees). Bank-verified but slow (2-5 days to clear) & not all stores accept. Debit Cards: Pull money from your bank account for daily buys (e.g., Target). Risk overdraft fees ($30+!) if you overspend. Teens average $2,600/year on debit. Always check your balance!",
    imageSrc: "/check.png"
  },
  {
    id: 3,
    title: "Credit Cards—Borrow with Care",
    content: "Credit cards: Borrow for purchases (e.g., gaming subscription). Great for online due to fraud protection & rewards (cashback/points). Unpaid balances mean high interest (15-25% yearly!). A $50 item could cost $60+. 20% of teens access a parent\'s card. Pro tip: Pay full balance monthly. Tempted to splurge?",
    imageSrc: "/card.png"
  },
  {
    id: 4,
    title: "Digital Wallets Are the Future",
    content: "Digital Wallets (Apple/Google Pay): Pay with your phone—fast & contactless. Secure (face/fingerprint ID), but need charged phone & Wi-Fi. >50% of teens use them for food delivery/apps. Phone dead? You\'re stuck. Pro tip: Link a debit card to avoid credit debt. Ready to tap & pay?",
    imageSrc: "/debitcard.png" // Placeholder, adjust as needed
  }
];

export default function InteractiveDemo() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  // swipeDirection: 1 for next (swiped up), -1 for prev (swiped down)
  const [swipeDirection, setSwipeDirection] = useState(1); // Initialize with a direction for the first load if desired, or 0

  const changeSlide = (direction: number) => {
    const newIndex = currentSlideIndex + direction;
    if (newIndex >= 0 && newIndex < lessonSlidesData.length) {
      setSwipeDirection(direction);
      setCurrentSlideIndex(newIndex);
    }
  };

  const handlers = useSwipeable({
    onSwipedUp: () => changeSlide(1),    // Next
    onSwipedDown: () => changeSlide(-1), // Previous
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  const activeSlide = lessonSlidesData[currentSlideIndex];

  const slideVariants = {
    initial: (direction: number) => ({
      y: direction > 0 ? "100%" : "-100%",
      opacity: 0.8, // Start slightly visible for a smoother perceived entry
      scale: 0.98, // Slightly smaller to give a depth effect
    }),
    animate: {
      y: "0%",
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 30,
      }
    },
    exit: (direction: number) => ({
      y: direction > 0 ? "-100%" : "100%",
      opacity: 0.8,
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 30,
      }
    })
  };

  return (
    <div className="w-full flex justify-center md:items-center">
      {/* On mobile, screen-content takes full width/height. On desktop, it's wrapped by the phone mockup. */}
      
      {/* iPhone Mockup Container - Visible on medium screens and up (md:) */}
      {/* Adapted from hero-animation.tsx for visual consistency */}
      <div className="hidden md:flex md:relative md:w-[300px] md:h-[600px] md:bg-gray-900 md:rounded-[3rem] md:shadow-2xl md:border-[12px] md:border-gray-900 overflow-hidden">
        {/* Top notch/speaker area - for desktop mockup */}
        <div className="absolute top-0 left-0 right-0 h-7 bg-gray-900 flex justify-center items-center z-10">
          <div className="h-2 w-20 bg-gray-800 rounded-full"></div>
        </div>

        {/* Screen Content Area - takes full viewport on mobile, fits in mockup on desktop */}
        {/* Padding top on desktop to account for the notch */}
        <div {...handlers} className="w-full h-full bg-white flex flex-col items-stretch justify-between pt-7 relative">
          <AnimatePresence initial={false} custom={swipeDirection}>
            <motion.div
              key={currentSlideIndex} 
              custom={swipeDirection}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full absolute top-0 left-0 pt-7 flex flex-col" // Added flex flex-col
            >
              <div className="flex-grow overflow-y-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none]">
                <LessonSlide title={activeSlide.title} content={activeSlide.content} imageSrc={activeSlide.imageSrc} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Screen Content Area for Mobile - Visible only on screens smaller than md */}
      <div {...handlers} className="w-full h-screen bg-white flex flex-col items-stretch justify-between md:hidden relative overflow-hidden">
         {/* Apply swipe handlers to the mobile view as well */}
         {/* Added scrollbar-hide utilities here */}
        <AnimatePresence initial={false} custom={swipeDirection}>
            <motion.div
              key={currentSlideIndex} 
              custom={swipeDirection}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full absolute top-0 left-0 flex flex-col" // Added flex flex-col
            >
              <div className="flex-grow overflow-y-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] p-4">
                  <LessonSlide title={activeSlide.title} content={activeSlide.content} imageSrc={activeSlide.imageSrc} />
              </div>
            </motion.div>
          </AnimatePresence>
      </div>
    </div>
  );
} 