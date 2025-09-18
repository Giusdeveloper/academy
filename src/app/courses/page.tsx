'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import Image from 'next/image';
import Link from 'next/link';
import './courses.css';

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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      console.log('Tentativo di connessione...');

      // Query base
      const { data, error } = await supabase
        .from('courses')
        .select('*');

      console.log('Risposta Supabase:', { 
        dataLength: data?.length || 0,
        courses: data?.map(course => ({
          title: course.title,
          image_url: course.image_url
        }))
      });

      if (error) {
        console.error('Errore Supabase:', error);
        throw new Error(`Errore Supabase: ${error.message}`);
      }

      setCourses(data || []);
    } catch (err: unknown) {
      console.error('Errore completo:', err);
      setError((err as Error).message || 'Errore nel caricamento dei corsi');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1833] flex items-center justify-center">
        <div className="text-white text-xl">Caricamento corsi...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a1833] flex items-center justify-center">
        <div className="text-red-400 text-xl max-w-2xl text-center">
          {error}
          <br />
          <span className="text-sm mt-4 block text-gray-300">
            Verifica che:
            <br />1. Le credenziali Supabase siano corrette
            <br />2. La tabella &quot;courses&quot; esista
            <br />3. La tabella abbia almeno un record pubblicato
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1833]">
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-8">I Nostri Corsi</h1>
        
        {courses.length === 0 ? (
          <div className="text-center text-gray-300">
            Nessun corso disponibile al momento.
            <br />
            <span className="text-sm mt-2 block">
              Verifica di aver inserito dei corsi nella tabella &quot;courses&quot; di Supabase e che siano pubblicati.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl border border-[#e5eaf1] overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="aspect-video relative">
                  <Image 
                    src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=400&h=225&q=80" 
                    alt={course.title}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                    onError={() => {
                      console.log(`❌ Errore caricamento immagine per: ${course.title}`);
                    }}
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-[#183a5a] mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description || 'Nessuna descrizione disponibile'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#9E005C] font-semibold text-xl">€{course.price}</span>
                    <Link 
                      href={`/courses/products/${course.id}`} 
                      className="bg-[#9E005C] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#7a0046] transition inline-block text-center"
                    >
                      Iscriviti
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3 className="footer-title">Academy Imment</h3>
            <div className="footer-imment-logo">
              <Image 
                src="/Imment - logo - web_orizzontale - colori - chiaro.png"
                alt="Imment Logo"
                width={120}
                height={40}
                className="imment-logo"
              />
            </div>
          </div>
          
          <div className="footer-info">
            <p>Imment S.r.l.</p>
            <p>Partita Iva 12804470016</p>
            <p>Sede Operativa: Piazza Teresa Noce 17/D - 10155 Torino</p>
            <div className="footer-links">
              <Link href="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 