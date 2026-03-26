-- ============================================================
-- Municipalidad App — Supabase Migration
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Tabla de perfiles (extiende auth.users con full_name y role)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de eventos
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT,
  location TEXT,
  address TEXT,
  image_uri TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Migración: agregar columna parish a events
-- Ejecutar si ya tenés la tabla events creada
-- ============================================================
ALTER TABLE events ADD COLUMN IF NOT EXISTS parish TEXT;

-- 3. Habilitar Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de profiles
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 5. Políticas de events
--    - Eventos aprobados: visibles para todos
--    - Eventos propios: visibles para el autor
--    - Todos los eventos: visibles para admins
CREATE POLICY "events_select" ON events FOR SELECT USING (
  status = 'approved'
  OR auth.uid() = submitted_by
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "events_insert" ON events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "events_update" ON events FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 5b. Columna avatar_url en profiles (para foto de Google u otras)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 6. Trigger: crear perfil automáticamente al registrarse (soporta OAuth)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    COALESCE(NEW.raw_user_meta_data->>'picture', NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 7. Tabla de municipalidades
CREATE TABLE IF NOT EXISTS municipalities (
  id   BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE municipalities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "municipalities_select" ON municipalities FOR SELECT USING (true);

-- Datos por defecto
INSERT INTO municipalities (name, slug) VALUES
  ('Marinilla', 'marinilla'),
  ('El Carmen', 'el-carmen'),
  ('La Ceja',   'la-ceja')
ON CONFLICT (slug) DO NOTHING;

-- FK en events
ALTER TABLE events ADD COLUMN IF NOT EXISTS municipality_id BIGINT REFERENCES municipalities(id) ON DELETE SET NULL;
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_time_end TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;

-- 9. Preferencias de filtro del usuario
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pref_category TEXT NOT NULL DEFAULT 'all';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pref_municipality_id BIGINT REFERENCES municipalities(id) ON DELETE SET NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pref_parish TEXT NOT NULL DEFAULT 'all';

-- 10. Tabla de favoritos
CREATE TABLE IF NOT EXISTS favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id BIGINT REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_select" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- 8. Datos de ejemplo (eventos)
INSERT INTO events (title, description, category, event_date, event_time, location, address, status) VALUES
('Feria de Artesanías', 'Exposición y venta de artesanías locales en la plaza central. Más de 40 artesanos participantes con productos únicos hechos a mano.', 'cultural', CURRENT_DATE, '10:00', 'Plaza Central', 'Av. Principal 100', 'approved'),
('Clase de Yoga al Aire Libre', 'Sesión grupal de yoga para todos los niveles. Trae tu colchoneta y ropa cómoda.', 'sport', CURRENT_DATE, '08:00', 'Parque Municipal', 'Parque Municipal s/n', 'approved'),
('Concierto de Jazz', 'Noche de jazz con la Orquesta Municipal. Entrada libre para toda la familia.', 'artistic', CURRENT_DATE, '20:00', 'Teatro Municipal', 'Calle Teatro 55', 'approved'),
('Taller de Pintura para Niños', 'Actividad creativa para niños de 6 a 12 años. Materiales incluidos.', 'educational', CURRENT_DATE, '15:00', 'Centro Cultural', 'Av. Cultura 200', 'approved'),
('Reunión Vecinal', 'Asamblea abierta para tratar temas del barrio norte. Todos los vecinos son bienvenidos.', 'social', CURRENT_DATE, '18:30', 'Centro Comunitario Norte', 'Calle Norte 88', 'approved'),
('Torneo de Fútbol Infantil', 'Torneo municipal para categorías Sub-10 y Sub-12. Inscripción previa requerida.', 'sport', CURRENT_DATE + INTERVAL '1 day', '09:00', 'Estadio Municipal', 'Av. Deporte 1', 'approved'),
('Exposición Fotográfica', '"Nuestra Ciudad" — muestra itinerante de fotografía documental sobre el municipio.', 'artistic', CURRENT_DATE + INTERVAL '1 day', '10:00', 'Galería Municipal', 'Calle Arte 15', 'approved'),
('Feria del Libro', 'Más de 30 editoriales y librerías locales. Presentaciones de autores y actividades para niños.', 'cultural', CURRENT_DATE + INTERVAL '2 days', '09:00', 'Plaza Central', 'Av. Principal 100', 'approved'),
('Festival de Danza Folklórica', 'Presentación de grupos de danza de toda la provincia. Entrada libre.', 'artistic', CURRENT_DATE + INTERVAL '2 days', '19:00', 'Anfiteatro Municipal', 'Paseo del Río s/n', 'pending'),
('Charla sobre Reciclaje', 'Aprende cómo separar residuos y contribuir al cuidado del medioambiente.', 'educational', CURRENT_DATE + INTERVAL '2 days', '11:00', 'Biblioteca Municipal', 'Av. Sarmiento 300', 'pending');
