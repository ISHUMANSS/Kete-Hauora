//context to be able to fetch all the needed filters so that they aren't needed to be fetched in like every page
//should mean less requests overall hopefully
/*
    currently used in:
        -Filters
        -Search
        -Search bar
    Could be used in:
        -the admin change filters for the super admins

*/

/*
    How to use:
        the whole page is wraped in it
        import use filters
        now you don't need to re fetch all the filters

*/

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import supabase from "../config/supabaseClient";

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFilters = useCallback(async () => {
    setLoading(true);
    try {
      //fetch categories
      const { data: catData, error: catError } = await supabase
        .from("categories")
        .select("category_id, category")
        .order("category", { ascending: true });
      if (catError) throw catError;
      setCategories(catData || []);

      //fetch languages
      const { data: langData, error: langError } = await supabase
        .from("languages")
        .select("language_id, language")
        .order("language", { ascending: true });
      if (langError) throw langError;
      setLanguages(langData || []);

      //fetch regions
      const { data: regionData, error: regionError } = await supabase
        .from("region")
        .select("region_id, region")
        .order("region", { ascending: true });
      if (regionError) throw regionError;
      setRegions(regionData || []);
    } catch (err) {
      console.error("Error fetching filters:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  return (
    <FiltersContext.Provider value={{ categories, languages, regions, loading, refreshFilters: fetchFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};

//helper hook
export const useFilters = () => useContext(FiltersContext);