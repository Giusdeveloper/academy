'use client';

import { useState, useEffect, useCallback } from 'react';
import './QuizModal.css';

interface Question {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false';
  options: string[];
  correct_answer: number; // Indice della risposta corretta
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  passing_score: number;
  max_attempts: number;
  time_limit?: number;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: Quiz | null;
  onQuizComplete: (passed: boolean, score: number) => void;
}

export default function QuizModal({ 
  isOpen, 
  onClose, 
  quiz, 
  onQuizComplete 
}: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = useCallback(() => {
    if (!quiz) return 0;
    
    let correct = 0;
    quiz.questions.forEach(question => {
      if (answers[question.id] === question.correct_answer) {
        correct++;
      }
    });
    
    return Math.round((correct / quiz.questions.length) * 100);
  }, [quiz, answers]);

  const handleSubmit = useCallback(async () => {
    if (!quiz) return;
    
    setIsSubmitting(true);
    const calculatedScore = calculateScore();
    const quizPassed = calculatedScore >= quiz.passing_score;
    
    setScore(calculatedScore);
    setPassed(quizPassed);
    setShowResults(true);
    setIsSubmitting(false);
  }, [quiz, calculateScore]);

  useEffect(() => {
    if (isOpen && quiz) {
      setCurrentQuestion(0);
      setAnswers({});
      setShowResults(false);
      setScore(0);
      setPassed(false);
      
      if (quiz.time_limit) {
        setTimeLeft(quiz.time_limit * 60); // Converti in secondi
      }
    }
  }, [isOpen, quiz]);

  useEffect(() => {
    if (timeLeft && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, handleSubmit]);

  const handleComplete = () => {
    console.log('🎯 QuizModal handleComplete chiamato:', { passed, score });
    console.log('🎯 Chiamando onQuizComplete con:', { passed, score });
    onQuizComplete(passed, score);
    console.log('🎯 onQuizComplete chiamato, chiudendo modal');
    onClose();
  };

  if (!isOpen || !quiz) return null;

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{quiz.title}</h2>
            {timeLeft && (
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            )}
          </div>
          
          {quiz.description && (
            <p className="text-gray-600 mb-4">{quiz.description}</p>
          )}
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`quiz-progress-bar quiz-progress-${Math.round(progress / 5) * 5}`}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Domanda {currentQuestion + 1} di {quiz.questions.length}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showResults ? (
            <>
              {/* Question */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {currentQ.question}
                </h3>
                
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        answers[currentQ.id] === index
                          ? 'border-[#9e005c] bg-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQ.id}`}
                        value={index}
                        checked={answers[currentQ.id] === index}
                        onChange={() => handleAnswerSelect(currentQ.id, index)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        answers[currentQ.id] === index
                          ? 'border-[#9e005c] bg-[#9e005c]'
                          : 'border-gray-300'
                      }`}>
                        {answers[currentQ.id] === index && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-gray-900">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Precedente
                </button>
                
                {currentQuestion === quiz.questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-[#9e005c] text-white rounded-xl hover:bg-[#c2185b] disabled:opacity-50"
                  >
                    {isSubmitting ? 'Invio...' : 'Completa Quiz'}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-[#9e005c] text-white rounded-xl hover:bg-[#c2185b]"
                  >
                    Successiva
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Results */
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {passed ? (
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              
              <h3 className={`text-2xl font-bold mb-2 ${
                passed ? 'text-green-600' : 'text-red-600'
              }`}>
                {passed ? 'Quiz Completato!' : 'Quiz Non Superato'}
              </h3>
              
              <p className="text-gray-600 mb-4">
                Il tuo punteggio: <span className="font-bold">{score}%</span>
              </p>
              
              <p className="text-sm text-gray-500 mb-6">
                Punteggio minimo richiesto: {quiz.passing_score}%
              </p>
              
              <button
                onClick={handleComplete}
                className="px-8 py-3 bg-[#9e005c] text-white rounded-xl hover:bg-[#c2185b] font-semibold"
              >
                {passed ? 'Continua' : 'Riprova'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
