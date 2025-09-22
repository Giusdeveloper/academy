import { useState, useCallback } from 'react';
import { supabase } from '@/config/supabase';
import { 
  Resource, 
  ResourceFilters, 
  ResourceSortOptions, 
  ResourceStats,
  CreateResourceData,
  UpdateResourceData
} from '@/types/resources';

export interface UseResourcesReturn {
  resources: Resource[];
  featuredResources: Resource[];
  loading: boolean;
  error: string | null;
  stats: ResourceStats | null;
  filters: ResourceFilters;
  sortBy: ResourceSortOptions;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  totalResources: number;
  setFilters: (filters: Partial<ResourceFilters>) => void;
  setSortBy: (sortBy: ResourceSortOptions) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  clearFilters: () => void;
  fetchResources: () => Promise<void>;
  fetchFeaturedResources: () => Promise<void>;
  trackView: (resourceId: string) => Promise<void>;
  trackDownload: (resourceId: string) => Promise<void>;
  createResource: (data: CreateResourceData) => Promise<Resource | null>;
  updateResource: (id: string, data: UpdateResourceData) => Promise<Resource | null>;
  deleteResource: (id: string) => Promise<boolean>;
}

export function useResources(): UseResourcesReturn {
  const [resources, setResources] = useState<Resource[]>([]);
  const [featuredResources, setFeaturedResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats] = useState<ResourceStats | null>(null);
  const [filters, setFiltersState] = useState<ResourceFilters>({
    category: undefined,
    type: undefined,
    is_premium: undefined,
    tags: []
  });
  const [sortBy, setSortBy] = useState<ResourceSortOptions>({ field: 'created_at', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResources, setTotalResources] = useState(0);

  const ITEMS_PER_PAGE = 12;

  // Verifica se la tabella resources esiste
  const checkTableExists = useCallback(async (): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('resources')
        .select('id')
        .limit(1);
      
      if (error && error.code === 'PGRST116') {
        console.warn('Tabella resources non trovata. Applicare la migrazione del database.');
        return false;
      }
      
      return !error;
    } catch (err) {
      console.warn('Errore nel controllo della tabella resources:', err);
      return false;
    }
  }, []);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Verifica se la tabella esiste
      const tableExists = await checkTableExists();
      if (!tableExists) {
        setResources([]);
        setTotalResources(0);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      let query = supabase
        .from('resources')
        .select(`
          *,
          resource_views(count),
          resource_downloads(count)
        `);

      // Applica filtri
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.is_premium !== undefined) {
        query = query.eq('is_premium', filters.is_premium);
      }
      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      // Applica ricerca
      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Applica ordinamento
      query = query.order(sortBy.field, { ascending: sortBy.direction === 'asc' });

      // Applica paginazione
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data: resourcesData, error: fetchError, count } = await query;

      if (fetchError) {
        throw fetchError;
      }

      const processedResources = (resourcesData || []).map(resource => ({
        ...resource,
        view_count: resource.resource_views?.[0]?.count || 0,
        download_count: resource.resource_downloads?.[0]?.count || 0,
        tags: resource.tags || []
      }));

      setResources(processedResources);
      setTotalResources(count || 0);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));

    } catch (err) {
      console.error('Errore nel caricamento delle risorse:', err);
      setError('Errore nel caricamento delle risorse');
      setResources([]);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, searchQuery, currentPage, checkTableExists]);

  const fetchFeaturedResources = useCallback(async () => {
    try {
      // Verifica se la tabella esiste
      const tableExists = await checkTableExists();
      if (!tableExists) {
        setFeaturedResources([]);
        return;
      }

      const { data: featuredData, error } = await supabase
        .from('resources')
        .select(`
          *,
          resource_views(count),
          resource_downloads(count)
        `)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        throw error;
      }

      const processedResources = (featuredData || []).map(resource => ({
        ...resource,
        view_count: resource.resource_views?.[0]?.count || 0,
        download_count: resource.resource_downloads?.[0]?.count || 0,
        tags: resource.tags || []
      }));

      setFeaturedResources(processedResources);

    } catch (err) {
      console.error('Errore nel caricamento delle risorse in evidenza:', err);
      setFeaturedResources([]);
    }
  }, [checkTableExists]);

  const trackView = useCallback(async (resourceId: string) => {
    try {
      const tableExists = await checkTableExists();
      if (!tableExists) return;

      await supabase
        .from('resource_views')
        .insert({
          resource_id: resourceId,
          viewed_at: new Date().toISOString()
        });

      // Aggiorna il contatore locale
      setResources(prev => prev.map(resource => 
        resource.id === resourceId 
          ? { ...resource, view_count: resource.view_count + 1 }
          : resource
      ));

    } catch (err) {
      console.error('Errore nel tracking della visualizzazione:', err);
    }
  }, [checkTableExists]);

  const trackDownload = useCallback(async (resourceId: string) => {
    try {
      const tableExists = await checkTableExists();
      if (!tableExists) return;

      await supabase
        .from('resource_downloads')
        .insert({
          resource_id: resourceId,
          downloaded_at: new Date().toISOString()
        });

      // Aggiorna il contatore locale
      setResources(prev => prev.map(resource => 
        resource.id === resourceId 
          ? { ...resource, download_count: resource.download_count + 1 }
          : resource
      ));

    } catch (err) {
      console.error('Errore nel tracking del download:', err);
    }
  }, [checkTableExists]);

  const createResource = useCallback(async (data: CreateResourceData): Promise<Resource | null> => {
    try {
      const tableExists = await checkTableExists();
      if (!tableExists) return null;

      const { data: newResource, error } = await supabase
        .from('resources')
        .insert([{
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Ricarica le risorse
      await fetchResources();
      await fetchFeaturedResources();

      return newResource;

    } catch (err) {
      console.error('Errore nella creazione della risorsa:', err);
      return null;
    }
  }, [checkTableExists, fetchResources, fetchFeaturedResources]);

  const updateResource = useCallback(async (id: string, data: UpdateResourceData): Promise<Resource | null> => {
    try {
      const tableExists = await checkTableExists();
      if (!tableExists) return null;

      const { data: updatedResource, error } = await supabase
        .from('resources')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Ricarica le risorse
      await fetchResources();
      await fetchFeaturedResources();

      return updatedResource;

    } catch (err) {
      console.error('Errore nell\'aggiornamento della risorsa:', err);
      return null;
    }
  }, [checkTableExists, fetchResources, fetchFeaturedResources]);

  const deleteResource = useCallback(async (id: string): Promise<boolean> => {
    try {
      const tableExists = await checkTableExists();
      if (!tableExists) return false;

      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Ricarica le risorse
      await fetchResources();
      await fetchFeaturedResources();

      return true;

    } catch (err) {
      console.error('Errore nell\'eliminazione della risorsa:', err);
      return false;
    }
  }, [checkTableExists, fetchResources, fetchFeaturedResources]);

  const setFilters = useCallback((newFilters: Partial<ResourceFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset alla prima pagina quando cambiano i filtri
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({
      category: undefined,
      type: undefined,
      is_premium: undefined,
      tags: []
    });
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  return {
    resources,
    featuredResources,
    loading,
    error,
    stats,
    filters,
    sortBy,
    searchQuery,
    currentPage,
    totalPages,
    totalResources,
    setFilters,
    setSortBy,
    setSearchQuery,
    setCurrentPage,
    clearFilters,
    fetchResources,
    fetchFeaturedResources,
    trackView,
    trackDownload,
    createResource,
    updateResource,
    deleteResource
  };
}