'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Resource } from '@/types/resources';
import { exportToCSV } from '@/lib/csv-export';

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    type: '',
    isActive: '',
  });

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.type) params.append('type', filters.type);
      if (filters.isActive) params.append('isActive', filters.isActive);

      const response = await fetch(`/api/admin/resources?${params.toString()}`);
      if (!response.ok) {
        const data = await response.json();
        if (data.error?.includes('non trovata') || data.error?.includes('does not exist')) {
          setError('Tabella resources non trovata nel database. Applicare la migrazione necessaria.');
          setResources([]);
          setLoading(false);
          return;
        }
        throw new Error(data.error || 'Errore nel caricamento risorse');
      }

      const data = await response.json();
      setResources(data.resources || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleDelete = async (resourceId: string, resourceTitle: string) => {
    if (!confirm(`Sei sicuro di voler eliminare la risorsa "${resourceTitle}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/resources?id=${resourceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Errore nell\'eliminazione');
      }

      fetchResources();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore sconosciuto');
    }
  };

  const handleToggleActive = async (resourceId: string, currentActive: boolean) => {
    try {
      const response = await fetch('/api/admin/resources', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: resourceId,
          is_active: !currentActive,
        }),
      });

      if (!response.ok) {
        throw new Error('Errore nell\'aggiornamento');
      }

      fetchResources();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore sconosciuto');
    }
  };

  const handleExport = () => {
    const csvData = resources.map((resource) => ({
      'ID': resource.id,
      'Titolo': resource.title,
      'Descrizione': resource.description || '',
      'Tipo': resource.type,
      'Categoria': resource.category,
      'URL File': resource.file_url,
      'URL Thumbnail': resource.thumbnail_url || '',
      'Dimensione File': resource.file_size || '',
      'Featured': resource.is_featured ? 'Sì' : 'No',
      'Premium': resource.is_premium ? 'Sì' : 'No',
      'Attiva': resource.is_active ? 'Sì' : 'No',
      'Tags': Array.isArray(resource.tags) ? resource.tags.join('; ') : '',
      'Autore': resource.author || '',
      'Lingua': resource.language,
      'Livello Difficoltà': resource.difficulty_level,
      'Tempo Stimato': resource.estimated_time || '',
      'Data Pubblicazione': resource.published_at
        ? new Date(resource.published_at).toLocaleString('it-IT')
        : '',
      'Data Creazione': resource.created_at
        ? new Date(resource.created_at).toLocaleString('it-IT')
        : '',
    }));

    exportToCSV(csvData, 'risorse');
  };

  // Gestione selezione
  const toggleSelect = (resourceId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(resourceId)) {
      newSelected.delete(resourceId);
    } else {
      newSelected.add(resourceId);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === resources.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(resources.map((r) => r.id)));
    }
  };

  // Operazioni bulk
  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete' | 'toggle-featured' | 'toggle-premium') => {
    if (selectedIds.size === 0) {
      alert('Seleziona almeno una risorsa');
      return;
    }

    const actionText = {
      activate: 'attivare',
      deactivate: 'disattivare',
      delete: 'eliminare',
      'toggle-featured': 'cambiare lo stato featured',
      'toggle-premium': 'cambiare lo stato premium',
    };

    if (!confirm(`Sei sicuro di voler ${actionText[action]} ${selectedIds.size} risorsa/e?`)) {
      return;
    }

    try {
      const idsArray = Array.from(selectedIds);
      
      if (action === 'delete') {
        // Eliminazione multipla
        await Promise.all(
          idsArray.map((id) =>
            fetch(`/api/admin/resources?id=${id}`, { method: 'DELETE' })
          )
        );
      } else {
        // Aggiornamento multiplo
        const updates = idsArray.map((id) => {
          const resource = resources.find((r) => r.id === id);
          if (!resource) return null;

          const updateData: { id: string; is_active?: boolean; is_featured?: boolean; is_premium?: boolean } = { id };
          switch (action) {
            case 'activate':
              updateData.is_active = true;
              break;
            case 'deactivate':
              updateData.is_active = false;
              break;
            case 'toggle-featured':
              updateData.is_featured = !resource.is_featured;
              break;
            case 'toggle-premium':
              updateData.is_premium = !resource.is_premium;
              break;
          }
          return updateData;
        }).filter((item): item is { id: string; is_active?: boolean; is_featured?: boolean; is_premium?: boolean } => item !== null);

        await Promise.all(
          updates.map((update) =>
            fetch('/api/admin/resources', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(update),
            })
          )
        );
      }

      setSelectedIds(new Set());
      fetchResources();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore nell\'operazione bulk');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestione Risorse</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
          >
            <span>📥</span>
            <span>Export CSV</span>
          </button>
          <Link
            href="/admin/resources/new"
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            + Nuova Risorsa
          </Link>
        </div>
      </div>

      {/* Filtri */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtri</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cerca
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Titolo, descrizione..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Tutte</option>
              <option value="finanza">Finanza</option>
              <option value="startup">Startup</option>
              <option value="investimenti">Investimenti</option>
              <option value="marketing">Marketing</option>
              <option value="legal">Legal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Tutti</option>
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="template">Template</option>
              <option value="guide">Guide</option>
              <option value="tool">Tool</option>
              <option value="ebook">Ebook</option>
              <option value="checklist">Checklist</option>
              <option value="presentation">Presentation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stato
            </label>
            <select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Tutti</option>
              <option value="true">Attive</option>
              <option value="false">Nascoste</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista Risorse */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">Nessuna risorsa presente.</p>
          <Link
            href="/admin/resources/new"
            className="text-pink-500 hover:text-pink-600 font-semibold"
          >
            Crea la prima risorsa →
          </Link>
        </div>
      ) : (
        <>
          {/* Barra azioni bulk */}
          {selectedIds.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedIds.size} risorsa/e selezionata/e
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  >
                    Attiva
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                  >
                    Disattiva
                  </button>
                  <button
                    onClick={() => handleBulkAction('toggle-featured')}
                    className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                  >
                    Toggle Featured
                  </button>
                  <button
                    onClick={() => handleBulkAction('toggle-premium')}
                    className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
                  >
                    Toggle Premium
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Elimina
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Annulla
              </button>
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === resources.length && resources.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titolo
                  </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
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
              {resources.map((resource) => (
                <tr
                  key={resource.id}
                  className={`hover:bg-gray-50 ${selectedIds.has(resource.id) ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(resource.id)}
                      onChange={() => toggleSelect(resource.id)}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                    {resource.is_featured && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                        Featured
                      </span>
                    )}
                    {resource.is_premium && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 mt-1 ml-1">
                        Premium
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{resource.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{resource.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(resource.id, resource.is_active)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        resource.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {resource.is_active ? 'Attiva' : 'Nascosta'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/admin/resources/${resource.id}/edit`}
                        className="text-pink-600 hover:text-pink-900"
                      >
                        Modifica
                      </Link>
                      <button
                        onClick={() => handleDelete(resource.id, resource.title)}
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
        </>
      )}
    </div>
  );
}

