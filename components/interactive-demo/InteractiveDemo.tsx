'use client';

import React, { useState, useEffect } from 'react';
import LessonSlide from './LessonSlide'; // Import the LessonSlide component
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion components
import QuizQuestionSlide from './QuizQuestionSlide';
import type { QuizScreenForSlide } from './QuizQuestionSlide'; // Import the specific type for the prop
import EmailForm from './EmailForm'; // Import EmailForm

// Define the slide data structure
interface SlideData {
  id: number | string; // Allow string for generated IDs
  title: string;
  content: string; // For now, content is a string. We can make it React.ReactNode later for more complex content.
  imageSrc?: string;
}

export interface QuizQuestion {
  id: number | string; // Allow string for generated IDs
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  imageSrc?: string; // Optional image for quiz questions
  // Removed userAnswerIndex and isCorrect from base, will be in QuizScreen state
}

interface LessonScreen {
  id: string; // Unique ID for React key
  type: 'lesson';
  data: SlideData;
}

// Use QuizScreenForSlide for the quiz screen structure
interface QuizScreen extends QuizScreenForSlide { 
  // Inherits id, type, data, isAnswered, userAnswerIndex from QuizScreenForSlide
}

interface EmailFormScreen { // New screen type
  id: string;
  type: 'emailForm';
  title: string;
  // any other data needed for the email form screen
}

type Screen = LessonScreen | QuizScreen | EmailFormScreen;

const lessonSlidesSeedData: SlideData[] = [
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
    imageSrc: "/debitcard.png"
  }
];

const allQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    questionText: "Which payment method is best for small, in-person buys but offers no spending record if lost?",
    options: ["Credit Card", "Debit Card", "Cash", "Digital Wallet"],
    correctAnswerIndex: 2
  },
  {
    id: 'q2',
    questionText: "What is a potential risk of using a debit card?",
    options: ["High interest rates", "Overdraft fees if you spend more than your balance", "Takes 2-5 days to clear", "Only good for online shopping"],
    correctAnswerIndex: 1
  },
  {
    id: 'q3',
    questionText: "A key benefit of credit cards for online shopping is:",
    options: ["Direct bank withdrawal", "Contactless payment", "Fraud protection", "No interest ever"],
    correctAnswerIndex: 2
  },
  {
    id: 'q4',
    questionText: "Digital wallets like Apple Pay require:",
    options: ["A physical card", "A signed check", "A charged phone & Wi-Fi/data", "Knowing your bank account number"],
    correctAnswerIndex: 2
  },
  {
    id: 'q5',
    questionText: "To avoid interest on a credit card, you should:",
    options: ["Pay the minimum balance", "Pay the full balance monthly", "Only use it for emergencies", "Get a card with a low APR"],
    correctAnswerIndex: 1
  }
];

