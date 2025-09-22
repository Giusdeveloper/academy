'use client';

import { supabase } from '@/config/supabase';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import EnrollmentModal from '@/components/EnrollmentModal';
import UnenrollModal from '@/components/UnenrollModal';
import LessonPreviewModal from '@/components/LessonPreviewModal';
import VideoPlayer from '@/components/VideoPlayer';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import './course-layout.css';

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  order: number;
  course_id: string;
  created_at: string;
}

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

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  level: string | null;
  language: string | null;
  price: number;
  duration_hours: number | null;
  ects_max: number | null;
  image_url: string | null;
  created_at: string;
}

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // Stato iscrizione (localStorage)
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showUnenrollModal, setShowUnenrollModal] = useState(false);
  const [previewLesson, setPreviewLesson] = useState<{title: string, content: string} | null>(null);

  // Reindirizza automaticamente alla prima lezione solo se non sei già su una lezione
  useEffect(() => {
    if (lessons.length > 0 && typeof window !== 'undefined') {
      // Controlla se sei già su una pagina di lezione
      const isOnLessonPage = window.location.pathname.includes('/lesson/');
      if (!isOnLessonPage) {
        const firstLesson = lessons.find(lesson => lesson.order === 1);
        if (firstLesson) {
          console.log('🔄 Reindirizzamento automatico alla prima lezione:', firstLesson.id);
          router.push(`/courses/products/${id}/lesson/${firstLesson.id}`);
        }
      }
    }
  }, [lessons, id, router]);

  useEffect(() => {
    if (!id) return;

    const fetchCourseData = async () => {
      try {
        console.log('Tentativo di recupero corso con ID:', id);

        // Recupera i dettagli del corso per ID
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (courseError) {
          console.error('Errore nel recupero del corso:', courseError);
          throw courseError;
        }
        
        if (!courseData) {
          console.error('Corso non trovato');
          throw new Error('Corso non trovato');
        }

        console.log('Corso trovato:', courseData);
        setCourse(courseData);

        // Recupera le lezioni del corso
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .eq('course_id', courseData.id)
          .order('order', { ascending: true });

        if (lessonsError) {
          console.error('Errore nel recupero delle lezioni:', lessonsError);
          throw lessonsError;
        }

        console.log('Lezioni trovate:', lessonsData);
        setLessons(lessonsData || []);

        // Recupera i materiali video per tutte le lezioni del corso
        const lessonIds = lessonsData?.map(l => l.id) || [];
        if (lessonIds.length > 0) {
          const { data: materialsData, error: materialsError } = await supabase
            .from('materials')
            .select('*')
            .in('lesson_id', lessonIds)
            .eq('type', 'video')
            .order('created_at', { ascending: true });

          if (materialsError) {
            console.error('Errore nel recupero dei materiali:', materialsError);
          } else {
            console.log('Materiali video trovati:', materialsData);
            setMaterials(materialsData || []);
          }
        }

      } catch (error) {
        console.error('Errore nel recupero dei dati:', error);
        setPageError('Si è verificato un errore nel caricamento del corso.');
      } finally {
        setPageLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  useEffect(() => {
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    setIsEnrolled(enrolledCourses.includes(course?.id));
  }, [course?.id]);

  const handleEnrollClick = () => {
    setShowModal(true);
  };

  const handleEnrollConfirm = () => {
    if (!course) return;
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    if (!enrolledCourses.includes(course.id)) {
      enrolledCourses.push(course.id);
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
    }
    setIsEnrolled(true);
    setShowModal(false);
  };

  const handleModalClose = () => setShowModal(false);

  const handleUnenrollConfirm = () => {
    if (!course) return;
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    const updated = enrolledCourses.filter((id: string) => id !== course.id);
    localStorage.setItem('enrolledCourses', JSON.stringify(updated));
    setIsEnrolled(false);
    setShowUnenrollModal(false);
  };
  const handleUnenrollClose = () => setShowUnenrollModal(false);

  // Hook per gestire il progresso delle lezioni
  const { 
    isLessonUnlocked, 
    getLessonStatus 
  } = useLessonProgress(id);

  // Funzione helper per trovare il video di una lezione
  const getVideoForLesson = (lessonId: string) => {
    return materials.find(material => 
      material.lesson_id === lessonId && material.type === 'video'
    );
  };

  // Funzione per ottenere lo stato di una lezione
  const getLessonDisplayStatus = (lesson: Lesson) => {
    if (!isEnrolled) return 'locked';
    
    const status = getLessonStatus(lesson.id);
    const isUnlocked = isLessonUnlocked(lesson.order, lessons);
    
    if (!isUnlocked) return 'locked';
    if (status === 'completed') return 'completed';
    if (status === 'video_watched') return 'video_watched';
    return 'unlocked';
  };

  // Se il corso non è ancora caricato o c'è un errore iniziale
  if (pageLoading) {
    return <div className="min-h-screen bg-[#f6fafd] flex items-center justify-center">Caricamento corso...</div>;
  }

  if (pageError || !course) {
     return (
      <div className="min-h-screen bg-[#f6fafd] flex items-center justify-center">
        <div className="text-red-500 text-xl max-w-2xl text-center">
          {pageError || 'Corso non trovato.'}
          <br />
          <span className="text-sm mt-4 block">
            Verifica che l&apos;ID nell&apos;URL sia corretto e che il corso esista nel database.
          </span>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="breadcrumb-container">
            <Link href="/courses" className="breadcrumb-item">Corsi</Link>
            <span className="breadcrumb-separator">/</span>
            <Link href="/courses" className="breadcrumb-item">Categorie</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item">{course?.category || 'Corso'}</span>
            <span className="breadcrumb-separator">/</span>
            <span className="text-gray-900 font-medium">{course?.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenuto principale - Video Player */}
          <div className="lg:col-span-3">
            {/* Video Player */}
            <div className="video-player-container mb-6">
              <VideoPlayer 
                videoUrl={getVideoForLesson(lessons[0]?.id)?.url || null}
                title={lessons[0]?.title || course?.title || 'Video del corso'}
                className="w-full"
              />
            </div>

            {/* Status del corso */}
            {isEnrolled ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-green-700 font-medium">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  Iscritto al corso
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Iscriviti al corso</h3>
                <p className="text-gray-600 mb-4">Accedi a tutti i contenuti e le lezioni di questo corso.</p>
                <button 
                  onClick={handleEnrollClick}
                  className="w-full bg-[#9e005c] hover:bg-[#c2185b] text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Iscriviti ora - €{course?.price}
                </button>
              </div>
            )}

            {/* Prossima lezione */}
            {lessons.length > 1 && isEnrolled && (
              <div className="next-lesson-card">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Prossima lezione disponibile</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{lessons[1]?.title}</h4>
                    <p className="text-sm text-gray-600">Modulo {lessons[1]?.order}</p>
                  </div>
                  {isEnrolled ? (
                    <Link
                      href={`/courses/products/${id}/lesson/${lessons[1]?.id}`}
                      className="text-[#9e005c] hover:text-[#c2185b] font-semibold flex items-center gap-1"
                    >
                      Prossima lezione
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ) : (
                    <button
                      onClick={handleEnrollClick}
                      className="text-[#9e005c] hover:text-[#c2185b] font-semibold flex items-center gap-1"
                    >
                      Iscriviti per continuare
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar destra */}
          <div className="lg:col-span-1">
            <div className="lesson-sidebar p-6 sticky top-8">
              {/* Header modulo */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  {course?.title}
                </h2>
                <p className="text-sm text-gray-600">{lessons.length} Lezioni</p>
              </div>

              {/* Lista lezioni */}
              <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                
                {lessons.map((lesson, index) => {
                  const status = getLessonDisplayStatus(lesson);
                  const isClickable = status !== 'locked';
                  
                  const LessonContent = () => (
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        status === 'completed' 
                          ? 'bg-green-500 text-white' 
                          : status === 'video_watched'
                          ? 'bg-yellow-500 text-white'
                          : status === 'locked'
                          ? 'bg-gray-300 text-gray-500'
                          : index === 0 
                          ? 'bg-white text-[#9e005c]' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {status === 'completed' ? '✓' : lesson.order}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium text-sm leading-tight truncate ${
                          status === 'locked' 
                            ? 'text-gray-400' 
                            : status === 'completed'
                            ? 'text-white'
                            : status === 'video_watched'
                            ? 'text-white'
                            : index === 0 
                            ? 'text-white' 
                            : 'text-gray-900'
                        }`}>
                          {lesson.title}
                        </h3>
                        {status === 'video_watched' && (
                          <p className="text-xs text-yellow-600 mt-1">Quiz richiesto</p>
                        )}
                      </div>
                      {status === 'completed' && (
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      )}
                      {status === 'video_watched' && (
                        <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                      )}
                      {status === 'locked' && (
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </div>
                  );

                  return isClickable ? (
                    <Link
                      key={lesson.id}
                      href={`/courses/products/${id}/lesson/${lesson.id}`}
                      className={`lesson-item block ${index === 0 ? 'active' : ''}`}
                    >
                      <LessonContent />
                    </Link>
                  ) : (
                    <div
                      key={lesson.id}
                      className="lesson-item block opacity-60 cursor-not-allowed"
                      title="Lezione bloccata - Completa la prima lezione per sbloccare"
                    >
                      <LessonContent />
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EnrollmentModal
        isOpen={showModal}
        onClose={handleModalClose}
        onEnroll={handleEnrollConfirm}
      />
      <UnenrollModal
        isOpen={showUnenrollModal}
        onClose={handleUnenrollClose}
        onConfirm={handleUnenrollConfirm}
        courseTitle={course?.title || ''}
      />
      <LessonPreviewModal
        isOpen={!!previewLesson}
        onClose={() => setPreviewLesson(null)}
        lessonTitle={previewLesson?.title || ''}
        lessonContent={previewLesson?.content || ''}
        onEnroll={() => {
          setPreviewLesson(null);
          handleEnrollClick();
        }}
      />
    </div>
  );
}
