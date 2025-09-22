'use client';

import { supabase } from '@/config/supabase';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { User } from '@supabase/supabase-js';
import EnrollmentModal from '@/components/EnrollmentModal';
import UnenrollModal from '@/components/UnenrollModal';
import LessonPreviewModal from '@/components/LessonPreviewModal';
import VideoPlayer from '@/components/VideoPlayer';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import './course-layout.css';

// Immagine di default per i corsi - versione ad alta risoluzione
const DEFAULT_COURSE_IMAGE = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&h=450&q=90';

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
  const slug = params?.slug as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Stato iscrizione (localStorage)
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showUnenrollModal, setShowUnenrollModal] = useState(false);
  const [previewLesson, setPreviewLesson] = useState<{title: string, content: string} | null>(null);

  // Hook per il progresso delle lezioni
  const { progress, isLessonUnlocked } = useLessonProgress(course?.id || '');

  // Controllo autenticazione
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Errore nel controllo autenticazione:', error);
        setUser(null);
      }
    };

    checkAuth();

    // Ascolta i cambiamenti di autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Rimuoviamo il reindirizzamento automatico per permettere di vedere la pagina del corso
  // useEffect(() => {
  //   if (lessons.length > 0 && typeof window !== 'undefined') {
  //     // Controlla se sei già su una pagina di lezione
  //     const isOnLessonPage = window.location.pathname.includes('/lesson/');
  //     if (!isOnLessonPage) {
  //       const firstLesson = lessons.find(lesson => lesson.order === 1);
  //       if (firstLesson) {
  //         console.log('🔄 Reindirizzamento automatico alla prima lezione:', firstLesson.id);
  //         router.push(`/courses/${slug}/lesson/${firstLesson.id}`);
  //       }
  //     }
  //   }
  // }, [lessons, slug, router]);

  useEffect(() => {
    if (!slug) return;

    const fetchCourseData = async () => {
      try {
        console.log('Tentativo di recupero corso con slug:', slug);

        // Recupera i dettagli del corso per slug
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('slug', slug)
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

        // Recupera tutti i materiali per le lezioni del corso
        if (lessonsData && lessonsData.length > 0) {
          const lessonIds = lessonsData.map(lesson => lesson.id);
          const { data: materialsData, error: materialsError } = await supabase
            .from('materials')
            .select('*')
            .in('lesson_id', lessonIds)
            .order('created_at', { ascending: true });

          if (materialsError) {
            console.error('Errore nel recupero dei materiali:', materialsError);
          } else {
            console.log('Materiali trovati:', materialsData);
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
  }, [slug]);

  useEffect(() => {
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    setIsEnrolled(enrolledCourses.includes(course?.id));
  }, [course?.id]);

  // Funzione helper per ottenere il video di una lezione
  const getVideoForLesson = (lessonId: string) => {
    return materials.find(material => 
      material.lesson_id === lessonId && material.type === 'video'
    );
  };

  // Funzione per determinare lo stato di visualizzazione di una lezione
  const getLessonDisplayStatus = (lesson: Lesson) => {
    const lessonProgress = progress.find(p => p.lesson_id === lesson.id);
    
    if (lessonProgress?.completed) {
      return 'completed';
    }
    
    if (lessonProgress?.video_watched) {
      return 'video_watched';
    }
    
    if (isLessonUnlocked(lesson.order, lessons)) {
      return 'unlocked';
    }
    
    return 'locked';
  };

  // Funzione per ottenere la classe CSS del progresso
  const getProgressClass = () => {
    if (lessons.length === 0) return 'progress-0';
    
    const completedCount = progress.filter(p => p.completed).length;
    const percentage = Math.round((completedCount / lessons.length) * 100);
    
    // Arrotonda al multiplo di 5 più vicino
    const roundedPercentage = Math.round(percentage / 5) * 5;
    
    return `progress-${Math.min(roundedPercentage, 100)}`;
  };

  const handleEnrollClick = () => {
    // Controlla se l'utente è autenticato
    if (!user) {
      // Reindirizza alla pagina di login
      router.push('/login');
      return;
    }
    
    // Se l'utente è autenticato, mostra il modal di iscrizione
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };


  const handleUnenrollClose = () => {
    setShowUnenrollModal(false);
  };

  const handleEnrollConfirm = () => {
    if (course) {
      const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      enrolledCourses.push(course.id);
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
      setIsEnrolled(true);
      setShowModal(false);
    }
  };

  const handleUnenrollConfirm = () => {
    if (course) {
      const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      const updatedCourses = enrolledCourses.filter((id: string) => id !== course.id);
      localStorage.setItem('enrolledCourses', JSON.stringify(updatedCourses));
      setIsEnrolled(false);
      setShowUnenrollModal(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9e005c] mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento corso...</p>
        </div>
      </div>
    );
  }

  if (pageError || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-xl max-w-2xl text-center">
          {pageError || 'Corso non trovato.'}
          <br />
          <span className="text-sm mt-4 block">
            Verifica che lo slug nell&apos;URL sia corretto e che il corso esista nel database.
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
          {/* Contenuto principale */}
          <div className="lg:col-span-3">
            {/* Header del corso */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Immagine del corso */}
                <div className="lg:w-1/3">
                  <div className="course-image aspect-video rounded-lg overflow-hidden shadow-lg relative">
                    <Image 
                      src={course?.image_url || DEFAULT_COURSE_IMAGE} 
                      alt={course?.title || 'Corso'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality={90}
                      priority={true}
                      onError={(e) => {
                        // Fallback all'immagine di default se l'immagine specifica non si carica
                        const target = e.target as HTMLImageElement;
                        if (target.src !== DEFAULT_COURSE_IMAGE) {
                          target.src = DEFAULT_COURSE_IMAGE;
                        }
                      }}
                    />
                  </div>
                </div>
                
                {/* Informazioni del corso */}
                <div className="lg:w-2/3">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{course?.title}</h1>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#9e005c]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span className="text-gray-600">{lessons.length} Lezioni</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#9e005c]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span className="text-gray-600">{course?.duration_hours || 10} ore</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#9e005c]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span className="text-gray-600">{course?.level || 'Intermedio'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#9e005c]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span className="text-gray-600">{course?.language || 'Italiano'}</span>
                    </div>
                  </div>
                  
                  {/* Descrizione del corso */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrizione del corso</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {course?.description || `
                        Questo corso completo sul Finanziamento Aziendale ti fornirà una conoscenza approfondita 
                        dei principali strumenti e metodologie per finanziare la crescita della tua azienda. 
                        Dalla seconda rivoluzione digitale alle criptovalute, esplorerai tutte le opportunità 
                        di finanziamento disponibili per le imprese moderne.
                      `}
                    </p>
                  </div>
                  
                  {/* Docenti */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Docenti</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Alessandro Immobile Molaro</h4>
                        <a 
                          href="https://www.linkedin.com/in/alessandroimmobile/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[#9e005c] hover:text-[#c2185b] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          LinkedIn
                        </a>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Alberto Giusti</h4>
                        <a 
                          href="https://www.linkedin.com/in/albertogiusti/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[#9e005c] hover:text-[#c2185b] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          LinkedIn
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video di anteprima */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Anteprima del corso</h3>
              <div className="video-player-container">
                <VideoPlayer 
                  videoUrl={getVideoForLesson(lessons[0]?.id)?.url || null}
                  title={lessons[0]?.title || course?.title || 'Video del corso'}
                  className="w-full"
                />
              </div>
            </div>

            {/* Moduli del corso */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Moduli del corso</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessons.slice(0, 6).map((lesson) => (
                  <div key={lesson.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-[#9e005c] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {lesson.order}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{lesson.title}</h4>
                    </div>
                  </div>
                ))}
                {lessons.length > 6 && (
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      +{lessons.length - 6}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">e altri {lessons.length - 6} moduli</h4>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status del corso e iscrizione */}
            {isEnrolled ? (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Iscritto al corso</h3>
                      <p className="text-gray-600">Hai accesso completo a tutti i contenuti</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {lessons.length > 0 ? (
                      <Link
                        href={`/courses/${slug}/lesson/${lessons[0].id}`}
                        className="bg-[#9e005c] hover:bg-[#c2185b] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Inizia il corso
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                      >
                        Nessuna lezione disponibile
                      </button>
                    )}
                    <button 
                      onClick={() => setShowUnenrollModal(true)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Disiscriviti
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-[#9e005c] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Iscriviti al corso</h3>
                  <p className="text-gray-600 mb-6">
                    Accedi a tutti i {lessons.length} moduli, video, quiz e materiali didattici
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Prezzo del corso</span>
                      <span className="text-2xl font-bold text-[#9e005c]">€{course?.price}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleEnrollClick}
                    className="w-full bg-[#9e005c] hover:bg-[#c2185b] text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
                  >
                    Iscriviti ora
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    Accesso immediato • Nessun rinnovo automatico
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar destra */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              {/* Header corso */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  Contenuti del corso
                </h2>
                <p className="text-sm text-gray-600">{lessons.length} moduli disponibili</p>
              </div>

              {/* Progresso del corso */}
              {isEnrolled && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progresso</span>
                    <span className="text-sm text-gray-600">
                      {progress.filter(p => p.completed).length}/{lessons.length}
                    </span>
                  </div>
                  <div className="course-progress-bar">
                    <div className={`course-progress-fill ${getProgressClass()}`}></div>
                  </div>
                </div>
              )}

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
                      href={`/courses/${slug}/lesson/${lesson.id}`}
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