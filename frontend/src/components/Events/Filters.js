import React from "react";
import {
  trailTypeTranslations,
  eventStatusTranslations,
} from "../../utils/statusMappings";

const Filters = ({ filters, updateFilters, resetFilters }) => {
  const handleDateChange = (field, value) => {
    updateFilters(field, value);
  };

  const handleTrailTypeChange = (type) => {
    updateFilters("trailTypes", {
      ...filters.trailTypes,
      [type]: !filters.trailTypes[type],
    });
  };

  const handleStatusChange = (status) => {
    updateFilters("statuses", {
      ...filters.statuses,
      [status]: !filters.statuses[status],
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Filtry</h2>
        <button
          onClick={resetFilters}
          className="text-sm text-primary hover:text-hover-background"
        >
          Resetuj filtry
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Data rozpoczęcia</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm text-gray-600">Od</label>
              <input
                type="date"
                value={filters.startDateFrom}
                onChange={(e) =>
                  handleDateChange("startDateFrom", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Do</label>
              <input
                type="date"
                value={filters.startDateTo}
                onChange={(e) =>
                  handleDateChange("startDateTo", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Limit uczestników</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm text-gray-600">Od</label>
              <input
                type="number"
                min="0"
                value={filters.participantsLimitFrom}
                onChange={(e) =>
                  handleDateChange("participantsLimitFrom", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Do</label>
              <input
                type="number"
                min="0"
                value={filters.participantsLimitTo}
                onChange={(e) =>
                  handleDateChange("participantsLimitTo", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Typ trasy</h3>
          <div className="space-y-2">
            {Object.entries(trailTypeTranslations).map(([type, label]) => (
              <div key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`trail-type-${type}`}
                  checked={filters.trailTypes?.[type] || false}
                  onChange={() => handleTrailTypeChange(type)}
                  className="text-primary"
                />
                <label
                  htmlFor={`trail-type-${type}`}
                  className="select-none cursor-default"
                >
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Status wydarzenia</h3>
          <div className="space-y-2">
            {Object.entries(eventStatusTranslations).map(([status, label]) => (
              <div key={status} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`event-status-${status}`}
                  checked={filters.statuses?.[status] || false}
                  onChange={() => handleStatusChange(status)}
                  className="text-primary"
                />
                <label
                  htmlFor={`event-status-${status}`}
                  className="select-none cursor-default"
                >
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
