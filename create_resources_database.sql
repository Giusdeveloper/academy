-- Database per le Risorse - Academy Imment
-- Creazione tabelle per gestire risorse dinamiche

-- Tabella principale risorse
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('pdf', 'video', 'template', 'guide', 'tool', 'ebook', 'checklist', 'presentation')),
  category VARCHAR(100) NOT NULL CHECK (category IN ('finanza', 'startup', 'investimenti', 'marketing', 'legal', 'tech', 'business', 'fundraising')),
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size INTEGER, -- Dimensione in bytes
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false, -- Solo per utenti premium
  is_active BOOLEAN DEFAULT true,
  tags TEXT[], -- Array di tag per ricerca
  author VARCHAR(255),
  language VARCHAR(10) DEFAULT 'it', -- 'it', 'en'
  difficulty_level VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_time INTEGER, -- Tempo stimato in minuti
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella per tracciare download
CREATE TABLE IF NOT EXISTS resource_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Tabella per tracciare visualizzazioni
CREATE TABLE IF NOT EXISTS resource_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Può essere NULL per utenti non autenticati
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  session_id TEXT
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_featured ON resources(is_featured);
CREATE INDEX IF NOT EXISTS idx_resources_premium ON resources(is_premium);
CREATE INDEX IF NOT EXISTS idx_resources_active ON resources(is_active);
CREATE INDEX IF NOT EXISTS idx_resources_published ON resources(published_at);
CREATE INDEX IF NOT EXISTS idx_resources_tags ON resources USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_downloads_resource ON resource_downloads(resource_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user ON resource_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_date ON resource_downloads(downloaded_at);

CREATE INDEX IF NOT EXISTS idx_views_resource ON resource_views(resource_id);
CREATE INDEX IF NOT EXISTS idx_views_user ON resource_views(user_id);
CREATE INDEX IF NOT EXISTS idx_views_date ON resource_views(viewed_at);

-- Funzione per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger per aggiornare updated_at
CREATE TRIGGER update_resources_updated_at 
    BEFORE UPDATE ON resources 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Funzione per incrementare contatori
CREATE OR REPLACE FUNCTION increment_download_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE resources 
    SET download_count = download_count + 1 
    WHERE id = NEW.resource_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION increment_view_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE resources 
    SET view_count = view_count + 1 
    WHERE id = NEW.resource_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger per incrementare contatori
CREATE TRIGGER increment_download_count_trigger
    AFTER INSERT ON resource_downloads
    FOR EACH ROW
    EXECUTE FUNCTION increment_download_count();

CREATE TRIGGER increment_view_count_trigger
    AFTER INSERT ON resource_views
    FOR EACH ROW
    EXECUTE FUNCTION increment_view_count();

-- RLS (Row Level Security) Policies
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_views ENABLE ROW LEVEL SECURITY;

-- Policy per resources: tutti possono leggere risorse attive
CREATE POLICY "Resources are viewable by everyone" ON resources
    FOR SELECT USING (is_active = true);

-- Policy per downloads: solo utenti autenticati possono scaricare
CREATE POLICY "Authenticated users can download" ON resource_downloads
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy per views: tutti possono visualizzare (anche non autenticati)
CREATE POLICY "Views are insertable by everyone" ON resource_views
    FOR INSERT WITH CHECK (true);

-- Inserimento di alcune risorse di esempio
INSERT INTO resources (title, description, type, category, file_url, thumbnail_url, file_size, is_featured, tags, author, difficulty_level, estimated_time) VALUES
(
    'Guida Completa al Business Plan',
    'Una guida dettagliata per creare un business plan efficace per la tua startup. Include template, esempi pratici e checklist.',
    'guide',
    'startup',
    'https://example.com/business-plan-guide.pdf',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&h=300&q=80',
    2048000,
    true,
    ARRAY['business plan', 'startup', 'finanza', 'template'],
    'Team Imment',
    'beginner',
    45
),
(
    'Template Pitch Deck',
    'Template professionale per presentazioni pitch deck. Include slide per tutti gli aspetti chiave della tua startup.',
    'template',
    'fundraising',
    'https://example.com/pitch-deck-template.pptx',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&h=300&q=80',
    5120000,
    true,
    ARRAY['pitch deck', 'presentazione', 'fundraising', 'investitori'],
    'Team Imment',
    'intermediate',
    30
),
(
    'Checklist Due Diligence',
    'Checklist completa per il processo di due diligence con investitori. Include tutti i documenti e verifiche necessarie.',
    'checklist',
    'investimenti',
    'https://example.com/due-diligence-checklist.pdf',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=400&h=300&q=80',
    1024000,
    false,
    ARRAY['due diligence', 'investimenti', 'checklist', 'legal'],
    'Team Imment',
    'advanced',
    60
),
(
    'Guida al Crowdfunding',
    'Come utilizzare il crowdfunding per finanziare la tua startup. Strategie, piattaforme e best practices.',
    'ebook',
    'fundraising',
    'https://example.com/crowdfunding-guide.pdf',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=400&h=300&q=80',
    3072000,
    false,
    ARRAY['crowdfunding', 'fundraising', 'startup', 'finanziamento'],
    'Team Imment',
    'intermediate',
    90
),
(
    'Template Contratto Societario',
    'Template base per contratti societari e accordi tra founder. Include clausole essenziali e note esplicative.',
    'template',
    'legal',
    'https://example.com/contratto-societario.docx',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&h=300&q=80',
    256000,
    false,
    ARRAY['contratto', 'legal', 'società', 'founder'],
    'Team Imment',
    'advanced',
    120
);

-- Commenti per documentazione
COMMENT ON TABLE resources IS 'Tabella principale per le risorse dell''academy';
COMMENT ON TABLE resource_downloads IS 'Traccia i download delle risorse per analytics';
COMMENT ON TABLE resource_views IS 'Traccia le visualizzazioni delle risorse per analytics';

COMMENT ON COLUMN resources.type IS 'Tipo di risorsa: pdf, video, template, guide, tool, ebook, checklist, presentation';
COMMENT ON COLUMN resources.category IS 'Categoria della risorsa per organizzazione';
COMMENT ON COLUMN resources.is_premium IS 'Se true, la risorsa è disponibile solo per utenti premium';
COMMENT ON COLUMN resources.tags IS 'Array di tag per ricerca e filtri';
COMMENT ON COLUMN resources.difficulty_level IS 'Livello di difficoltà: beginner, intermediate, advanced';
COMMENT ON COLUMN resources.estimated_time IS 'Tempo stimato per utilizzare la risorsa in minuti';
