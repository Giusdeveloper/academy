'use client';

import { useEffect, useState, useCallback } from 'react';
import { exportToCSV } from '@/lib/csv-export';

interface Completion {
  id: string;
  user_email: string;
  course_id: string;
  phase1_enrolled_at: string | null;
  phase1_completed_at: string | null;
  current_phase: number;
  status: string;
  created_at: string;
  updated_at: string;
  courses: {
    id: string;
    title: string;
    slug: string;
  } | null;
  user: {
    id: string;
    name: string | null;
    last_name: string | null;
    email: string;
  } | null;
}

interface Stats {
  totalCompletions: number;
  totalEnrolled: number;
  recentCompletions: number;
}

export default function AdminStartupAwardPage() {
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCompletions: 0,
    totalEnrolled: 0,
    recentCompletions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtri
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    userEmail: '',
    status: '', // 'completed' | 'enrolled' | ''
  });

  const fetchCompletions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.userEmail) params.append('userEmail', filters.userEmail);
      if (filters.status) params.append('status', filters.status);

      const response = await fetch(`/api/admin/startup-award?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Errore nel caricamento completamenti');
      }

      const data = await response.json();
      setCompletions(data.completions || []);
      setStats(data.stats || { totalCompletions: 0, totalEnrolled: 0, recentCompletions: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCompletions();
  }, [fetchCompletions]);

  const handleResetProgress = async (completionId: string, userEmail: string, courseId: string) => {
    if (!confirm(`Sei sicuro di voler resettare i progressi per ${userEmail}?\n\nQuesta azione eliminerà tutti i progressi del corso e resetterà lo stato Startup Award.`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/startup-award/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          courseId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Errore nel reset');
      }

      alert('Progressi resettati con successo!');
      fetchCompletions(); // Ricarica la lista
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore sconosciuto');
    }
  };

  const handleExport = () => {
    // Prepara i dati per l'export
    const csvData = completions.map((c) => ({
      'Email': c.user_email,
      'Nome': c.user?.name || '',
      'Cognome': c.user?.last_name || '',
      'Corso': c.courses?.title || '',
      'Iscritto il': c.phase1_enrolled_at 
        ? new Date(c.phase1_enrolled_at).toLocaleString('it-IT')
        : '',
      'Completato il': c.phase1_completed_at
        ? new Date(c.phase1_completed_at).toLocaleString('it-IT')
        : 'Non completato',
      'Fase Corrente': c.current_phase,
      'Stato': c.status,
    }));

    exportToCSV(csvData, 'startup-award-completions');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Monitoraggio Startup Award</h1>
        <button
          onClick={handleExport}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Totale Iscritti</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEnrolled}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl">
              👥
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completamenti Fase 1</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCompletions}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-2xl">
              ✅
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completamenti Recenti</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.recentCompletions}</p>
              <p className="text-xs text-gray-500 mt-1">Ultimi 7 giorni</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center text-2xl">
              🆕
            </div>
          </div>
        </div>
      </div>

      {/* Filtri */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtri</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Utente
            </label>
            <input
              type="text"
              value={filters.userEmail}
              onChange={(e) => setFilters({ ...filters, userEmail: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Cerca per email..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Da Data
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              A Data
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stato
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Tutti</option>
              <option value="completed">Completati</option>
              <option value="enrolled">Solo Iscritti</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista Completamenti */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      ) : completions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">Nessun completamento trovato.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Corso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Iscritto il
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completato il
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {completions.map((completion) => (
                <tr key={completion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {completion.user?.name && completion.user?.last_name
                        ? `${completion.user.name} ${completion.user.last_name}`
                        : completion.user_email}
                    </div>
                    <div className="text-sm text-gray-500">{completion.user_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {completion.courses?.title || 'Corso non trovato'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(completion.phase1_enrolled_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {completion.phase1_completed_at ? (
                        <span className="text-green-600 font-medium">
                          {formatDate(completion.phase1_completed_at)}
                        </span>
                      ) : (
                        <span className="text-gray-400">Non completato</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        completion.phase1_completed_at
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {completion.phase1_completed_at ? 'Completato' : 'In Corso'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleResetProgress(completion.id, completion.user_email, completion.course_id)}
                      className="text-red-600 hover:text-red-900"
                      title="Reset progressi utente"
                    >
                      Reset
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

