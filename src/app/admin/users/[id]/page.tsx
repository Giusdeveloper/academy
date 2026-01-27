'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface UserStats {
  user: {
    id: string;
    email: string;
    name: string | null;
    last_name: string | null;
    role: 'USER' | 'ADMIN' | 'MODERATOR';
    created_at: string;
  };
  stats: {
    coursesCompleted: number;
    totalEnrolled: number;
    ordersCount: number;
    startupAward: {
      phase1_completed_at: string | null;
      phase2_completed_at: string | null;
    } | null;
  };
}

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  const [data, setData] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserStats();
  }, [userId]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/stats`);
      if (!response.ok) {
        throw new Error('Errore nel caricamento dati utente');
      }
      const userData = await response.json();
      setData(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600">{error || 'Utente non trovato'}</p>
        </div>
        <Link
          href="/admin/users"
          className="text-pink-500 hover:text-pink-600 font-medium"
        >
          ← Torna alla lista
        </Link>
      </div>
    );
  }

  const { user, stats } = data;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dettagli Utente</h1>
        <Link
          href="/admin/users"
          className="text-gray-600 hover:text-gray-900 font-medium"
        >
          ← Torna alla lista
        </Link>
      </div>

      {/* Informazioni Utente */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Informazioni Utente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Nome</label>
            <p className="text-lg text-gray-900">
              {user.name && user.last_name
                ? `${user.name} ${user.last_name}`
                : user.name || '-'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <p className="text-lg text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Ruolo</label>
            <p className="text-lg text-gray-900">{user.role}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Registrato il</label>
            <p className="text-lg text-gray-900">
              {new Date(user.created_at).toLocaleString('it-IT')}
            </p>
          </div>
        </div>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Corsi Completati</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.coursesCompleted}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-2xl">
              ✅
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Corsi Iscritti</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEnrolled}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl">
              📚
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ordini</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.ordersCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-2xl">
              🛒
            </div>
          </div>
        </div>
      </div>

      {/* Startup Award Progress */}
      {stats.startupAward && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Startup Award Progress</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Fase Corrente:</span>
              <span className="font-semibold text-gray-900">
                {stats.startupAward.phase2_completed_at ? 'Fase 2 Completata' : 
                 stats.startupAward.phase1_completed_at ? 'Fase 2' : 'Fase 1'}
              </span>
            </div>
            {stats.startupAward.phase1_completed_at && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completato Fase 1:</span>
                <span className="text-sm text-green-600 font-medium">
                  {new Date(stats.startupAward.phase1_completed_at).toLocaleString('it-IT')}
                </span>
              </div>
            )}
            {stats.startupAward.phase2_completed_at && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completato Fase 2:</span>
                <span className="text-sm text-green-600 font-medium">
                  {new Date(stats.startupAward.phase2_completed_at).toLocaleString('it-IT')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

