'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Profile = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  email: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        // Carica il profilo dell'utente
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setProfile(profile);
          setFormData({
            full_name: profile.full_name || '',
            avatar_url: profile.avatar_url || '',
          });
        }
      } catch (error) {
        console.error('Errore nel caricamento del profilo:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Aggiorna lo stato locale
      setProfile(prev => prev ? {
        ...prev,
        full_name: formData.full_name,
        avatar_url: formData.avatar_url,
      } : null);

      alert('Profilo aggiornato con successo!');
    } catch (error) {
      console.error('Errore nell\'aggiornamento del profilo:', error);
      alert('Si è verificato un errore durante l\'aggiornamento del profilo.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Caricamento...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Modifica Profilo</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={profile?.email || ''}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
              />
              <p className="mt-1 text-sm text-gray-500">
                L&apos;email non può essere modificata
              </p>
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <input
                type="text"
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700">
                URL Avatar
              </label>
              <input
                type="url"
                id="avatar_url"
                value={formData.avatar_url}
                onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Inserisci l&apos;URL di un&apos;immagine per il tuo avatar
              </p>
            </div>

            {formData.avatar_url && (
              <div className="flex items-center space-x-4">
                <Image
                  src={formData.avatar_url}
                  alt="Anteprima avatar"
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <p className="text-sm text-gray-500">Anteprima avatar</p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {updating ? 'Salvataggio...' : 'Salva Modifiche'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 