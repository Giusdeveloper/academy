'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { exportToCSV } from '@/lib/csv-export';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  category: string | null;
  level: string | null;
  language: string | null;
  duration_hours: number | null;
  ects_max: number | null;
  image_url: string | null;
  created_at: string;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
  });
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      params.append('limit', limit.toString());
      params.append('offset', ((page - 1) * limit).toString());

      const response = await fetch(`/api/admin/courses?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Errore nel caricamento corsi');
      }

      const data = await response.json();
      setCourses(data.courses || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchCourses();
  }, [filters, page]);

  const handleDelete = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Sei sicuro di voler eliminare il corso "${courseTitle}"?\n\nQuesta azione eliminerà anche tutte le lezioni associate.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/courses?id=${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Errore nell\'eliminazione');
      }

      fetchCourses();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore sconosciuto');
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      params.append('limit', '10000');

      const response = await fetch(`/api/admin/courses?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Errore nel recupero corsi per export');
      }

      const data = await response.json();
      const coursesToExport = data.courses || [];

      const csvData = coursesToExport.map((course: Course) => ({
        'ID': course.id,
        'Titolo': course.title,
        'Slug': course.slug,
        'Descrizione': course.description || '',
        'Prezzo': course.price ? `€${course.price.toFixed(2)}` : 'Gratuito',
        'Categoria': course.category || '',
        'Livello': course.level || '',
        'Lingua': course.language || '',
        'Durata (ore)': course.duration_hours || '',
        'ECTS Max': course.ects_max || '',
        'Data Creazione': new Date(course.created_at).toLocaleDateString('it-IT'),
      }));

      exportToCSV(csvData, `corsi-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore nell\'export');
    }
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '' });
    setPage(1);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestione Corsi</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
          >
            <span>📥</span>
            <span>Export CSV</span>
          </button>
          <Link
            href="/admin/courses/new"
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
          >
            <span>+</span>
            <span>Nuovo Corso</span>
          </Link>
        </div>
      </div>

      {/* Filtri */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtri</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cerca
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => {
                setFilters({ ...filters, search: e.target.value });
                setPage(1);
              }}
              placeholder="Titolo, descrizione, slug..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <input
              type="text"
              value={filters.category}
              onChange={(e) => {
                setFilters({ ...filters, category: e.target.value });
                setPage(1);
              }}
              placeholder="Categoria..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {(filters.search || filters.category) && (
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Cancella Filtri
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lista Corsi */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">Nessun corso trovato con i filtri selezionati.</p>
          <Link
            href="/admin/courses/new"
            className="text-pink-600 hover:text-pink-900 font-medium"
          >
            Crea il primo corso →
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Titolo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prezzo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Creazione
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Azioni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                        {course.description && (
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {course.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 font-mono">{course.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {course.price ? `€${course.price.toFixed(2)}` : 'Gratuito'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{course.category || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(course.created_at).toLocaleDateString('it-IT')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <Link
                            href={`/admin/courses/${course.id}/edit`}
                            className="text-pink-600 hover:text-pink-900"
                          >
                            Modifica
                          </Link>
                          <Link
                            href={`/admin/courses/${course.id}/lessons`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Lezioni
                          </Link>
                          <Link
                            href={`/courses/${course.slug}`}
                            className="text-green-600 hover:text-green-900"
                            target="_blank"
                          >
                            Visualizza
                          </Link>
                          <button
                            onClick={() => handleDelete(course.id, course.title)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Elimina
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginazione */}
          {total > limit && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} di {total}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Precedente
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page * limit >= total}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Successivo
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
