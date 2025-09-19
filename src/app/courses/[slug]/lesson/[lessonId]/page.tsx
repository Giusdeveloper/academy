import { createServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import LessonWithQuiz from '../../../../../components/LessonWithQuiz';

import './lesson.css';

// Definisco un'interfaccia per i dati delle lezioni usati nella navigazione
interface LessonNavigation {
  id: string;
  title: string;
  order: number;
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  // Await params come richiesto da Next.js 15
  const { slug, lessonId } = await params;
  const supabase = await createServerClient();

  // Prima recupero il corso dal slug per ottenere l'ID
  const { data: course } = await supabase
    .from('courses')
    .select('id')
    .eq('slug', slug)
    .single();

  if (!course) {
    notFound();
  }

  const courseId = course.id;

  // Recupera i dettagli della lezione
  const { data: lesson } = await supabase
    .from('lessons')
    .select('*, courses!inner(*)')
    .eq('id', lessonId)
    .single();

  if (!lesson) {
    notFound();
  }

  // Recupera i materiali associati alla lezione
  const { data: materials } = await supabase
    .from('materials')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('created_at', { ascending: true });

  // Recupera tutte le lezioni del corso per la navigazione
  const { data: lessonsData } = await supabase
    .from('lessons')
    .select('id, title, "order"') // Seleziono solo i campi necessari per la navigazione
    .eq('course_id', lesson.course_id)
    .order('order');

  // Uso l'interfaccia specifica per i dati di navigazione
  const lessons: LessonNavigation[] | null = lessonsData as LessonNavigation[] | null;


  // Funzione helper per determinare se una lezione è sbloccata
  const isLessonUnlocked = (lessonOrder: number) => {
    // Prima lezione sempre sbloccata
    if (lessonOrder === 1) return true;
    
    // Per le altre lezioni, controlla se la lezione precedente è completata
    // Questa logica deve essere implementata con il progresso dell'utente
    // Per ora, sblocchiamo solo la prima lezione
    return false;
  };

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
                      href={`/courses/${slug}/lesson/${l.id}`}
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