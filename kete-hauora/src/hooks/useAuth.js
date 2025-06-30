import { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';

//keeping a user loged in

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Get user profile (includes role)
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Failed to fetch profile:', error.message);
          setUser(null);
        } else {
          setUser({ ...session.user, ...profile }); // ✅ user.role now exists
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    getSessionAndProfile();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Re-fetch profile when auth state changes
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (!error) {
              setUser({ ...session.user, ...profile });
            } else {
              console.error('Auth listener profile fetch failed:', error.message);
              setUser(null);
            }
          });
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};
