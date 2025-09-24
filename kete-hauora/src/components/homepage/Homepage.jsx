import React, { useState } from 'react';
import './HomePage.css';

import supabase from "../../config/supabaseClient";
import Navbar from '../navbar/navbar';

//import { useTranslation } from 'react-i18next';

function HomePage() {
  

  //const { t } = useTranslation();

  return (
    <div className="home">
      <Navbar />
      
      <div className="center-container">
        <h1 className='title'>Kete Hauora</h1>

      </div>
    </div>
  );
}

export default HomePage;


//I think this must be where the users role is being checked??
export const useUserRole = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (!error) setRole(data.role);
      }

      setLoading(false);
    };

    fetchRole();
  }, []);

  return { role, loading };
};
