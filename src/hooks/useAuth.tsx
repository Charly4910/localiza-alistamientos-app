
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  pin: string;
  is_admin: boolean;
  department?: string;
  created_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Auth hook initializing...');
    
    let isMounted = true;

    const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
      try {
        console.log('Fetching profile for user:', userId);
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return null;
        }
        
        console.log('Profile fetched:', profileData);
        return profileData;
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        return null;
      }
    };

    const handleAuthStateChange = async (event: string, session: Session | null) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (!isMounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        if (isMounted) {
          setProfile(profileData);
        }
      } else {
        if (isMounted) {
          setProfile(null);
        }
      }
      
      if (isMounted) {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session
    const initAuth = async () => {
      try {
        console.log('Checking existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) {
            setLoading(false);
          }
          return;
        }
        
        await handleAuthStateChange('INITIAL_SESSION', session);
      } catch (error) {
        console.error('Error in initAuth:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    session,
    profile,
    loading,
    signOut
  };
};
