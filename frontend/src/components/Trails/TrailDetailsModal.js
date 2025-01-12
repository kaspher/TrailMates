import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faUserPlus,
  faSignOutAlt,
  faLocationDot,
  faFlagCheckered,
} from "@fortawesome/free-solid-svg-icons";
import {
  trailTypeTranslations,
  eventStatusColors,
  eventStatusTranslations,
} from "../../utils/mappings";
import {
  calculateDistance,
  getAddressFromCoordinates,
} from "../../utils/trailsUtils";
import { fetchEvents, joinEvent, leaveEvent } from "../../services/eventsApi";
import { useAuth } from "../../hooks/useAuth";

const TrailDetailsModal = ({ trail, onClose }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const distance = calculateDistance(trail.coordinates);

  useEffect(() => {
    const fetchAddresses = async () => {
      const coordinates = trail.coordinates.sort((a, b) => a.order - b.order);
      if (coordinates.length > 0) {
        const start = coordinates[0];
        const end = coordinates[coordinates.length - 1];

        const startAddr = await getAddressFromCoordinates(
          start.longitude,
          start.latitude
        );
        const endAddr = await getAddressFromCoordinates(
          end.longitude,
          end.latitude
        );

        setStartAddress(startAddr || "Adres nieznany");
        setEndAddress(endAddr || "Adres nieznany");
      }
    };

    fetchAddresses();
  }, [trail.coordinates]);

  useEffect(() => {
    const fetchTrailEvents = async () => {
      try {
        const data = await fetchEvents({
          trailId: trail.id,
          statuses: { Open: true },
          page: 1,
          pageSize: 10,
          sortBy: "StartDate",
          sortDescending: false,
        });
        setEvents(data.items || []);
      } catch (error) {
        console.error("Error fetching trail events:", error);
      }
    };

    fetchTrailEvents();
  }, [trail.id]);

  const handleEventParticipation = async (eventId, isJoining) => {
    try {
      if (isJoining) {
        await joinEvent(eventId, user.id);
      } else {
        await leaveEvent(eventId, user.id);
      }

      const data = await fetchEvents({
        trailId: trail.id,
        statuses: { Open: true },
        page: 1,
        pageSize: 10,
        sortBy: "StartDate",
        sortDescending: false,
      });
      setEvents(data.items || []);
    } catch (error) {
      console.error("Error handling event participation:", error);
    }
  };

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 h-[70%] w-96 bg-white shadow-xl rounded-lg">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <FontAwesomeIcon icon={faTimes} className="text-xl" />
      </button>

      <div className="h-full overflow-y-auto p-6 custom-scrollbar">
        <h2 className="text-2xl font-bold text-secondary mb-4">{trail.name}</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-secondary mb-2">
              Szczegóły trasy
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Typ trasy</p>
                <p className="font-medium">
                  {trailTypeTranslations[trail.type]}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Długość</p>
                <p className="font-medium">{distance} km</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="text-primary"
                  />
                  <span>Start</span>
                </div>
                <p className="font-medium ml-6">{startAddress}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FontAwesomeIcon
                    icon={faFlagCheckered}
                    className="text-primary"
                  />
                  <span>Meta</span>
                </div>
                <p className="font-medium ml-6">{endAddress}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-secondary mb-2">Autor</h3>
            <div className="flex items-center space-x-3">
              <img
                src={`${process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME_AVATARS}${trail.ownerId}`}
                alt={trail.ownerFullName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="font-medium">{trail.ownerFullName}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-secondary mb-4">
              Nadchodzące wydarzenia
            </h3>
            {events.length === 0 ? (
              <p className="text-gray-500">
                Brak nadchodzących wydarzeń na tej trasie
              </p>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-secondary">
                        {event.name}
                      </h4>
                      <div
                        className={`px-2 py-1 rounded text-white text-xs font-medium ${
                          eventStatusColors[event.status]
                        }`}
                      >
                        {eventStatusTranslations[event.status]}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {event.description}
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">
                        {new Date(event.startDate).toLocaleDateString()}
                      </span>
                      {user && (
                        <button
                          onClick={() =>
                            handleEventParticipation(
                              event.id,
                              !event.participantsIds.includes(user.id)
                            )
                          }
                          className={`px-3 py-1 rounded-lg flex items-center gap-2 text-white text-sm ${
                            event.participantsIds.includes(user.id)
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-primary hover:bg-hover-background"
                          }`}
                        >
                          {event.participantsIds.includes(user.id) ? (
                            <>
                              Opuść
                              <FontAwesomeIcon icon={faSignOutAlt} />
                            </>
                          ) : (
                            <>
                              Dołącz
                              <FontAwesomeIcon icon={faUserPlus} />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailDetailsModal;
