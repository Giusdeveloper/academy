import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/config/supabase';
import { 
  Resource, 
  ResourceFilters, 
  ResourceSortOptions, 
  ResourcesResponse,
  ResourceStats,
  CreateResourceData,
  UpdateResourceData
} from '@/types/resources';

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carica tutte le risorse
  const fetchResources = useCallback(async (
    filters?: ResourceFilters,
    sort?: ResourceSortOptions,
    page: number = 1,
    pageSize: number = 12
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Verifica se la tabella esiste
      const { data: tableCheck, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'resources')
        .single();

      if (tableError || !tableCheck) {
        console.warn('Tabella resources non trovata. Applicare la migrazione del database.');
        return {
          resources: [],
          total_count: 0,
          page: 1,
          page_size: pageSize,
          total_pages: 0
        } as ResourcesResponse;
      }

      let query = supabase
        .from('resources')
        .select('*')
        .eq('is_active', true);

      // Applica filtri
      if (filters) {
        if (filters.type && filters.type.length > 0) {
          query = query.in('type', filters.type);
        }
        if (filters.category && filters.category.length > 0) {
          query = query.in('category', filters.category);
        }
        if (filters.difficulty_level && filters.difficulty_level.length > 0) {
          query = query.in('difficulty_level', filters.difficulty_level);
        }
        if (filters.language) {
          query = query.eq('language', filters.language);
        }
        if (filters.is_featured !== undefined) {
          query = query.eq('is_featured', filters.is_featured);
        }
        if (filters.is_premium !== undefined) {
          query = query.eq('is_premium', filters.is_premium);
        }
        if (filters.tags && filters.tags.length > 0) {
          query = query.overlaps('tags', filters.tags);
        }
        if (filters.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }
      }

      // Applica ordinamento
      if (sort) {
        query = query.order(sort.field, { ascending: sort.direction === 'asc' });
      } else {
        query = query.order('published_at', { ascending: false });
      }

      // Applica paginazione
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        throw fetchError;
      }

      return {
        resources: data || [],
        total_count: count || 0,
        page,
        page_size: pageSize,
        total_pages: Math.ceil((count || 0) / pageSize)
      } as ResourcesResponse;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore nel caricamento delle risorse';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Carica risorse featured
  const fetchFeaturedResources = useCallback(async (limit: number = 6) => {
    try {
      setLoading(true);
      setError(null);

      // Verifica se la tabella esiste
      const { data: tableCheck, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'resources')
        .single();

      if (tableError || !tableCheck) {
        console.warn('Tabella resources non trovata. Applicare la migrazione del database.');
        return [];
      }

      const { data, error: fetchError } = await supabase
        .from('resources')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (fetchError) {
        throw fetchError;
      }

      setResources(data || []);
      return data || [];

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore nel caricamento delle risorse featured';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Carica una singola risorsa
  const fetchResource = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('resources')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore nel caricamento della risorsa';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Registra visualizzazione
  const trackView = useCallback(async (resourceId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('resource_views')
        .insert({
          resource_id: resourceId,
          user_id: user?.id || null,
          ip_address: null, // Sarà gestito dal server
          user_agent: navigator.userAgent,
          session_id: null // Sarà gestito dal server
        });

      if (error) {
        console.error('Errore nel tracking della visualizzazione:', error);
      }
    } catch (err) {
      console.error('Errore nel tracking della visualizzazione:', err);
    }
  }, []);

  // Registra download
  const trackDownload = useCallback(async (resourceId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('resource_downloads')
        .insert({
          resource_id: resourceId,
          user_id: user?.id || null,
          ip_address: null, // Sarà gestito dal server
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('Errore nel tracking del download:', error);
      }
    } catch (err) {
      console.error('Errore nel tracking del download:', err);
    }
  }, []);

  // Crea nuova risorsa (admin)
  const createResource = useCallback(async (resourceData: CreateResourceData) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: createError } = await supabase
        .from('resources')
        .insert([resourceData])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore nella creazione della risorsa';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Aggiorna risorsa (admin)
  const updateResource = useCallback(async (resourceData: UpdateResourceData) => {
    try {
      setLoading(true);
      setError(null);

      const { id, ...updateData } = resourceData;

      const { data, error: updateError } = await supabase
        .from('resources')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore nell\'aggiornamento della risorsa';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Elimina risorsa (admin)
  const deleteResource = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore nell\'eliminazione della risorsa';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Carica statistiche
  const fetchStats = useCallback(async (): Promise<ResourceStats> => {
    try {
      // Totale risorse
      const { count: totalResources } = await supabase
        .from('resources')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Totale download
      const { count: totalDownloads } = await supabase
        .from('resource_downloads')
        .select('*', { count: 'exact', head: true });

      // Totale visualizzazioni
      const { count: totalViews } = await supabase
        .from('resource_views')
        .select('*', { count: 'exact', head: true });

      // Risorse per tipo
      const { data: resourcesByType } = await supabase
        .from('resources')
        .select('type')
        .eq('is_active', true);

      const typeStats = resourcesByType?.reduce((acc, resource) => {
        acc[resource.type] = (acc[resource.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Risorse per categoria
      const { data: resourcesByCategory } = await supabase
        .from('resources')
        .select('category')
        .eq('is_active', true);

      const categoryStats = resourcesByCategory?.reduce((acc, resource) => {
        acc[resource.category] = (acc[resource.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Più scaricate
      const { data: mostDownloaded } = await supabase
        .from('resources')
        .select('*')
        .eq('is_active', true)
        .order('download_count', { ascending: false })
        .limit(5);

      // Più visualizzate
      const { data: mostViewed } = await supabase
        .from('resources')
        .select('*')
        .eq('is_active', true)
        .order('view_count', { ascending: false })
        .limit(5);

      return {
        total_resources: totalResources || 0,
        total_downloads: totalDownloads || 0,
        total_views: totalViews || 0,
        resources_by_type: typeStats,
        resources_by_category: categoryStats,
        most_downloaded: mostDownloaded || [],
        most_viewed: mostViewed || []
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore nel caricamento delle statistiche';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    resources,
    loading,
    error,
    fetchResources,
    fetchFeaturedResources,
    fetchResource,
    trackView,
    trackDownload,
    createResource,
    updateResource,
    deleteResource,
    fetchStats
  };
}
