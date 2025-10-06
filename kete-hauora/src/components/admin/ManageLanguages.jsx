
import { useFilters } from "../../context/FiltersContext";
import Navbar from "../navbar/navbar";
import "./ManageFilters.css";
import ManageFilters from "./ManageFilters";

const ManageLanguages = () => {
  const { loading } = useFilters();

  if (loading) return <p>Loading languages...</p>;

  return (
    <div className="manage-filters-page">
        <Navbar />
        <ManageFilters
            title="Manage Languages"
            tableName="languages"
            idField="language_id"
            nameField="language"
            joinTable="service_languages"
        />
    </div>
  );
};

export default ManageLanguages;
