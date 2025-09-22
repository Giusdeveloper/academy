'use client';

import { supabase } from '@/config/supabase';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import LessonWithQuiz from '../../../../../../components/LessonWithQuiz';

import './lesson.css';



// Definisco un'interfaccia per i dati delle lezioni usati nella navigazione
interface LessonNavigation {
  id: string;
  title: string;
  order: number;
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { id, lessonId } = params as { id: string; lessonId: string };
  
  const [lesson, setLesson] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [lessons, setLessons] = useState<LessonNavigation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Recupera i dettagli della lezione
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*, courses!inner(*)')
          .eq('id', lessonId)
          .single();

        if (lessonError) throw lessonError;
        if (!lessonData) {
          router.push('/404');
          return;
        }

        setLesson(lessonData);

        // Recupera i materiali associati alla lezione
        const { data: materialsData, error: materialsError } = await supabase
          .from('materials')
          .select('*')
          .eq('lesson_id', lessonId)
          .order('created_at', { ascending: true });

        if (materialsError) throw materialsError;
        setMaterials(materialsData || []);

        // Recupera tutte le lezioni del corso per la navigazione
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('id, title, "order"')
          .eq('course_id', lessonData.course_id)
          .order('order');

        if (lessonsError) throw lessonsError;
        setLessons(lessonsData as LessonNavigation[] || []);

      } catch (err) {
        console.error('Errore nel caricamento dei dati:', err);
        setError(err instanceof Error ? err.message : 'Errore nel caricamento');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonId, router]);


  // Funzione helper per determinare se una lezione è sbloccata
  const isLessonUnlocked = (lessonOrder: number) => {
    // Prima lezione sempre sbloccata
    if (lessonOrder === 1) return true;
    
    // Per le altre lezioni, controlla se la lezione precedente è completata
    // Questa logica è gestita dal componente LessonNavigation con useLessonProgress
    // Per ora, sblocchiamo solo la prima lezione
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9e005c] mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento lezione...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌ Errore</div>
          <p className="text-gray-600 mb-4">{error || 'Lezione non trovata'}</p>
          <Link 
            href="/courses" 
            className="bg-[#9e005c] text-white px-6 py-2 rounded-lg hover:bg-[#7a0046] transition-colors"
          >
            Torna ai Corsi
          </Link>
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
            <span className="breadcrumb-item">{lesson.courses.category || 'Corso'}</span>
            <span className="breadcrumb-separator">/</span>
            <Link href={`/courses/products/${id}`} className="breadcrumb-item">{lesson.courses.title}</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="text-gray-900 font-medium">{lesson.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenuto principale */}
          <div className="lg:col-span-3">
            {/* Contenuto della lezione con quiz */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
              <LessonWithQuiz
                lesson={lesson}
                materials={materials || []}
                courseId={id}
              />
            </div>

          </div>

          {/* Sidebar destra */}
          <div className="lg:col-span-1">
            <div className="lesson-sidebar p-6 sticky top-8">
              {/* Header modulo */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  {lesson.courses.title}
                </h2>
                <p className="text-sm text-gray-600">{lessons?.length || 0} Lezioni</p>
              </div>

              {/* Lista lezioni */}
              <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                
                {lessons?.map((l, index) => {
                  const isUnlocked = isLessonUnlocked(l.order);
                  const isClickable = isUnlocked;
                  
                  const LessonContent = () => (
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        l.id === lessonId
                          ? 'bg-white text-[#9e005c]'
                          : !isUnlocked
                          ? 'bg-gray-300 text-gray-500'
                          : index === 0 
                          ? 'bg-white text-[#9e005c]' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {l.order}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium text-sm leading-tight truncate ${
                          l.id === lessonId 
                            ? 'text-white' 
                            : !isUnlocked
                            ? 'text-gray-400'
                            : 'text-gray-900'
                        }`}>
                          {l.title}
                        </h3>
                      </div>
                      {l.id === lessonId && (
                        <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                      )}
                      {!isUnlocked && (
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </div>
                  );

                  return isClickable ? (
                    <Link
                      key={l.id}
                      href={`/courses/products/${id}/lesson/${l.id}`}
                      className={`lesson-item block ${
                        l.id === lessonId ? 'active' : ''
                      }`}
                    >
                      <LessonContent />
                    </Link>
                  ) : (
                    <div
                      key={l.id}
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
    </div>
  );
}
