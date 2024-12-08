import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faUsers,
  faRoad,
  faFlagCheckered,
  faStopwatch,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const EventCard = ({
  event,
  isUserJoined,
  handleJoinEvent,
  handleLeaveEvent,
  user,
}) => (
  <div className="relative bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
    <button
      onClick={() =>
        isUserJoined ? handleLeaveEvent(event.id) : handleJoinEvent(event.id)
      }
      className={`absolute top-4 right-4 py-2 px-4 rounded-lg flex items-center gap-2 ${
        isUserJoined
          ? "bg-red-600 text-white hover:bg-red-700"
          : "bg-primary text-white hover:bg-hover-background"
      }`}
    >
      {isUserJoined ? "Opuść" : "Dołącz"}
      <FontAwesomeIcon icon={isUserJoined ? faSignOutAlt : faUserPlus} />
    </button>
    <h3 className="text-2xl font-semibold mb-4 pr-16">{event.name}</h3>
    <p className="text-gray-700 mb-6 pr-16">{event.description}</p>
    <div className="text-gray-500">
      <p>Organizator: {event.fullName}</p>
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
        })}
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
        <FontAwesomeIcon icon={faUsers} /> : {event.participantsIds.length}/
        {event.participantsLimit === 2147483647 ? "∞" : event.participantsLimit}
      </p>
    </div>
  </div>
);

export default EventCard;
