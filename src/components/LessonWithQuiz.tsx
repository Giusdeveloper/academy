'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/config/supabase';
import VideoPlayer from './VideoPlayer';
import QuizModal from './QuizModal';
import { useLessonProgress } from '@/hooks/useLessonProgress';

interface Material {
  id: number;
  title: string;
  description: string | null;
  type: 'ppt' | 'pdf' | 'video';
  url: string;
  lesson_id: string;
  created_at: string;
  video_type?: 'iframe' | 'html5';
  html5_url?: string | null;
}

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  order: number;
  course_id: string;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Array<{
    id: string;
    question: string;
    type: 'multiple_choice' | 'true_false';
    options: string[];
    correct_answer: number;
    explanation?: string;
  }>;
  passing_score: number;
  max_attempts: number;
  time_limit?: number;
}

interface LessonWithQuizProps {
  lesson: Lesson;
  materials: Material[];
  courseId: string;
}

export default function LessonWithQuiz({ lesson, materials, courseId }: LessonWithQuizProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { markVideoWatched, markLessonCompleted, markQuizCompleted } = useLessonProgress(courseId);

  // Trova il materiale video
  const videoMaterial = materials.find(material => material.type === 'video');

  const fetchQuiz = useCallback(async () => {
    try {
      setLoading(true);
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('lesson_id', lesson.id)
        .single();

      if (quizError) {
        // Se la tabella non esiste o non ci sono quiz, non è un errore critico
        if (quizError.code === 'PGRST116' || 
            quizError.message.includes('No rows found') ||
            quizError.message.includes('schema cache')) {
          setQuiz(null);
          return;
        }
        throw quizError;
      } else if (quizData) {
        setQuiz(quizData);
      } else {
        setQuiz(null);
      }
    } catch {
      // Gestione silenziosa degli errori - non è critico se non ci sono quiz
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  }, [lesson.id]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleQuizComplete = async (passed: boolean, score: number) => {
    try {
      if (quiz) {
        await markQuizCompleted(lesson.id, quiz.id, score, passed);
      }
    } catch {
      setError('Errore nel completare il quiz');
    }
    
    setShowQuiz(false);
    
    // Solo se il quiz è passato, segna come completato
    if (passed) {
      setQuizCompleted(true);
      
      // Forza l'aggiornamento della sidebar
      window.dispatchEvent(new CustomEvent('lessonUnlocked', { 
        detail: { lessonId: lesson.id, passed } 
      }));
    }
  };

  const handleNextLesson = () => {
    if (quiz && !quizCompleted) {
      // Se c'è un quiz e non è ancora stato completato con successo, aprilo
      setShowQuiz(true);
      // Forza il refresh del quiz per resettare lo stato
      setTimeout(() => {
        setShowQuiz(true);
      }, 100);
    } else if (quizCompleted) {
      // Se il quiz è già stato completato con successo, la lezione è già sbloccata
    } else {
      // Se non c'è quiz, completa direttamente la lezione
      markQuizCompleted(lesson.id, '', 100, true);
    }
  };


  const handleVideoEnd = async () => {
    setVideoEnded(true);
    
    try {
      await markVideoWatched(lesson.id);
    } catch {
      setError('Errore nel salvare il progresso del video');
    }

    if (!quiz) {
      await markLessonCompleted(lesson.id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-600">Caricamento lezione...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Video Player */}
      {videoMaterial && (
        <div className="mb-8">
          <VideoPlayer
            videoUrl={videoMaterial.html5_url || videoMaterial.url}
            title={lesson.title}
            onVideoEnd={handleVideoEnd}
            videoType={videoMaterial.video_type || 'html5'}
          />
        </div>
      )}

      {/* Contenuto della lezione */}
      {lesson.content && (
        <div className="prose prose-gray max-w-none mb-8 prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-li:text-gray-800 prose-a:text-[#9e005c] prose-a:no-underline hover:prose-a:underline">
          <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </div>
      )}

      {/* Materiali aggiuntivi */}
      {materials.filter(m => m.type !== 'video').length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Materiali Aggiuntivi</h3>
          <div className="grid gap-4">
            {materials
              .filter(material => material.type !== 'video')
              .map((material) => (
                <div key={material.id} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">{material.title}</h4>
                  {material.description && (
                    <p className="text-gray-600 mb-3">{material.description}</p>
                  )}
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {material.type === 'pdf' ? '📄' : '📊'} Scarica {material.type.toUpperCase()}
                  </a>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Pulsante per il quiz o prossima lezione */}
      {videoEnded && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🎯 Video Completato!
            </h3>
            <p className="text-blue-800 mb-4">
              Ottimo! Hai completato la visualizzazione del video. 
              {quiz ? ' Ora devi superare un quiz per completare questa lezione.' : ' Questa lezione è stata completata.'}
            </p>
            
            {quiz && !quizCompleted ? (
              <button
                onClick={handleNextLesson}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {quiz ? 'Inizia Quiz' : 'Prossima Lezione'}
              </button>
            ) : quizCompleted ? (
              <div className="text-green-800 font-medium">
                ✅ Quiz completato con successo!
              </div>
            ) : (
              <div className="text-green-800 font-medium">
                ✅ Lezione completata!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuiz && quiz && (
        <QuizModal
          isOpen={showQuiz}
          quiz={quiz}
          onQuizComplete={handleQuizComplete}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
}
