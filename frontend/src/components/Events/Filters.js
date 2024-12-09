import React from "react";

const Filters = ({ filters, updateFilters, resetFilters }) => (
  <aside className="h-full bg-white p-6 space-y-6 shadow-md border-r border-gray-200">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">Filtry</h2>
      <button
        className="text-sm text-blue-500 hover:underline"
        onClick={resetFilters}
      >
        Wyczyść filtry
      </button>
    </div>
    <div className="space-y-6">
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Data rozpoczęcia:
        </label>
        <div className="flex flex-col space-y-2">
          <input
            type="date"
            value={filters.startDateFrom}
            onChange={(e) => updateFilters("startDateFrom", e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={filters.startDateTo}
            onChange={(e) => updateFilters("startDateTo", e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Limit uczestników:
        </label>
        <div className="flex flex-col space-y-2">
          <input
            type="number"
            placeholder="Od"
            value={filters.participantsLimitFrom}
            onChange={(e) =>
              updateFilters("participantsLimitFrom", e.target.value)
            }
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
          <input
            type="number"
            placeholder="Do"
            value={filters.participantsLimitTo}
            onChange={(e) =>
              updateFilters("participantsLimitTo", e.target.value)
            }
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>
      </div>
    </div>
  </aside>
);

export default Filters;
