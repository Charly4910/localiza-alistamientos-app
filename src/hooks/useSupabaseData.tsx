
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VehicleInspection, Agency } from '@/types/vehicle';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseData = () => {
  const [inspections, setInspections] = useState<VehicleInspection[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch agencies
  const fetchAgencies = async () => {
    try {
      console.log('Fetching agencies...');
      const { data, error } = await supabase
        .from('agencies')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching agencies:', error);
        return [];
      }

      console.log('Agencies fetched:', data?.length);
      return data || [];
    } catch (error) {
      console.error('Error in fetchAgencies:', error);
      return [];
    }
  };

  // Fetch inspections
  const fetchInspections = async () => {
    try {
      console.log('Fetching inspections...');
      const { data: inspectionData, error: inspectionError } = await supabase
        .from('vehicle_inspections')
        .select('*')
        .order('created_at', { ascending: false });

      if (inspectionError) {
        console.error('Error fetching inspections:', inspectionError);
        return [];
      }

      console.log('Inspections fetched:', inspectionData?.length);

      // Fetch photos for each inspection
      const inspectionsWithPhotos = await Promise.all(
        (inspectionData || []).map(async (inspection) => {
          try {
            const { data: photos, error: photosError } = await supabase
              .from('vehicle_photos')
              .select('*')
              .eq('inspection_id', inspection.id);

            const vehiclePhotos = (photos || []).map(photo => ({
              id: photo.id,
              type: photo.photo_type as any,
              url: supabase.storage.from('vehicle-photos').getPublicUrl(photo.file_path).data.publicUrl,
              timestamp: new Date(photo.created_at || '')
            }));

            return {
              ...inspection,
              photos: vehiclePhotos,
              timestamp: new Date(inspection.created_at || ''),
              consecutiveNumber: inspection.consecutive_number,
              inspector: {
                email: inspection.inspector_email,
                name: inspection.inspector_name,
                userId: inspection.inspector_id || 'unknown'
              }
            };
          } catch (error) {
            console.error('Error processing inspection:', error);
            return {
              ...inspection,
              photos: [],
              timestamp: new Date(inspection.created_at || ''),
              consecutiveNumber: inspection.consecutive_number,
              inspector: {
                email: inspection.inspector_email,
                name: inspection.inspector_name,
                userId: inspection.inspector_id || 'unknown'
              }
            };
          }
        })
      );

      return inspectionsWithPhotos;
    } catch (error) {
      console.error('Error in fetchInspections:', error);
      return [];
    }
  };

  // Save inspection
  const saveInspection = async (inspectionData: Omit<VehicleInspection, 'id' | 'timestamp' | 'consecutiveNumber'>) => {
    try {
      console.log('Saving inspection...');
      
      // Get next consecutive number
      const { data: consecutiveData, error: consecutiveError } = await supabase.rpc('get_next_consecutive_number');
      
      if (consecutiveError) {
        throw consecutiveError;
      }
      
      const consecutiveNumber = consecutiveData || 1;

      // Save inspection
      const { data: inspection, error: inspectionError } = await supabase
        .from('vehicle_inspections')
        .insert({
          consecutive_number: consecutiveNumber,
          placa: inspectionData.placa,
          observaciones: inspectionData.observaciones,
          fecha_vencimiento_extintor: inspectionData.fechaVencimientoExtintor || null,
          inspector_name: inspectionData.inspector.name,
          inspector_email: inspectionData.inspector.email,
          inspector_id: inspectionData.inspector.userId,
          department: inspectionData.department
        })
        .select()
        .single();

      if (inspectionError) {
        throw inspectionError;
      }

      // Upload and save photos
      for (const photo of inspectionData.photos) {
        try {
          // Convert data URL to blob
          const response = await fetch(photo.url);
          const blob = await response.blob();
          
          const fileName = `${inspection.id}/${photo.type}-${Date.now()}.jpg`;
          
          // Upload to storage
          const { error: uploadError } = await supabase.storage
            .from('vehicle-photos')
            .upload(fileName, blob);

          if (uploadError) {
            console.error('Error uploading photo:', uploadError);
            continue;
          }

          // Save photo record
          await supabase
            .from('vehicle_photos')
            .insert({
              inspection_id: inspection.id,
              photo_type: photo.type,
              file_path: fileName
            });
        } catch (photoError) {
          console.error('Error processing photo:', photoError);
        }
      }

      toast({
        title: "✅ Alistamiento guardado",
        description: `El alistamiento #${consecutiveNumber} ha sido guardado exitosamente`,
      });

      // Refresh inspections
      const newInspections = await fetchInspections();
      setInspections(newInspections);

    } catch (error) {
      console.error('Error saving inspection:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al guardar el alistamiento",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      try {
        console.log('Loading data...');
        setLoading(true);
        
        const [agenciesData, inspectionsData] = await Promise.all([
          fetchAgencies(),
          fetchInspections()
        ]);
        
        if (mounted) {
          setAgencies(agenciesData);
          setInspections(inspectionsData);
          setLoading(false);
          console.log('Data loaded successfully');
        }
      } catch (error) {
        console.error('Error loading data:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    inspections,
    agencies,
    loading,
    saveInspection,
    fetchInspections,
    fetchAgencies
  };
};
