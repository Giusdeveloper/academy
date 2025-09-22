// Tipi per le risorse dell'Academy

export type ResourceType = 
  | 'pdf' 
  | 'video' 
  | 'template' 
  | 'guide' 
  | 'tool' 
  | 'ebook' 
  | 'checklist' 
  | 'presentation';

export type ResourceCategory = 
  | 'finanza' 
  | 'startup' 
  | 'investimenti' 
  | 'marketing' 
  | 'legal' 
  | 'tech' 
  | 'business' 
  | 'fundraising';

export type DifficultyLevel = 
  | 'beginner' 
  | 'intermediate' 
  | 'advanced';

export type Language = 'it' | 'en';

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  type: ResourceType;
  category: ResourceCategory;
  file_url: string;
  thumbnail_url: string | null;
  file_size: number | null;
  download_count: number;
  view_count: number;
  is_featured: boolean;
  is_premium: boolean;
  is_active: boolean;
  tags: string[];
  author: string | null;
  language: Language;
  difficulty_level: DifficultyLevel;
  estimated_time: number | null;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface ResourceDownload {
  id: string;
  resource_id: string;
  user_id: string | null;
  downloaded_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

export interface ResourceView {
  id: string;
  resource_id: string;
  user_id: string | null;
  viewed_at: string;
  ip_address: string | null;
  user_agent: string | null;
  session_id: string | null;
}

// Tipi per filtri e ricerca
export interface ResourceFilters {
  type?: ResourceType[];
  category?: ResourceCategory[];
  difficulty_level?: DifficultyLevel[];
  language?: Language;
  is_featured?: boolean;
  is_premium?: boolean;
  tags?: string[];
  search?: string;
}

export interface ResourceSortOptions {
  field: 'title' | 'published_at' | 'download_count' | 'view_count' | 'created_at';
  direction: 'asc' | 'desc';
}

// Tipi per statistiche
export interface ResourceStats {
  total_resources: number;
  total_downloads: number;
  total_views: number;
  resources_by_type: Record<ResourceType, number>;
  resources_by_category: Record<ResourceCategory, number>;
  most_downloaded: Resource[];
  most_viewed: Resource[];
}

// Tipi per form di creazione/modifica risorsa
export interface CreateResourceData {
  title: string;
  description?: string;
  type: ResourceType;
  category: ResourceCategory;
  file_url: string;
  thumbnail_url?: string;
  file_size?: number;
  is_featured?: boolean;
  is_premium?: boolean;
  tags?: string[];
  author?: string;
  language?: Language;
  difficulty_level?: DifficultyLevel;
  estimated_time?: number;
}

export interface UpdateResourceData extends Partial<CreateResourceData> {
  id: string;
}

// Tipi per API responses
export interface ResourcesResponse {
  resources: Resource[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ResourceResponse {
  resource: Resource;
  related_resources: Resource[];
}

// Utility types
export type ResourceWithStats = Resource & {
  download_count: number;
  view_count: number;
  last_downloaded?: string;
  last_viewed?: string;
};

export type ResourceCardProps = {
  resource: Resource;
  onDownload?: (resource: Resource) => void;
  onView?: (resource: Resource) => void;
  showStats?: boolean;
  compact?: boolean;
};

// Costanti per UI
export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  pdf: 'PDF',
  video: 'Video',
  template: 'Template',
  guide: 'Guida',
  tool: 'Strumento',
  ebook: 'E-book',
  checklist: 'Checklist',
  presentation: 'Presentazione'
};

export const RESOURCE_CATEGORY_LABELS: Record<ResourceCategory, string> = {
  finanza: 'Finanza',
  startup: 'Startup',
  investimenti: 'Investimenti',
  marketing: 'Marketing',
  legal: 'Legale',
  tech: 'Tecnologia',
  business: 'Business',
  fundraising: 'Fundraising'
};

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzato'
};

export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  beginner: 'green',
  intermediate: 'yellow',
  advanced: 'red'
};
