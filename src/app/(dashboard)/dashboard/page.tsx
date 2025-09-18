"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
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

// Interfaccia per i corsi
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
  const [courses, setCourses] = useState<Course[]>([]);
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

  // Recupera i corsi reali dal database
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .limit(3); // Mostra solo i primi 3 corsi

        if (error) throw error;
        setCourses(data || []);
      } catch (err) {
        console.error('Errore nel caricamento dei corsi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
    const loadHubSpotForm = () => {
      // Controlla se HubSpot è già caricato
      if (window.hbspt) {
        window.hbspt.forms.create({
          portalId: "2689406",
          formId: "db3aee8f-27c8-40fb-ad16-815a5242d184",
          region: "na1",
          target: '#hubspot-form-container'
        });
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
      script.src = '//js.hsforms.net/forms/embed/v2.js';
      script.charset = 'utf-8';
      script.type = 'text/javascript';
      script.async = true;
      
      script.onload = () => {
        // Aspetta un po' per assicurarsi che HubSpot sia completamente caricato
        setTimeout(() => {
          if (window.hbspt) {
            window.hbspt.forms.create({
              portalId: "2689406",
              formId: "db3aee8f-27c8-40fb-ad16-815a5242d184",
              region: "na1",
              target: '#hubspot-form-container'
            });
          }
        }, 500);
      };

      script.onerror = () => {
        console.error('Errore nel caricamento dello script HubSpot');
        // Mostra un messaggio di fallback
        const container = document.getElementById('hubspot-form-container');
        if (container) {
          container.innerHTML = '<p class="text-center text-gray-600">Form temporaneamente non disponibile. Riprova più tardi.</p>';
        }
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
            <h2 className="text-xl font-semibold text-[#183a5a] mb-4">I Nostri Corsi</h2>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-[#183a5a]">Caricamento corsi...</div>
              </div>
            ) : courses.length > 0 ? (
              <div className="flex flex-col md:flex-row gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="flex-1 min-w-[180px] bg-[#f6fafd] rounded-xl overflow-hidden shadow border border-[#e5eaf1] flex flex-col">
                    <Image 
                      src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=400&h=128&q=80"
                      alt={course.title} 
                      width={400}
                      height={128}
                      className="w-full h-32 object-cover" 
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
                          <div className="progress-bar progress-0"></div>
                        </div>
                        <span className="text-xs text-[#183a5a] font-medium min-w-[40px] text-right">0% complete</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600 py-8">
                Nessun corso disponibile al momento.
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