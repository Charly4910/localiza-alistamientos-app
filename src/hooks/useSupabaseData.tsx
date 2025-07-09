
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Agency = Database['public']['Tables']['agencies']['Row'];
type Inspection = Database['public']['Tables']['inspections']['Row'] & {
  profiles?: {
    name: string;
    email: string;
  };
  agencies?: {
    name: string;
    abbreviation: string;
  };
  inspection_photos?: Array<{
    id: string;
    photo_type: string;
    photo_url: string;
  }>;
};

// Create a custom insert type that makes consecutive_number optional
type InspectionInsert = Omit<Database['public']['Tables']['inspections']['Insert'], 'consecutive_number'> & {
  consecutive_number?: number;
};

export const useSupabaseData = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Cargar agencias
      const { data: agenciesData, error: agenciesError } = await supabase
        .from('agencies')
        .select('*')
        .order('name');

      if (agenciesError) {
        console.error('Error fetching agencies:', agenciesError);
      } else {
        setAgencies(agenciesData || []);
      }

      // Cargar alistamientos con relaciones
      const { data: inspectionsData, error: inspectionsError } = await supabase
        .from('inspections')
        .select(`
          *,
          profiles (name, email),
          agencies (name, abbreviation),
          inspection_photos (id, photo_type, photo_url)
        `)
        .order('created_at', { ascending: false });

      if (inspectionsError) {
        console.error('Error fetching inspections:', inspectionsError);
      } else {
        setInspections(inspectionsData || []);
      }
    } catch (error) {
      console.error('Error in fetchData:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file: File, inspectionId: string, photoType: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${inspectionId}_${photoType}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('inspection-photos')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('inspection-photos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  };

  const createInspection = async (inspectionData: InspectionInsert) => {
    try {
      const { data, error } = await supabase
        .from('inspections')
        .insert([inspectionData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from inspection creation');
      }

      toast({
        title: "Alistamiento creado",
        description: `Alistamiento #${data.consecutive_number} creado exitosamente`,
      });

      await fetchData(); // Recargar datos
      return data;
    } catch (error) {
      console.error('Error creating inspection:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el alistamiento",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addInspectionPhoto = async (inspectionId: string, photoType: string, photoUrl: string) => {
    try {
      const { error } = await supabase
        .from('inspection_photos')
        .insert([{
          inspection_id: inspectionId,
          photo_type: photoType,
          photo_url: photoUrl,
        }]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error adding inspection photo:', error);
      throw error;
    }
  };

  return {
    agencies,
    inspections,
    loading,
    fetchData,
    uploadPhoto,
    createInspection,
    addInspectionPhoto,
  };
};
