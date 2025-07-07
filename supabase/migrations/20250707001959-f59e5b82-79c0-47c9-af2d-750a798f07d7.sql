
-- Crear tabla para usuarios/perfiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  pin TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla para agencias
CREATE TABLE public.agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  abbreviation TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla para inspecciones de vehículos
CREATE TABLE public.vehicle_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consecutive_number INTEGER NOT NULL,
  placa TEXT NOT NULL,
  observaciones TEXT,
  fecha_vencimiento_extintor DATE,
  inspector_id UUID REFERENCES public.profiles(id),
  inspector_name TEXT NOT NULL,
  inspector_email TEXT NOT NULL,
  department TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla para fotos de vehículos
CREATE TABLE public.vehicle_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID REFERENCES public.vehicle_inspections(id) ON DELETE CASCADE,
  photo_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear secuencia para números consecutivos
CREATE SEQUENCE public.consecutive_number_seq START 1;

-- Función para obtener el siguiente número consecutivo
CREATE OR REPLACE FUNCTION public.get_next_consecutive_number()
RETURNS INTEGER AS $$
BEGIN
  RETURN nextval('public.consecutive_number_seq');
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar perfil cuando se crea usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, pin, is_admin, department)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'pin', '0000'),
    COALESCE((NEW.raw_user_meta_data->>'is_admin')::boolean, FALSE),
    NEW.raw_user_meta_data->>'department'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insertar agencias por defecto
INSERT INTO public.agencies (name, abbreviation) VALUES
('Amazonas', 'AMA'),
('Antioquia', 'ANT'),
('Arauca', 'ARA'),
('Atlántico', 'ATL'),
('Bolívar', 'BOL'),
('Boyacá', 'BOY'),
('Caldas', 'CAL'),
('Caquetá', 'CAQ'),
('Casanare', 'CAS'),
('Cauca', 'CAU'),
('Cesar', 'CES'),
('Chocó', 'CHO'),
('Córdoba', 'COR'),
('Cundinamarca', 'CUN'),
('Guainía', 'GUA'),
('Guaviare', 'GUV'),
('Huila', 'HUI'),
('La Guajira', 'LAG'),
('Magdalena', 'MAG'),
('Meta', 'MET'),
('Nariño', 'NAR'),
('Norte de Santander', 'NSA'),
('Putumayo', 'PUT'),
('Quindío', 'QUI'),
('Risaralda', 'RIS'),
('San Andrés y Providencia', 'SAP'),
('Santander', 'SAN'),
('Sucre', 'SUC'),
('Tolima', 'TOL'),
('Valle del Cauca', 'VAL'),
('Vaupés', 'VAU'),
('Vichada', 'VIC');

-- Crear bucket para almacenar fotos
INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-photos', 'vehicle-photos', true);

-- Habilitar RLS en las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_photos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Políticas RLS para agencies (todos pueden leer)
CREATE POLICY "Everyone can view agencies" ON public.agencies
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify agencies" ON public.agencies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Políticas RLS para inspecciones
CREATE POLICY "Users can view inspections" ON public.vehicle_inspections
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create inspections" ON public.vehicle_inspections
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Políticas RLS para fotos
CREATE POLICY "Users can view photos" ON public.vehicle_photos
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create photos" ON public.vehicle_photos
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Políticas para el bucket de fotos
CREATE POLICY "Anyone can view photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'vehicle-photos');

CREATE POLICY "Authenticated users can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'vehicle-photos' AND auth.uid() IS NOT NULL);
