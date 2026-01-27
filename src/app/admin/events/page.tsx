'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Event } from '@/lib/events';
import { exportToCSV } from '@/lib/csv-export';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events');
      if (!response.ok) {
        throw new Error('Errore nel caricamento eventi');
      }
      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (eventId: string, currentActive: boolean) => {
    try {
      const response = await fetch('/api/admin/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: eventId,
          active: !currentActive,
        }),
      });

      if (!response.ok) {
        throw new Error('Errore nell\'aggiornamento');
      }

      // Ricarica gli eventi
      fetchEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore sconosciuto');
    }
  };

  const handleDelete = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Sei sicuro di voler eliminare l'evento "${eventTitle}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/events?id=${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Errore nell\'eliminazione');
      }

      // Ricarica gli eventi
      fetchEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore sconosciuto');
    }
  };

  const handleExport = () => {
    const csvData = events.map((event) => ({
      'ID': event.id,
      'Titolo': event.title,
      'Partner': event.partner,
      'Descrizione': event.description || '',
      'Data': event.date,
      'Location': event.location,
      'Prezzo Biglietto': event.ticketPrice,
      'URL Biglietto': event.ticketUrl,
      'Featured': event.featured ? 'Sì' : 'No',
      'Attivo': event.active ? 'Sì' : 'No',
    }));

    exportToCSV(csvData, 'eventi');
  };

  // Gestione selezione
  const toggleSelect = (eventId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(eventId)) {
      newSelected.delete(eventId);
    } else {
      newSelected.add(eventId);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === events.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(events.map((e) => e.id)));
    }
  };

  // Operazioni bulk
  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete' | 'toggle-featured') => {
    if (selectedIds.size === 0) {
      alert('Seleziona almeno un evento');
      return;
    }

    const actionText = {
      activate: 'attivare',
      deactivate: 'disattivare',
      delete: 'eliminare',
      'toggle-featured': 'cambiare lo stato featured',
    };

    if (!confirm(`Sei sicuro di voler ${actionText[action]} ${selectedIds.size} evento/i?`)) {
      return;
    }

    try {
      const idsArray = Array.from(selectedIds);
      
      if (action === 'delete') {
        // Eliminazione multipla
        await Promise.all(
          idsArray.map((id) =>
            fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' })
          )
        );
      } else {
        // Aggiornamento multiplo
        const updates = idsArray.map((id) => {
          const event = events.find((e) => e.id === id);
          if (!event) return null;

          const updateData: { id: string; active?: boolean; featured?: boolean } = { id };
          switch (action) {
            case 'activate':
              updateData.active = true;
              break;
            case 'deactivate':
              updateData.active = false;
              break;
            case 'toggle-featured':
              updateData.featured = !event.featured;
              break;
          }
          return updateData;
        }).filter((item): item is { id: string; active?: boolean; featured?: boolean } => item !== null);

        await Promise.all(
          updates.map((update) =>
            fetch('/api/admin/events', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(update),
            })
          )
        );
      }

      setSelectedIds(new Set());
      fetchEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore nell\'operazione bulk');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestione Eventi</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
          >
            <span>📥</span>
            <span>Export CSV</span>
          </button>
          <Link
            href="/admin/events/new"
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            + Nuovo Evento
          </Link>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">Nessun evento presente.</p>
          <Link
            href="/admin/events/new"
            className="text-pink-500 hover:text-pink-600 font-semibold"
          >
            Crea il primo evento →
          </Link>
        </div>
      ) : (
        <>
          {/* Barra azioni bulk */}
          {selectedIds.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedIds.size} evento/i selezionato/i
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
                      checked={selectedIds.size === events.length && events.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titolo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
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
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className={`hover:bg-gray-50 ${selectedIds.has(event.id) ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(event.id)}
                        onChange={() => toggleSelect(event.id)}
                        className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    {event.featured && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{event.partner}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{event.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(event.id, event.active)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        event.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {event.active ? 'Attivo' : 'Nascosto'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/admin/events/${event.id}/edit`}
                        className="text-pink-600 hover:text-pink-900"
                      >
                        Modifica
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id, event.title)}
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

