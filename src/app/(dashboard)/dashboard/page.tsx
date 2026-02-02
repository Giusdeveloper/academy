"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/config/supabase";
import type { User } from '@supabase/supabase-js';
import "./dashboard.css";

// Dichiarazione TypeScript per HubSpot
declare global {
  interface Window {
    hbspt: {
      forms: {
        create: (config: {
          portalId: string;
          formId: string;
          region: string;
          target: string;
        }) => void;
      };
    };
  }
}


// Interfaccia per i corsi dell'utente con progresso
interface UserCourse {
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
  progress: {
    total_lessons: number;
    completed_lessons: number;
    progress_percentage: number;
    last_accessed: string | null;
  };
}

// Interfaccia per le notifiche
interface Notification {
  id: string;
  message: string;
  type: 'enrollment' | 'progress' | 'reminder' | 'new_course';
  created_at: string;
}

export default function DashboardPage() {
  // Stato per l'utente autenticato
  const [user, setUser] = useState<User | null>(null);
  const [userCourses, setUserCourses] = useState<UserCourse[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  // Gestisce l'autenticazione dell'utente
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setUserLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Genera notifiche dinamiche basate sui dati dell'utente
  const generateNotifications = useCallback(async (userId: string) => {
    try {
      const notifications: Notification[] = [];

      // 1. Recupera gli ordini completati dell'utente
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          *,
          course:course_id (
            title
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'COMPLETED')
        .order('created_at', { ascending: false })
        .limit(2);

      if (orders && orders.length > 0) {
        orders.forEach((order: { id: string; created_at: string; course?: { title?: string } }) => {
          notifications.push({
            id: `enrollment-${order.id}`,
            message: `Sei stato iscritto al corso '${order.course?.title || 'Corso'}'`,
            type: 'enrollment',
            created_at: order.created_at
          });
        });
      }

      // 2. Recupera il progresso dell'utente
      const { data: progress } = await supabase
        .from('progress')
        .select(`
          *,
          course:course_id (
            title
          )
        `)
        .eq('user_id', userId)
        .eq('completed', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (progress && progress.length > 0) {
        progress.forEach((p: { id: string; created_at: string; course?: { title?: string } }) => {
          notifications.push({
            id: `progress-${p.id}`,
            message: `Hai completato una lezione del corso '${p.course?.title || 'Corso'}'`,
            type: 'progress',
            created_at: p.created_at
          });
        });
      }

      // 3. Aggiungi notifiche di sistema se non ci sono notifiche personali
      if (notifications.length === 0) {
        notifications.push({
          id: 'welcome-1',
          message: 'Benvenuto nella tua dashboard! Esplora i corsi disponibili.',
          type: 'reminder',
          created_at: new Date().toISOString()
        });
      }

      // 4. Aggiungi promemoria per completare il profilo se manca il nome
      if (user && !user.user_metadata?.name) {
        notifications.push({
          id: 'profile-reminder',
          message: 'Completa le informazioni del tuo profilo per una migliore esperienza',
          type: 'reminder',
          created_at: new Date().toISOString()
        });
      }

      setNotifications(notifications);
    } catch (error) {
      console.error('Errore nel generare le notifiche:', error);
      // Fallback con notifiche di base
      setNotifications([{
        id: 'welcome-fallback',
        message: 'Benvenuto nella tua dashboard!',
        type: 'reminder',
        created_at: new Date().toISOString()
      }]);
    } finally {
      setNotificationsLoading(false);
    }
  }, [user]);

  // Funzione per recuperare i corsi (esportata per poter essere chiamata manualmente)
  const fetchUserCourses = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
        // Recupera i corsi da due fonti:
        // 1. Ordini completati
        // 2. Corsi dove l'utente ha dei progressi (per includere corsi iscritti tramite Startup Award o altri metodi)
        
        const [ordersResult, progressResult] = await Promise.all([
          // Recupera gli ordini completati
          supabase
            .from('orders')
            .select(`
              course_id,
              course:course_id (
                id,
                slug,
                title,
                description,
                category,
                level,
                language,
                price,
                duration_hours,
                ects_max,
                image_url,
                created_at
              )
            `)
            .eq('user_id', user.id)
            .eq('status', 'COMPLETED'),
          
          // Recupera i corsi unici dove l'utente ha dei progressi
          supabase
            .from('progress')
            .select(`
              course_id,
              course:course_id (
                id,
                slug,
                title,
                description,
                category,
                level,
                language,
                price,
                duration_hours,
                ects_max,
                image_url,
                created_at
              )
            `)
            .eq('user_id', user.id)
        ]);

        if (ordersResult.error) throw ordersResult.error;
        if (progressResult.error) throw progressResult.error;

        // Combina i corsi da ordini e progressi, evitando duplicati

        type Course = {
          id: string;
          slug: string;
          title: string;
          description: string;
          category: string;
          level: string;
          language: string;
          price: number;
          duration_hours: number;
          ects_max: number;
          image_url: string;
          created_at: string;
        };

        type Order = {
          course_id: string;
          course: Course;
        };

        const courseIds = new Set<string>();
        const coursesMap = new Map<string, Course>();

        // Aggiungi corsi da ordini
        if (ordersResult.data) {
          (ordersResult.data as unknown as Order[]).forEach((order: Order) => {
            if (order.course && order.course.id) {
              courseIds.add(order.course.id);
              coursesMap.set(order.course.id, order.course);
            }
          });
        }

        // Aggiungi corsi da progressi (solo se non già presenti)
        if (progressResult.data) {
          (progressResult.data as Array<{ course_id: string; course: Course[] }>).forEach((progress) => {
            // progress.course is actually an array of Course, not a single Course object
            if (
              Array.isArray(progress.course) &&
              progress.course.length > 0
            ) {
              progress.course.forEach((course) => {
                if (
                  course &&
                  course.id &&
                  !courseIds.has(course.id)
                ) {
                  courseIds.add(course.id);
                  coursesMap.set(course.id, course);
                }
              });
            }
          });
        }

        if (coursesMap.size === 0) {
          setUserCourses([]);
          setLoading(false);
          return;
        }

        // Per ogni corso, calcola il progresso
        const coursesWithProgress = await Promise.all(
          Array.from(coursesMap.values()).map(async (course: Course) => {
            if (!course) return null;

            // Conta le lezioni totali del corso
            const { data: lessons, error: lessonsError } = await supabase
              .from('lessons')
              .select('id')
              .eq('course_id', course.id);

            if (lessonsError) throw lessonsError;

            // Conta le lezioni completate dall'utente
            const { data: progress, error: progressError } = await supabase
              .from('progress')
              .select('lesson_id')
              .eq('user_id', user.id)
              .eq('course_id', course.id)
              .eq('completed', true);

            if (progressError) throw progressError;

            const totalLessons = lessons?.length || 0;
            const completedLessons = progress?.length || 0;
            const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

            // Trova l'ultima lezione a cui l'utente ha avuto accesso
            const { data: lastAccess } = await supabase
              .from('progress')
              .select('last_accessed_at')
              .eq('user_id', user.id)
              .eq('course_id', course.id)
              .order('last_accessed_at', { ascending: false })
              .limit(1)
              .single();

            return {
              ...course,
              progress: {
                total_lessons: totalLessons,
                completed_lessons: completedLessons,
                progress_percentage: progressPercentage,
                last_accessed: lastAccess?.last_accessed_at || null
              }
            };
          })
        );

        // Filtra i corsi null e imposta lo stato
        const validCourses = coursesWithProgress.filter(course => course !== null) as UserCourse[];
        setUserCourses(validCourses);

      } catch (err) {
        console.error('Errore nel caricamento dei corsi dell\'utente:', err);
        setUserCourses([]);
      } finally {
        setLoading(false);
      }
  }, [user]);

  // Recupera i corsi quando l'utente cambia
  useEffect(() => {
    fetchUserCourses();
  }, [fetchUserCourses]);

  // Ascolta eventi personalizzati per aggiornare i corsi (es. quando si completa una lezione)
  useEffect(() => {
    const handleCourseUpdate = () => {
      console.log('🔄 Evento aggiornamento corso ricevuto, ricarico corsi...');
      fetchUserCourses();
    };

    // Ascolta eventi personalizzati
    window.addEventListener('courseUpdated', handleCourseUpdate);
    window.addEventListener('lessonCompleted', handleCourseUpdate);
    window.addEventListener('courseEnrolled', handleCourseUpdate);

    // Aggiorna quando la pagina torna in focus (utente torna alla dashboard)
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        console.log('👁️ Pagina tornata in focus, ricarico corsi...');
        fetchUserCourses();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('courseUpdated', handleCourseUpdate);
      window.removeEventListener('lessonCompleted', handleCourseUpdate);
      window.removeEventListener('courseEnrolled', handleCourseUpdate);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, fetchUserCourses]);

  // Genera notifiche quando l'utente è disponibile
  useEffect(() => {
    if (user) {
      generateNotifications(user.id);
    } else {
      setNotificationsLoading(false);
    }
  }, [user, generateNotifications]);

  // Carica e inizializza il form HubSpot
  useEffect(() => {
    const showFallbackMessage = () => {
      const container = document.getElementById('hubspot-form-container');
      if (container) {
        container.innerHTML = `
          <div class="text-center p-6 bg-gray-50 rounded-lg">
            <p class="text-gray-600 mb-4">Form temporaneamente non disponibile.</p>
            <p class="text-sm text-gray-500">Contatta il supporto per assistenza.</p>
          </div>
        `;
      }
    };

    const loadHubSpotForm = () => {
      // Controlla se HubSpot è già caricato
      if (window.hbspt && window.hbspt.forms) {
        try {
          window.hbspt.forms.create({
            portalId: "2689406",
            formId: "db3aee8f-27c8-40fb-ad16-815a5242d184",
            region: "na1",
            target: '#hubspot-form-container'
          });
        } catch (error) {
          console.warn('Errore nella creazione del form HubSpot (già caricato):', error);
          showFallbackMessage();
        }
        return;
      }

      // Carica lo script HubSpot se non è già presente
      const existingScript = document.querySelector('script[src*="js.hsforms.net"]');
      if (existingScript) {
        // Script già presente, aspetta che si carichi
        setTimeout(loadHubSpotForm, 100);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.hsforms.net/forms/embed/v2.js';
      script.charset = 'utf-8';
      script.type = 'text/javascript';
      script.async = true;
      
      script.onload = () => {
        // Aspetta un po' per assicurarsi che HubSpot sia completamente caricato
        setTimeout(() => {
          try {
            if (window.hbspt && window.hbspt.forms) {
              window.hbspt.forms.create({
                portalId: "2689406",
                formId: "db3aee8f-27c8-40fb-ad16-815a5242d184",
                region: "na1",
                target: '#hubspot-form-container'
              });
            } else {
              throw new Error('HubSpot non disponibile dopo il caricamento');
            }
          } catch (error) {
            // Non loggare errori se HubSpot è bloccato da ad-blocker
            const errorMessage = error?.toString() || '';
            if (!errorMessage.includes('ERR_BLOCKED_BY_CLIENT') && !errorMessage.includes('blocked')) {
              console.warn('Errore nella creazione del form HubSpot:', error);
            }
            showFallbackMessage();
          }
        }, 500);
      };

      script.onerror = (error) => {
        // Non loggare errori causati da ad-blocker (ERR_BLOCKED_BY_CLIENT)
        // Questi sono normali quando l'utente ha un ad-blocker attivo
        const errorMessage = error?.toString() || '';
        if (!errorMessage.includes('ERR_BLOCKED_BY_CLIENT')) {
          console.warn('Errore nel caricamento dello script HubSpot:', error);
        }
        showFallbackMessage();
      };


      document.head.appendChild(script);
    };

    // Aspetta che il DOM sia pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadHubSpotForm);
    } else {
      loadHubSpotForm();
    }

    return () => {
      // Cleanup non necessario per script esterni
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a1833]">
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-8">
          {userLoading ? (
            "Caricamento..."
          ) : user ? (
            `Benvenuto, ${user.user_metadata?.name || user.email?.split('@')[0] || 'Utente'}!`
          ) : (
            "Benvenuto!"
          )}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* My Courses */}
          <section className="md:col-span-2 bg-white rounded-2xl border border-[#e5eaf1] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#183a5a]">
                {userCourses.length > 0 ? "I Miei Corsi" : "I Nostri Corsi"}
              </h2>
              {user && (
                <button
                  onClick={() => {
                    setLoading(true);
                    fetchUserCourses();
                  }}
                  disabled={loading}
                  className="px-3 py-1.5 text-sm text-[#183a5a] border border-[#183a5a] rounded-lg hover:bg-[#183a5a] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Aggiorna lista corsi"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Aggiornamento...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Aggiorna
                    </span>
                  )}
                </button>
              )}
            </div>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-[#183a5a]">Caricamento corsi...</div>
              </div>
            ) : userCourses.length > 0 ? (
              <div className="flex flex-col md:flex-row gap-6">
                {userCourses.map((course, index) => (
                  <div key={course.id} className="flex-1 min-w-[180px] bg-[#f6fafd] rounded-xl overflow-hidden shadow border border-[#e5eaf1] flex flex-col">
                    <Image 
                      src={course.image_url || "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=400&h=128&q=80"}
                      alt={course.title} 
                      width={400}
                      height={128}
                      className="w-full h-32 object-cover"
                      priority={index === 0}
                    />
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="font-semibold text-[#183a5a] mb-2">{course.title}</div>
                      <div className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {course.description || 'Nessuna descrizione disponibile'}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>⏱️ {course.duration_hours || 0} ore</span>
                        <span>💰 €{course.price}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="progress-bar-container">
                          <div 
                            className={`progress-bar progress-${course.progress.progress_percentage}`}
                          ></div>
                        </div>
                        <span className="text-xs text-[#183a5a] font-medium min-w-[40px] text-right">
                          {course.progress.progress_percentage}% complete
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {course.progress.completed_lessons} di {course.progress.total_lessons} lezioni completate
                      </div>
                      {course.progress.last_accessed && (
                        <div className="text-xs text-gray-400 mt-1">
                          Ultimo accesso: {new Date(course.progress.last_accessed).toLocaleDateString('it-IT')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600 py-8">
                <div className="mb-4">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[#183a5a] mb-2">Non sei ancora iscritto a nessun corso</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Esplora i nostri corsi disponibili e inizia il tuo percorso di apprendimento.
                </p>
                <Link 
                  href="/courses" 
                  className="inline-flex items-center px-4 py-2 bg-[#183a5a] text-white rounded-lg hover:bg-[#0f2a42] transition-colors"
                >
                  Esplora i Corsi
                </Link>
              </div>
            )}
          </section>


          {/* Notifications */}
          <section className="bg-white rounded-2xl border border-[#e5eaf1] p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#183a5a] mb-4">Notifiche</h2>
            {notificationsLoading ? (
              <div className="flex justify-center items-center py-4">
                <div className="text-[#183a5a] text-sm">Caricamento notifiche...</div>
              </div>
            ) : notifications.length > 0 ? (
              <ul className="list-disc pl-5 space-y-3 text-[#183a5a] text-sm">
                {notifications.map((notification) => (
                  <li key={notification.id} className="leading-relaxed">
                    {notification.message}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-600 py-4">
                <p className="text-sm">Nessuna notifica al momento.</p>
              </div>
            )}
          </section>
        </div>

        {/* Contact Form */}
        <section className="bg-white rounded-2xl border border-[#e5eaf1] p-6 shadow-sm">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-[#183a5a] mb-4 text-center">Contattaci</h2>
            <div id="hubspot-form-container">
              <div className="text-center text-gray-600 py-4">
                Caricamento form...
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 