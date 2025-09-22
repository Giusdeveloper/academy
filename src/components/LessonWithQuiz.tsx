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
  const [showQuiz, setShowQuiz] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { markVideoWatched, markLessonCompleted, markQuizCompleted, getLessonStatus } = useLessonProgress(courseId);

  const fetchQuiz = useCallback(async () => {
    try {
      console.log('🔍 Cercando quiz per lezione:', lesson.id);
      console.log('🔍 Supabase client:', !!supabase);
      
      // Cerchiamo il quiz per questa lezione
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('lesson_id', lesson.id)
        .single();

      console.log('🔍 Risposta Supabase:', { quizData, quizError });

      if (quizError) {
        console.log('❌ Errore nel recupero del quiz:', quizError);
        // Se la tabella non esiste o non ci sono quiz, non è un errore critico
        if (quizError.code === 'PGRST116' || 
            quizError.code === 'PGRST205' ||
            quizError.message.includes('does not exist') ||
            quizError.message.includes('No rows found') ||
            quizError.message.includes('0 rows') ||
            quizError.message.includes('schema cache')) {
          console.log('Nessun quiz disponibile per questa lezione');
          setQuiz(null);
        } else {
          // Solo loggare errori veri
          console.warn('Errore nel recupero del quiz (non critico):', quizError.message);
          setQuiz(null);
        }
      } else if (quizData) {
        console.log('✅ Quiz trovato per la lezione:', quizData.title);
        setQuiz(quizData);
      } else {
        console.log('❌ Nessun quiz trovato per questa lezione');
        setQuiz(null);
      }
    } catch {
      // Gestione silenziosa degli errori - non è critico se non ci sono quiz
      console.log('Quiz non disponibile per questa lezione (catch)');
      setQuiz(null);
    }
  }, [lesson.id]);

  useEffect(() => {
    console.log('🔄 useEffect fetchQuiz chiamato');
    fetchQuiz();
  }, [fetchQuiz]);



  const handleQuizComplete = async (passed: boolean, score: number) => {
    console.log('🎯 Quiz completato:', { passed, score });
    console.log('🎯 Quiz object:', quiz);
    console.log('🎯 Lesson ID:', lesson.id);
    
    if (quiz) {
      console.log('🎯 Chiamando markQuizCompleted...');
      await markQuizCompleted(lesson.id, quiz.id, score, passed);
      console.log('🎯 markQuizCompleted completato');
    } else {
      console.log('❌ Nessun quiz disponibile');
    }
    
    setShowQuiz(false);
    
    // Solo se il quiz è passato, segna come completato
    if (passed) {
      setQuizCompleted(true);
      console.log('🎉 Quiz passato! Lezione sbloccata per la prossima volta.');
      
      // Non refreshare la pagina per ora, per vedere i log
      console.log('🔄 Quiz completato con successo!');
    } else {
      console.log('❌ Quiz fallito! Il quiz può essere ripetuto.');
    }
  };


  const handleNextLesson = () => {
    console.log('🔍 Debug handleNextLesson:');
    console.log('- quiz:', quiz);
    console.log('- showQuiz:', showQuiz);
    console.log('- lesson.id:', lesson.id);
    console.log('- quiz exists:', !!quiz);
    console.log('- quiz title:', quiz?.title);
    console.log('- quizCompleted:', quizCompleted);
    
    if (quiz && !quizCompleted) {
      // Se c'è un quiz e non è ancora stato completato con successo, aprilo
      console.log('📝 Aprendo quiz per sbloccare la prossima lezione...');
      setShowQuiz(true);
      console.log('📝 showQuiz impostato a true');
      // Forza il refresh del quiz per resettare lo stato
      setTimeout(() => {
        setShowQuiz(false);
        setShowQuiz(true);
        console.log('📝 Quiz refreshato');
      }, 100);
    } else if (quiz && quizCompleted) {
      // Se il quiz è già stato completato con successo, la lezione è già sbloccata
      console.log('✅ Quiz già completato con successo!');
    } else {
      // Se non c'è quiz, completa direttamente la lezione
      console.log('✅ Completando lezione senza quiz...');
      markQuizCompleted(lesson.id, '', 100, true);
    }
  };

  const handleVideoStart = () => {
    console.log('▶️ Video iniziato');
    setVideoStarted(true);
  };

  const handleVideoEnd = async () => {
    console.log('🎬 Video terminato!', { lessonId: lesson.id, hasQuiz: !!quiz });
    setVideoEnded(true);
    setVideoStarted(false); // Nasconde il pulsante
    
    // Marca il video come visto
    await markVideoWatched(lesson.id);
    
    // Se NON c'è quiz, completa immediatamente la lezione
    if (!quiz) {
      console.log('📝 Nessun quiz trovato. Completamento automatico della lezione...');
      await markLessonCompleted(lesson.id);
      console.log('✅ Lezione senza quiz completata automaticamente');
    } else {
      console.log('📝 Quiz presente. In attesa di clic su "Prossima Lezione" per aprire il quiz');
    }
  };

  const lessonStatus = getLessonStatus(lesson.id);
  const videoMaterial = materials.find(m => m.type === 'video');
  const otherMaterials = materials.filter(m => m.type !== 'video');

  // Debug: mostra i dati del materiale video
  console.log('🔍 Debug Video Material:', {
    videoMaterial,
    videoType: videoMaterial?.video_type,
    html5Url: videoMaterial?.html5_url,
    originalUrl: videoMaterial?.url
  });
  
  // Debug: mostra tutti i materiali
  console.log('🔍 Debug All Materials:', materials);

  // Debug log
  console.log('🔍 LessonWithQuiz Debug:', {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    lessonContent: lesson.content,
    lessonContentLength: lesson.content?.length || 0,
    lessonStatus,
    videoEnded,
    hasQuiz: !!quiz,
    hasVideo: !!videoMaterial,
    videoUrl: videoMaterial?.url,
  });

  // Debug: sempre mostra qualcosa
  console.log('🔍 LessonWithQuiz render:', {
    hasVideoMaterial: !!videoMaterial,
    videoStarted,
    videoEnded,
    lessonStatus
  });

  return (
    <div className="space-y-8">

      {/* Video Player */}
      {videoMaterial ? (
        <div>
          {!videoStarted && !videoEnded && (
            <div className="bg-gray-100 border border-gray-200 rounded-xl p-8 mb-6 text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Video della Lezione</h3>
              <p className="text-gray-600 mb-4">Clicca per iniziare a guardare il video</p>
              <button
                onClick={handleVideoStart}
                className="bg-[#9e005c] text-white px-6 py-3 rounded-lg hover:bg-[#c2185b] transition-colors font-semibold"
              >
                Inizia Video
              </button>
            </div>
          )}
          
          {videoStarted && (
            <div>
            <VideoPlayer
              videoUrl={videoMaterial.html5_url || videoMaterial.url}
              title={lesson.title}
              className="w-full mb-6"
              onVideoEnd={handleVideoEnd}
            />
              
              
            </div>
          )}
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 mb-6 text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Nessun Video Trovato</h3>
          <p className="text-red-700">Non è stato trovato alcun video per questa lezione.</p>
        </div>
      )}
          
      {/* Pulsante Fai il quiz - appare solo quando il video è completato */}
      {(() => {
        console.log('🔍 Debug pulsante quiz:', { videoEnded, quiz: !!quiz, quizCompleted, quizTitle: quiz?.title });
        return null;
      })()}
      {videoEnded && quiz && !quizCompleted && (
        <div className="text-center mb-6">
          <button
            onClick={() => {
              console.log('🖱️ Pulsante "Fai il quiz" cliccato!');
              handleNextLesson();
            }}
            className="bg-[#9e005c] text-white px-8 py-3 rounded-lg hover:bg-[#c2185b] transition-colors font-semibold flex items-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Fai il quiz
          </button>
        </div>
      )}
      
      {/* Messaggio dopo il completamento del quiz */}
      {quizCompleted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-900">
              Quiz Completato!
            </h3>
          </div>
          <p className="text-green-800 mb-4">
            🎉 Ottimo! Hai completato con successo questa lezione. 
            La prossima lezione è ora sbloccata e disponibile nell&apos;elenco a fianco.
          </p>
          <div className="bg-green-100 border border-green-300 rounded-lg p-3">
            <p className="text-green-800 text-sm font-medium">
              ✅ Lezione completata e sbloccata per la prossima volta
            </p>
          </div>
            </div>
          )}
          
          {/* Messaggio se la lezione è già completata */}
      {lessonStatus === 'completed' && !quizCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-900">
                  Lezione Completata!
                </h3>
              </div>
              <p className="text-green-800 mt-2">
                Hai già completato questa lezione con successo.
              </p>
        </div>
      )}


      {/* Materiali aggiuntivi */}
      {otherMaterials.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Materiali Aggiuntivi</h3>
          <div className="grid gap-6">
            {otherMaterials.map((material) => (
              <div key={material.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-[#9e005c] rounded-lg flex items-center justify-center">
                  {material.type === 'pdf' && (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  {material.type === 'ppt' && (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{material.title}</h4>
                  {material.description && (
                    <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                  )}
                </div>
                <a
                  href={material.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#9e005c] text-white rounded-lg hover:bg-[#c2185b] transition-colors"
                >
                  Scarica
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {quiz && (
        <QuizModal
          isOpen={showQuiz}
          onClose={() => setShowQuiz(false)}
          quiz={quiz}
          onQuizComplete={handleQuizComplete}
        />
      )}

    </div>
  );
}
