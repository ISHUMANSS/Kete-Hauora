import { useFilters } from "../../context/FiltersContext";
import Navbar from "../navbar/navbar";

import "./ManageFilters.css";
import ManageFilters from "./ManageFilters";

const ManageCategories = () => {
  const { loading } = useFilters();

  if (loading) return <p>Loading categories...</p>;

  return (
    <div className="manage-filters-page">
      <Navbar />
      <ManageFilters
        title="Manage Categories"
        tableName="categories"
        idField="category_id"
        nameField="category"
        joinTable="service_categories"
      />
    </div>
  );
};

export default ManageCategories;
