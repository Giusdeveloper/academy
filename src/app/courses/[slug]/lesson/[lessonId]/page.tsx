'use client';

import { supabase } from '@/config/supabase';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import LessonWithQuiz from '../../../../../components/LessonWithQuiz';
import LessonNavigation from '../../../../../components/LessonNavigation';
import ManualUnlockProvider from '../../../../../components/ManualUnlockProvider';
import UnlockButton from '../../../../../components/UnlockButton';

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
  const { slug, lessonId } = params as { slug: string; lessonId: string };
  
  const [lesson, setLesson] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [lessons, setLessons] = useState<LessonNavigation[]>([]);
  const [courseId, setCourseId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Prima recupero il corso dal slug per ottenere l'ID
        const { data: course, error: courseError } = await supabase
          .from('courses')
          .select('id')
          .eq('slug', slug)
          .single();

        if (courseError) throw courseError;
        if (!course) {
          router.push('/404');
          return;
        }

        setCourseId(course.id);

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
  }, [slug, lessonId, router]);


  // La logica di sblocco è ora gestita dal componente LessonNavigation

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
    <ManualUnlockProvider courseId={courseId}>
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
            <Link href={`/courses/${slug}`} className="breadcrumb-item">{lesson.courses.title}</Link>
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
                courseId={courseId}
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

              {/* Pulsante di sblocco manuale */}
              <div className="mb-4">
                <UnlockButton
                  currentLessonId={lessonId}
                  lessons={lessons || []}
                  onUnlock={(lessonOrder) => {
                    console.log(`🔓 Lezione ${lessonOrder} sbloccata!`);
                  }}
                />
              </div>

              {/* Lista lezioni */}
              <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                <LessonNavigation 
                  lessons={lessons || []}
                  currentLessonId={lessonId}
                  courseId={courseId}
                  baseUrl={`/courses/${slug}`}
                  onUnlockNext={() => {
                    // Funzione per sbloccare la prossima lezione
                    console.log('Sbloccando prossima lezione...');
                  }}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
      </div>
    </ManualUnlockProvider>
  );
} 