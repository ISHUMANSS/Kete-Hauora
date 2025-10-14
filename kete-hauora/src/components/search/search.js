import React, { useEffect, useState } from "react";
import supabase from "../../config/supabaseClient";
import SearchResultCard from "../searchResultCard/searchResultCard";

import { useFilters } from "../../context/FiltersContext";

const Search = ({ serviceName, triggerSearch, filters }) => {
  const [serviceResult, setServiceResult] = useState(null); // shows the search table
  const [error, setError] = useState(null); // the error which tells the user what went wrong with their search, like if there weren't any results
  const [services, setServices] = useState([]); // list of all the services given in the response

  const { categories } = useFilters();

  useEffect(() => {
    const handleSearch = async () => {
      //if nothing to search for
      if (
        !serviceName &&
        !filters.category &&
        !filters.cost &&
        !filters.language &&
        !filters.location
      ) {
        setServices([]);
        setServiceResult(null);
        setError(null);
        return;
      }

      try {
        //fetch all services with left joins
        const { data, error } = await supabase.from("services").select(`
                *,
                service_categories!left(category_id),
                service_languages!left(language_id),
                service_regions!left(region_id),
                service_translations!left(
                    services_offered_maori
                )
                `);

        if (error) {
          console.error(error);
          setError("An error occurred during the search.");
          return;
        }

        //now running filters localy

        //start with all data
        let filtered = data;

        //filter by serviceName at the start of the string
        if (serviceName) {
          const searchLower = serviceName.toLowerCase();

          //company name matches first
          const nameMatches = filtered.filter((service) =>
            service.company_name.toLowerCase().startsWith(searchLower)
          );

          //category matches second
          const matchedCategories = categories.filter((c) =>
            c.category.toLowerCase().includes(searchLower)
          );
          let categoryMatches = [];
          if (matchedCategories.length > 0) {
            const matchedIds = matchedCategories.map((c) => c.category_id);
            categoryMatches = filtered.filter((service) =>
              service.service_categories?.some((cat) =>
                matchedIds.includes(cat.category_id)
              )
            );
          }

          //merge them without duplicates
          //allows both the sets to be there at the same time
          const combined = [...nameMatches];
          categoryMatches.forEach((service) => {
            if (!combined.some((s) => s.id === service.id)) {
              combined.push(service);
            }
          });

          filtered = combined;
        }

        //filter by cost
        if (filters.cost) {
          //convert to bool for local filtering
          const costBool = filters.cost === "TRUE"; // "TRUE" → true, "FALSE" → false

          //alows for results that don't match either to pass for both
          filtered = filtered.filter(
            (service) =>
              service.cost_tf === costBool || service.cost_tf === null
          );
        }

        //filter by category
        //checks if like the id of the returned catagories match the catagory id in service catagories
        //keep only services that have at least one category matching the selected category ID
        if (filters.category) {
          filtered = filtered.filter((service) =>
            service.service_categories?.some(
              (cat) => cat.category_id === Number(filters.category)
            )
          );
        }

        //filter by language
        //checks if like the id of the returned languages match the languages id in service languages
        //keep only services that have at least one language matching the selected language ID
        if (filters.language) {
          filtered = filtered.filter((service) =>
            service.service_languages?.some(
              (lang) => lang.language_id === Number(filters.language)
            )
          );
        }

        //region filter
        if (filters.location) {
          filtered = filtered.filter((service) =>
            service.service_regions?.some(
              (region) => region.region_id === Number(filters.location)
            )
          );
        }

        setServices(filtered);
        setServiceResult(true);
        setError(filtered.length === 0 ? "No results found." : null);
      } catch (err) {
        console.error("Search error:", err.message);
        setServices([]);
        setServiceResult(null);
        setError("An error occurred during the search.");
      }
    };

    handleSearch();
  }, [serviceName, filters, categories]); //run each time the service name changes or the filters are changed lmao the search button is just for show pretty much

  return (
    <div className="Search">
      {error && <p style={{ color: "red" }}>{error}</p>}

      {serviceResult && (
        // if the service result exists, show the table
        <div className="result-container">
          {services.map((service) => (
            <SearchResultCard
              key={service.id}
              service={service}
              filters={filters}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
