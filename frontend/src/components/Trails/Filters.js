import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBicycle,
  faRunning,
  faWalking,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

const Filters = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lengthRange, setLengthRange] = useState({ from: "", to: "" });
  const [trailTypes, setTrailTypes] = useState({
    cycling: false,
    running: false,
    walking: false,
  });

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleLengthChange = (e) => {
    const { name, value } = e.target;
    setLengthRange({ ...lengthRange, [name]: value });
  };

  const handleTypeChange = (type) => {
    setTrailTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const applyFilters = () => {
    onFilterChange({ lengthRange, trailTypes });
  };

  const clearFilters = () => {
    setLengthRange({ from: "", to: "" });
    setTrailTypes({
      cycling: false,
      running: false,
      walking: false,
    });
    onFilterChange({ lengthRange: { from: "", to: "" }, trailTypes: {} });
  };

  return (
    <div className="absolute top-11 left-8 z-50">
      <button
        className="p-3 bg-primary text-white rounded-lg shadow-md flex items-center"
        onClick={toggleOpen}
      >
        <FontAwesomeIcon icon={faFilter} size="lg" className="mr-2" />
        Filtruj
      </button>

      <div
        className={`absolute left-0 w-80 mt-2 bg-white shadow-lg rounded-md transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Filtry</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:underline"
            >
              Wyczyść
            </button>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Długość (km)</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="from"
                placeholder="Od"
                value={lengthRange.from}
                onChange={handleLengthChange}
                className="w-1/2 border p-2 rounded"
                min={0}
              />
              <input
                type="number"
                name="to"
                placeholder="Do"
                value={lengthRange.to}
                onChange={handleLengthChange}
                className="w-1/2 border p-2 rounded"
                min={0}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Typ trasy</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={trailTypes.cycling}
                  onChange={() => handleTypeChange("cycling")}
                  className="text-primary"
                />
                <FontAwesomeIcon icon={faBicycle} /> Kolarstwo
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={trailTypes.running}
                  onChange={() => handleTypeChange("running")}
                  className="text-primary"
                />
                <FontAwesomeIcon icon={faRunning} /> Bieganie
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={trailTypes.walking}
                  onChange={() => handleTypeChange("walking")}
                  className="text-primary"
                />
                <FontAwesomeIcon icon={faWalking} /> Trekking
              </label>
            </div>
          </div>
          <button
            onClick={applyFilters}
            className="w-full bg-primary text-white py-2 rounded hover:bg-hover-background"
          >
            Zastosuj
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
