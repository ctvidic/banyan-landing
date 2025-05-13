import React, { useState, useEffect } from 'react';
import type { QuizQuestion } from './InteractiveDemo'; // Assuming types will be co-located or exported

export interface QuizScreenForSlide {
  id: string;
  type: 'quiz';
  data: QuizQuestion;
  isAnswered: boolean;
  userAnswerIndex?: number;
}

interface QuizQuestionSlideProps {
  screen: QuizScreenForSlide;
  onAnswer: (questionId: string, answerIndex: number) => void;
  currentQuizNumber: number;
  totalQuizQuestions: number;
}

const QuizQuestionSlide: React.FC<QuizQuestionSlideProps> = ({ screen, onAnswer, currentQuizNumber, totalQuizQuestions }) => {
  const { data: quizQuestion, isAnswered, userAnswerIndex } = screen;
  // Use state for selectedOption to allow visual update before parent re-render if needed,
  // but ensure it syncs with userAnswerIndex when screen changes or isAnswered.
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    setSelectedOption(userAnswerIndex !== undefined ? userAnswerIndex : null);
  }, [userAnswerIndex, screen.id]); // Depend on screen.id to reset for new questions

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
    onAnswer(screen.id, index); 
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-white text-center">
      {quizQuestion.imageSrc && (
        <img src={quizQuestion.imageSrc} alt="Quiz image" className="w-32 h-32 object-contain mb-4" />
      )}
      <h2 className="text-xl font-semibold mb-1 text-gray-800">
        Question {currentQuizNumber} of {totalQuizQuestions}
      </h2>
      <p className="text-lg text-gray-700 mb-6">{quizQuestion.questionText}</p>

      <div className="w-full max-w-md space-y-3">
        {quizQuestion.options.map((option: string, index: number) => { // Added types for map params
          let buttonClass = "w-full p-3 rounded-lg border-2 transition-colors text-left text-sm ";
          const isSelectedAnswer = index === selectedOption;

          if (isAnswered) {
            if (isSelectedAnswer) {
              // Style for the chosen answer after it's locked in
              buttonClass += "bg-blue-100 border-blue-500 text-blue-700 font-semibold ring-2 ring-blue-500";
            } else {
              // Style for other options after an answer is locked in
              buttonClass += "bg-gray-100 border-gray-300 text-gray-500 opacity-70";
            }
          } else {
            // Styles for when the question is active (not yet answered)
            if (isSelectedAnswer) {
              buttonClass += "bg-emerald-100 border-emerald-500 ring-2 ring-emerald-500";
            } else {
              buttonClass += "bg-white border-gray-300 hover:bg-gray-50";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              className={buttonClass}
            >
              {option}
            </button>
          );
        })}
      </div>
      {isAnswered && (
        <p className="mt-4 text-sm text-gray-600">
          Your answer is recorded. You can now swipe to continue.
        </p>
      )}
    </div>
  );
};

export default QuizQuestionSlide; 