// Utility to shuffle array and pick N items
function getRandomQuizQuestions(questions: QuizQuestion[], count: number): QuizQuestion[] {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function InteractiveDemo() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(1);

  useEffect(() => {
    const lessonScreens: LessonScreen[] = lessonSlidesSeedData.map((slide, index) => ({
      id: `lesson-${slide.id}`,
      type: 'lesson',
      data: slide
    }));

    const selectedQuizQs: QuizQuestion[] = getRandomQuizQuestions(allQuizQuestions, 2);
    const quizScreens: QuizScreen[] = selectedQuizQs.map((quizQ, index) => ({
      id: `quiz-${quizQ.id}`,
      type: 'quiz',
      data: quizQ,
      isAnswered: false,
      userAnswerIndex: undefined // Ensure it's undefined initially
    }));

    const emailFormScreen: EmailFormScreen = {
      id: 'email-form',
      type: 'emailForm',
      title: 'Want to see how you did?'
    };

    setScreens([...lessonScreens, ...quizScreens, emailFormScreen]);
  }, []);

  const handleAnswerQuizQuestion = (questionId: string, answerIndex: number) => {
    setScreens(prevScreens =>
      prevScreens.map(screen => {
        if (screen.id === questionId && screen.type === 'quiz') {
          return {
            ...screen,
            isAnswered: true,
            userAnswerIndex: answerIndex
          };
        }
        return screen;
      })
    );
  };

  const handleEmailSubmit = (email: string) => {
    console.log("Email submitted:", email);
    // Here you would typically send the email and quiz answers to a backend
    // For now, we just log it. The EmailForm component itself handles showing a "Thank You" message.
  };

  const changeSlide = (direction: number) => {
    if (screens.length === 0) return;

    const currentScreen = screens[currentScreenIndex];
    const targetIndex = currentScreenIndex + direction;

    if (direction > 0) { // Trying to go Next
      if (currentScreen.type === 'quiz' && !currentScreen.isAnswered) {
        // If current screen is an unanswered quiz question, block "next"
        console.log("Answer current quiz question to proceed.");
        return;
      }
      if (currentScreen.type === 'emailForm') {
        // Potentially do nothing if on email form and trying to go next, or trigger form submission if not handled internally
        console.log("Already on the email form.");
        return;
      }
      if (targetIndex < screens.length) {
        setSwipeDirection(1);
        setCurrentScreenIndex(targetIndex);
      }
    } else { // Trying to go Previous
      if (targetIndex >= 0) {
        setSwipeDirection(-1);
        setCurrentScreenIndex(targetIndex);
      }
    }
  };

  const handlers = useSwipeable({
    onSwipedUp: () => changeSlide(1),
    onSwipedDown: () => changeSlide(-1),
    onSwipedLeft: () => changeSlide(1),  // Add left swipe for next
    onSwipedRight: () => changeSlide(-1), // Add right swipe for previous
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  if (screens.length === 0) {
    return <div className="p-8 text-center">Loading interactive demo...</div>;
  }

  const activeScreen = screens[currentScreenIndex];

  const slideVariants = {
    initial: (direction: number) => ({ y: direction > 0 ? "100%" : "-100%", opacity: 0.8, scale: 0.98 }),
    animate: { y: "0%", opacity: 1, scale: 1, transition: { type: "spring", stiffness: 260, damping: 30 } },
    exit: (direction: number) => ({ y: direction > 0 ? "-100%" : "100%", opacity: 0.8, scale: 0.98, transition: { type: "spring", stiffness: 260, damping: 30 } })
  };

  const isFirstScreen = currentScreenIndex === 0;
  const isLastScreen = currentScreenIndex === screens.length - 1;
  const isCurrentQuizUnanswered = activeScreen.type === 'quiz' && !activeScreen.isAnswered;

  // Determine current quiz number and total for passing to QuizQuestionSlide
  let currentQuizNo = 0;
  const totalQuizNo = screens.filter(s => s.type === 'quiz').length;
  if (activeScreen.type === 'quiz') {
    let quizCounter = 0;
    for (let i = 0; i <= currentScreenIndex; i++) {
      if (screens[i].type === 'quiz') {
        quizCounter++;
      }
    }
    currentQuizNo = quizCounter;
  }

  return (
    <div className="w-full flex justify-center items-center min-h-[500px] md:py-8"> {/* Changed to min-h and added items-center */}
      {/* Container for Phone Mockup + External Arrows (Desktop) */}
      <div className="relative md:flex md:items-center md:space-x-4">
        
        {/* iPhone Mockup Container - Visible on medium screens and up (md:) */}
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
                key={activeScreen.id} // Use unique screen ID for key
                custom={swipeDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full h-full absolute top-0 left-0 pt-7 flex flex-col" // Added flex flex-col
              >
                <div className="flex-grow overflow-y-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none]">
                  {activeScreen.type === 'lesson' && (
                    <LessonSlide title={activeScreen.data.title} content={activeScreen.data.content} imageSrc={activeScreen.data.imageSrc} />
                  )}
                  {activeScreen.type === 'quiz' && (
                    <QuizQuestionSlide screen={activeScreen} onAnswer={handleAnswerQuizQuestion} currentQuizNumber={currentQuizNo} totalQuizQuestions={totalQuizNo} />
                  )}
                  {activeScreen.type === 'emailForm' && <EmailForm title={activeScreen.title} onSubmitEmail={handleEmailSubmit} />}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* External Arrow Controls (Desktop) */}
        <div className="hidden md:flex flex-col space-y-3">
          <button
            onClick={() => changeSlide(-1)} // Up Arrow (Previous Slide)
            disabled={isFirstScreen} // Disable if first lesson slide
            className={`p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 ${isFirstScreen ? 'cursor-not-allowed' : ''}`}
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={() => changeSlide(1)} // Down Arrow (Next Slide)
            disabled={isLastScreen || isCurrentQuizUnanswered || activeScreen.type === 'emailForm'} // Disable if last lesson slide (will go to quiz) or if in quiz view
            className={`p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 ${(isLastScreen || isCurrentQuizUnanswered || activeScreen.type === 'emailForm') ? 'cursor-not-allowed' : ''}`}
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Screen Content Area for Mobile - Visible only on screens smaller than md */}
        <div className="w-full max-w-lg mx-auto md:hidden">
          <div {...handlers} className="relative bg-white rounded-2xl shadow-lg overflow-hidden" style={{ minHeight: '500px', maxHeight: '80vh' }}>
            {/* Progress Indicator for Mobile */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 z-20">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${((currentScreenIndex + 1) / screens.length) * 100}%` }}
              />
            </div>
            
            {/* Swipe Hint for Mobile */}
            {currentScreenIndex === 0 && (
              <div className="absolute bottom-4 left-0 right-0 text-center z-20 animate-bounce">
                <p className="text-xs text-gray-500">Swipe left to continue →</p>
              </div>
            )}
            
            <AnimatePresence initial={false} custom={swipeDirection}>
              <motion.div
                key={activeScreen.id}
                custom={swipeDirection}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0 flex flex-col"
              >
                <div className="flex-grow overflow-y-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] p-6">
                  {activeScreen.type === 'lesson' && (
                    <LessonSlide title={activeScreen.data.title} content={activeScreen.data.content} imageSrc={activeScreen.data.imageSrc} />
                  )}
                  {activeScreen.type === 'quiz' && (
                    <QuizQuestionSlide screen={activeScreen} onAnswer={handleAnswerQuizQuestion} currentQuizNumber={currentQuizNo} totalQuizQuestions={totalQuizNo} />
                  )}
                  {activeScreen.type === 'emailForm' && <EmailForm title={activeScreen.title} onSubmitEmail={handleEmailSubmit} />}
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation Dots for Mobile */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
              {screens.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (index < currentScreenIndex || (index === currentScreenIndex)) {
                      setCurrentScreenIndex(index);
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentScreenIndex
                      ? 'bg-emerald-600 w-6'
                      : index < currentScreenIndex
                      ? 'bg-emerald-400'
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 