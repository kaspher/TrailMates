import React, { useEffect, useState, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faUsers,
  faRoad,
  faFlagCheckered,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import CustomAlert from "../CustomAlert";

const Events = () => {
  const [events, setEvents] = useState([]);
  const initialFilters = {
    startDateFrom: "",
    startDateTo: "",
    participantsLimitFrom: "",
    participantsLimitTo: "",
    sortBy: "StartDate",
    sortDescending: false,
    page: 1,
    pageSize: 1,
  };
  const [filters, setFilters] = useState(initialFilters);
  const [totalPages, setTotalPages] = useState(1);
  const alertRef = useRef();

  const fetchEvents = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();

      if (filters.startDateFrom)
        queryParams.append("startDateFrom", filters.startDateFrom);
      if (filters.startDateTo)
        queryParams.append("startDateTo", filters.startDateTo);
      if (filters.participantsLimitFrom)
        queryParams.append(
          "participantsLimitFrom",
          filters.participantsLimitFrom
        );
      if (filters.participantsLimitTo)
        queryParams.append("participantsLimitTo", filters.participantsLimitTo);
      queryParams.append("sortBy", filters.sortBy);
      queryParams.append("sortDescending", filters.sortDescending);
      queryParams.append("page", filters.page);
      queryParams.append("pageSize", filters.pageSize);

      const response = await fetch(
        `https://localhost:7186/api/events?${queryParams.toString()}`
      );

      if (response.ok) {
        const eventData = await response.json();
        setEvents(eventData.items || eventData);
        setTotalPages(Math.ceil(eventData.totalCount / filters.pageSize));
      } else {
        alertRef.current?.showAlert(
          "Błąd podczas pobierania wydarzeń",
          "error"
        );
      }
    } catch (error) {
      alertRef.current?.showAlert(
        "Wystąpił błąd podczas pobierania wydarzeń",
        "error"
      );
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const updateFilters = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handlePageChange = (page) => {
    updateFilters("page", page);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex gap-6">
        <aside className="w-1/6 bg-white p-4 rounded-lg shadow-md border border-gray-200 sticky top-32 h-fit">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filtry</h2>
            <button
              className="text-sm text-blue-500 hover:underline"
              onClick={resetFilters}
            >
              Wyczyść filtry
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-gray-700 font-medium">
                Data rozpoczęcia:
              </label>
              <input
                type="date"
                value={filters.startDateFrom}
                onChange={(e) => updateFilters("startDateFrom", e.target.value)}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
              />
              <input
                type="date"
                value={filters.startDateTo}
                onChange={(e) => updateFilters("startDateTo", e.target.value)}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
              />
            </div>
            <div>
              <label className="text-gray-700 font-medium">
                Limit uczestników:
              </label>
              <input
                type="number"
                placeholder="Od"
                value={filters.participantsLimitFrom}
                onChange={(e) =>
                  updateFilters("participantsLimitFrom", e.target.value)
                }
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                min="0"
              />
              <input
                type="number"
                placeholder="Do"
                value={filters.participantsLimitTo}
                onChange={(e) =>
                  updateFilters("participantsLimitTo", e.target.value)
                }
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                min="0"
              />
            </div>
            <button
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={fetchEvents}
            >
              Zastosuj filtry
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <header className="pt-5">
            <h1 className="text-3xl font-bold">Wydarzenia</h1>
            <p className="text-gray-600">
              Wybierz wydarzenie i dołącz do niego już teraz!
            </p>
          </header>
          <div className="flex justify-end mb-4">
            <select
              className="w-48 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.sortBy}
              onChange={(e) => updateFilters("sortBy", e.target.value)}
            >
              <option value="StartDate">Od najnowszych</option>
              <option value="ParticipantsLimit">
                Od najwięcej uczestników
              </option>
              <option value="Name">Alfabetycznie</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="relative bg-white border border-gray-200 rounded-lg p-6 shadow-lg"
              >
                <button className="absolute top-4 right-4 py-2 px-4 bg-primary text-white rounded-lg hover:bg-hover-background flex items-center gap-2">
                  Dołącz
                  <FontAwesomeIcon icon={faUserPlus} />
                </button>
                <h3 className="text-2xl font-semibold mb-4 pr-16">
                  {event.name}
                </h3>
                <p className="text-gray-700 mb-6 pr-16">{event.description}</p>
                <div className="text-gray-500">
                  <p>Organizator: {event.organizerId}</p>
                  <p>
                    <FontAwesomeIcon icon={faRoad} /> :{" "}
                    <Link
                      to={`/trail/${event.trailId}`}
                      className="text-blue-500 underline hover:text-blue-700"
                    >
                      Szczegóły trasy
                    </Link>
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faStopwatch} /> :{" "}
                    {new Date(event.startDate).toLocaleString("pl-PL", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faFlagCheckered} /> :{" "}
                    {new Date(event.endDate).toLocaleString("pl-PL", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faUsers} /> :{" "}
                    {event.participantsIds.length}/
                    {event.participantsLimit === 2147483647
                      ? "∞"
                      : event.participantsLimit}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            <button
              className={`w-10 h-10 rounded-full ${
                !filters.page > 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white"
              }`}
              disabled={filters.page <= 1}
              onClick={() => handlePageChange(filters.page - 1)}
            >
              &laquo;
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`w-10 h-10 rounded-full ${
                  filters.page === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className={`w-10 h-10 rounded-full ${
                filters.page >= totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white"
              }`}
              disabled={filters.page >= totalPages}
              onClick={() => handlePageChange(filters.page + 1)}
            >
              &raquo;
            </button>
          </div>
        </main>
      </div>
      <CustomAlert ref={alertRef} />
    </div>
  );
};

export default Events;