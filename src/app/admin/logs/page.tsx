'use client';

import { useEffect, useState, useCallback } from 'react';
import { exportToCSV } from '@/lib/csv-export';

interface AdminLog {
  id: string;
  admin_id: string;
  admin_email: string;
  admin_name: string | null;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  description: string;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    actionType: '',
    entityType: '',
    adminEmail: '',
    startDate: '',
    endDate: '',
  });
  const [page, setPage] = useState(1);
  const limit = 50;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.actionType) params.append('actionType', filters.actionType);
      if (filters.entityType) params.append('entityType', filters.entityType);
      if (filters.adminEmail) params.append('adminEmail', filters.adminEmail);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('limit', limit.toString());
      params.append('offset', ((page - 1) * limit).toString());

      const response = await fetch(`/api/admin/logs?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Errore nel caricamento log');
      }

      const data = await response.json();
      setLogs(data.logs || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionTypeLabel = (actionType: string) => {
    const labels: Record<string, string> = {
      CREATE: 'Crea',
      UPDATE: 'Aggiorna',
      DELETE: 'Elimina',
      ACTIVATE: 'Attiva',
      DEACTIVATE: 'Disattiva',
      TOGGLE_FEATURED: 'Toggle Featured',
      TOGGLE_PREMIUM: 'Toggle Premium',
      RESET_PROGRESS: 'Reset Progressi',
      CHANGE_ROLE: 'Cambia Ruolo',
      BULK_ACTION: 'Azione Bulk',
      EXPORT: 'Export',
      OTHER: 'Altro',
    };
    return labels[actionType] || actionType;
  };

  const getEntityTypeLabel = (entityType: string) => {
    const labels: Record<string, string> = {
      EVENT: 'Evento',
      RESOURCE: 'Risorsa',
      COURSE: 'Corso',
      USER: 'Utente',
      STARTUP_AWARD: 'Startup Award',
      LESSON: 'Lezione',
      ORDER: 'Ordine',
      SYSTEM: 'Sistema',
      OTHER: 'Altro',
    };
    return labels[entityType] || entityType;
  };

  const getActionTypeColor = (actionType: string) => {
    const colors: Record<string, string> = {
      CREATE: 'bg-green-100 text-green-800',
      UPDATE: 'bg-blue-100 text-blue-800',
      DELETE: 'bg-red-100 text-red-800',
      ACTIVATE: 'bg-green-100 text-green-800',
      DEACTIVATE: 'bg-gray-100 text-gray-800',
      RESET_PROGRESS: 'bg-yellow-100 text-yellow-800',
      CHANGE_ROLE: 'bg-purple-100 text-purple-800',
      BULK_ACTION: 'bg-indigo-100 text-indigo-800',
      EXPORT: 'bg-teal-100 text-teal-800',
    };
    return colors[actionType] || 'bg-gray-100 text-gray-800';
  };

  const handleExport = async () => {
    try {
      // Recupera tutti i log per l'export (senza paginazione)
      const params = new URLSearchParams();
      if (filters.actionType) params.append('actionType', filters.actionType);
      if (filters.entityType) params.append('entityType', filters.entityType);
      if (filters.adminEmail) params.append('adminEmail', filters.adminEmail);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('limit', '10000');

      const response = await fetch(`/api/admin/logs?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Errore nel recupero log per export');
      }

      const data = await response.json();
      const logsToExport = data.logs || [];

      // Prepara i dati per il CSV
      const csvData = logsToExport.map((log: AdminLog) => ({
        Data: formatDate(log.created_at),
        Admin: log.admin_name || log.admin_email,
        Email: log.admin_email,
        'Tipo Azione': getActionTypeLabel(log.action_type),
        'Tipo Entità': getEntityTypeLabel(log.entity_type),
        'ID Entità': log.entity_id || '',
        Descrizione: log.description,
        Dettagli: log.details ? JSON.stringify(log.details) : '',
        'IP Address': log.ip_address || '',
      }));

      exportToCSV(csvData, `admin-logs-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore nell\'export');
    }
  };

  const clearFilters = () => {
    setFilters({
      actionType: '',
      entityType: '',
      adminEmail: '',
      startDate: '',
      endDate: '',
    });
    setPage(1);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Log Azioni Admin</h1>
        <button
          onClick={handleExport}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
        >
          <span>📥</span>
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filtri */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtri</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo Azione
            </label>
            <select
              value={filters.actionType}
              onChange={(e) => {
                setFilters({ ...filters, actionType: e.target.value });
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Tutte</option>
              <option value="CREATE">Crea</option>
              <option value="UPDATE">Aggiorna</option>
              <option value="DELETE">Elimina</option>
              <option value="ACTIVATE">Attiva</option>
              <option value="DEACTIVATE">Disattiva</option>
              <option value="RESET_PROGRESS">Reset Progressi</option>
              <option value="CHANGE_ROLE">Cambia Ruolo</option>
              <option value="BULK_ACTION">Azione Bulk</option>
              <option value="EXPORT">Export</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo Entità
            </label>
            <select
              value={filters.entityType}
              onChange={(e) => {
                setFilters({ ...filters, entityType: e.target.value });
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Tutte</option>
              <option value="EVENT">Evento</option>
              <option value="RESOURCE">Risorsa</option>
              <option value="COURSE">Corso</option>
              <option value="USER">Utente</option>
              <option value="STARTUP_AWARD">Startup Award</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Admin
            </label>
            <input
              type="text"
              value={filters.adminEmail}
              onChange={(e) => {
                setFilters({ ...filters, adminEmail: e.target.value });
                setPage(1);
              }}
              placeholder="Cerca per email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Inizio
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => {
                setFilters({ ...filters, startDate: e.target.value });
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Fine
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => {
                setFilters({ ...filters, endDate: e.target.value });
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        {(filters.actionType ||
          filters.entityType ||
          filters.adminEmail ||
          filters.startDate ||
          filters.endDate) && (
          <button
            onClick={clearFilters}
            className="mt-4 text-sm text-pink-600 hover:text-pink-800"
          >
            Cancella Filtri
          </button>
        )}
      </div>

      {/* Lista Log */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Nessun log trovato con i filtri selezionati.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data/Ora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Azione
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entità
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrizione
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(log.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {log.admin_name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">{log.admin_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionTypeColor(
                            log.action_type
                          )}`}
                        >
                          {getActionTypeLabel(log.action_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getEntityTypeLabel(log.entity_type)}
                        </div>
                        {log.entity_id && (
                          <div className="text-xs text-gray-500 font-mono">
                            {log.entity_id.substring(0, 8)}...
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{log.description}</div>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <details className="mt-1">
                            <summary className="text-xs text-gray-500 cursor-pointer">
                              Dettagli
                            </summary>
                            <pre className="text-xs text-gray-400 mt-1 p-2 bg-gray-50 rounded overflow-auto max-w-md">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ip_address || 'N/A'}
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

