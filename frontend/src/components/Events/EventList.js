import React, { useState } from "react";
import EventCard from "./EventCard";
import CreateEventModal from "./CreateEventModal";
import { BASE_URL } from "../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const EventList = ({
  events,
  user,
  handleJoinEvent,
  handleLeaveEvent,
  fetchEventsData,
  alertRef,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateEvent = async (eventData) => {
    try {
      const response = await fetch(`${BASE_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        alertRef.current?.showAlert("Wydarzenie zostało utworzone!", "success");
        fetchEventsData();
        setIsCreateModalOpen(false);
      } else {
        alertRef.current?.showAlert(
          "Błąd podczas tworzenia wydarzenia",
          "error"
        );
      }
    } catch (error) {
      console.error("Błąd:", error);
      alertRef.current?.showAlert("Błąd podczas tworzenia wydarzenia", "error");
    }
  };

  return (
    <div className="container mx-auto px-4">
      {user ? (
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="mb-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-hover-background focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Stwórz wydarzenie</span>
        </button>
      ) : (
        <p className="text-gray-500 mb-4">
          Zaloguj się, aby utworzyć wydarzenie
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {events.map((event) => {
          const isUserJoined = event.participantsIds.includes(user?.id);
          return (
            <EventCard
              key={event.id}
              event={event}
              isUserJoined={isUserJoined}
              handleJoinEvent={handleJoinEvent}
              handleLeaveEvent={handleLeaveEvent}
              user={user}
            />
          );
        })}
      </div>
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEvent}
        user={user}
      />
    </div>
  );
};

export default EventList;
