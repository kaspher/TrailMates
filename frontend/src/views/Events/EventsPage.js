import React, { useEffect, useState, useRef, useCallback } from "react";
import Filters from "../../components/Events/Filters";
import EventList from "../../components/Events/EventList";
import Pagination from "../../components/Events/Pagination";
import CustomAlert from "../../components/UI/CustomAlert";
import loadingGif from "../../assets/img/loading.gif";
import { useAuth } from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const initialFilters = {
    startDateFrom: "",
    startDateTo: "",
    participantsLimitFrom: "",
    participantsLimitTo: "",
    sortBy: "StartDate",
    sortDescending: false,
    page: 1,
    pageSize: 10,
  };
  const [filters, setFilters] = useState(initialFilters);
  const [totalPages, setTotalPages] = useState(1);
  const alertRef = useRef();
  const [isMobileView, setIsMobileView] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const updateFilters = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => setFilters(initialFilters);

  const handleJoinEvent = async (eventId) => {
    if (!user) {
      alertRef.current?.showAlert(
        "Musisz być zalogowany, aby dołączyć.",
        "error"
      );
      return;
    }
    try {
      const response = await fetch(
        `https://localhost:7186/api/events/${eventId}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user.id),
        }
      );
      if (response.ok) {
        alertRef.current?.showAlert("Dołączono do wydarzenia!", "success");
        fetchEvents();
      } else {
        alertRef.current?.showAlert(
          "Błąd podczas dołączania do wydarzenia",
          "error"
        );
      }
    } catch (error) {
      alertRef.current?.showAlert(
        "Wystąpił błąd podczas dołączania do wydarzenia",
        "error"
      );
    }
  };

  const handleLeaveEvent = async (eventId) => {
    if (!user) {
      alertRef.current?.showAlert(
        "Musisz być zalogowany, aby opuścić wydarzenie.",
        "error"
      );
      return;
    }
    try {
      const response = await fetch(
        `https://localhost:7186/api/events/${eventId}/leave`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user.id),
        }
      );
      if (response.ok) {
        alertRef.current?.showAlert("Wydarzenie opuszczone!", "success");
        fetchEvents();
      } else {
        alertRef.current?.showAlert(
          "Błąd podczas opuszczania wydarzenia",
          "error"
        );
      }
    } catch (error) {
      alertRef.current?.showAlert(
        "Wystąpił błąd podczas opuszczania wydarzenia",
        "error"
      );
    }
  };

  return (
    <div
      className={`min-h-screen p-4 overflow-x-hidden ${isMobileView ? "relative" : "flex gap-6"}`}
    >
      {isMobileView && (
        <>
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`fixed z-50 bg-white p-2 shadow-lg border border-gray-300 transform -translate-y-1/2 ${
              isFiltersOpen ? "left-80" : "left-0"
            } top-1/2 transition-all`}
          >
            <FontAwesomeIcon
              icon={isFiltersOpen ? faChevronLeft : faChevronRight}
            />
          </button>
          <div
            className={`fixed top-0 left-0 z-40 bg-white h-full w-80 transition-transform transform ${
              isFiltersOpen ? "translate-x-0" : "-translate-x-full"
            } shadow-lg border-r border-gray-200`}
          >
            <Filters
              filters={filters}
              updateFilters={updateFilters}
              resetFilters={resetFilters}
            />
          </div>
        </>
      )}
      {!isMobileView && (
        <Filters
          filters={filters}
          updateFilters={updateFilters}
          resetFilters={resetFilters}
        />
      )}
      <main className={`${isMobileView ? "w-full" : "flex-1"}`}>
        <header className="pt-5">
          <h1
            className={`${isMobileView ? "text-2xl text-center" : "text-3xl"} font-bold`}
          >
            Wydarzenia
          </h1>
          <p className={`${isMobileView ? "text-center" : ""} text-gray-600`}>
            Wybierz wydarzenie i dołącz do niego już teraz!
          </p>
        </header>
        <div
          className={`flex ${isMobileView ? "justify-center" : "justify-end"} mt-4 mb-4`}
        >
          <select
            className="w-48 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.sortBy}
            onChange={(e) => updateFilters("sortBy", e.target.value)}
          >
            <option value="StartDate">Od najnowszych</option>
            <option value="ParticipantsLimit">Od najwięcej uczestników</option>
            <option value="Name">Alfabetycznie</option>
          </select>
        </div>
        {loading ? (
          <div className="flex justify-center mt-8">
            <img src={loadingGif} alt="Loading..." className="w-64 h-64" />
          </div>
        ) : (
          <EventList
            events={events}
            user={user}
            handleJoinEvent={handleJoinEvent}
            handleLeaveEvent={handleLeaveEvent}
          />
        )}
        <Pagination
          totalPages={totalPages}
          currentPage={filters.page}
          handlePageChange={(page) => updateFilters("page", page)}
        />
      </main>
      <CustomAlert ref={alertRef} />
    </div>
  );
};

export default EventsPage;
