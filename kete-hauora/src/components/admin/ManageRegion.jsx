
import { useFilters } from "../../context/FiltersContext";
import Navbar from "../navbar/navbar";
import "./ManageFilters.css";
import ManageFilters from "./ManageFilters";

const ManageRegions = () => {
  const { loading } = useFilters();

  if (loading) return <p>Loading regions...</p>;

  return (
    <div className="manage-filters-page">
        <Navbar />
        <ManageFilters
            title="Manage Regions"
            tableName="region"
            itemName="Region"
            idField="region_id"
            nameField="region"
            joinTable="service_regions"
        />
    </div>
  );
};

export default ManageRegions;
