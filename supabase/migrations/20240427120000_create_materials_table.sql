CREATE TABLE materials (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('ppt', 'pdf', 'video')),
  url text NOT NULL,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_materials_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_materials_updated_at
BEFORE UPDATE ON materials
FOR EACH ROW
EXECUTE PROCEDURE update_materials_updated_at_column(); 