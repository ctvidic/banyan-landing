import React, { useState } from 'react';

export interface QuizQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  userAnswerIndex?: number;
  isCorrect?: boolean;
}

interface QuizViewProps {
  questions: QuizQuestion[];
  onQuizComplete: (score: number, totalQuestions: number) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex: number) => {
    if (showFeedback) return; // Don't allow changing answer after feedback
    setSelectedOptionIndex(optionIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null) return;

    const isCorrect = selectedOptionIndex === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    // Update question state for review (optional)
    questions[currentQuestionIndex].userAnswerIndex = selectedOptionIndex;
    questions[currentQuestionIndex].isCorrect = isCorrect;
    
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedOptionIndex(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizFinished(true);
      onQuizComplete(score, questions.length);
    }
  };

  if (quizFinished) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-white text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Quiz Complete!</h2>
        <p className="text-xl text-gray-700 mb-6">
          You scored {score} out of {questions.length}
        </p>
        {/* Optionally, add a button to restart or proceed */}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-6 bg-white overflow-y-auto">
      <h2 className="text-xl font-semibold mb-2 text-gray-800 text-center">Question {currentQuestionIndex + 1} of {questions.length}</h2>
      <p className="text-lg text-gray-700 mb-6 text-center">{currentQuestion.questionText}</p>
      
      <div className="w-full max-w-md space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => {
          let buttonClass = "w-full p-3 rounded-lg border-2 transition-colors text-left ";
          if (showFeedback) {
            if (index === currentQuestion.correctAnswerIndex) {
              buttonClass += "bg-green-100 border-green-500 text-green-700";
            } else if (index === selectedOptionIndex) {
              buttonClass += "bg-red-100 border-red-500 text-red-700";
            } else {
              buttonClass += "bg-gray-100 border-gray-300 text-gray-500 opacity-70";
            }
          } else {
            if (selectedOptionIndex === index) {
              buttonClass += "bg-emerald-100 border-emerald-500 ring-2 ring-emerald-500";
            } else {
              buttonClass += "bg-white border-gray-300 hover:bg-gray-50";
            }
          }
          return (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={showFeedback}
              className={buttonClass}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showFeedback ? (
        <button
          onClick={handleNextQuestion}
          className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors w-full max-w-md"
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      ) : (
        <button
          onClick={handleSubmitAnswer}
          disabled={selectedOptionIndex === null}
          className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-gray-300 w-full max-w-md"
        >
          Submit Answer
        </button>
      )}
    </div>
  );
};

export default QuizView; 