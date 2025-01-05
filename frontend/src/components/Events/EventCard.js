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
import {
  eventStatusColors,
  eventStatusTranslations,
} from "../../utils/statusMappings";

const EventCard = ({
  event,
  isUserJoined,
  handleJoinEvent,
  handleLeaveEvent,
}) => (
  <div className="relative bg-white border border-gray-200 rounded-lg p-6 pb-12 shadow-lg mb-8">
    <div className="flex justify-between items-start">
      <h3 className="text-2xl font-semibold">{event.name}</h3>
      <div
        className={`px-3 py-1 rounded text-white text-sm font-medium ${eventStatusColors[event.status]}`}
      >
        {eventStatusTranslations[event.status]}
      </div>
    </div>
    <p className="text-gray-700 my-4">{event.description}</p>
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
    <div className="relative group">
      <button
        onClick={() =>
          isUserJoined ? handleLeaveEvent(event.id) : handleJoinEvent(event.id)
        }
        disabled={event.status !== "Open"}
        className={`absolute bottom-[-24px] right-0 py-2 px-4 rounded-lg flex items-center gap-2 ${
          isUserJoined
            ? "bg-red-600 text-white hover:bg-red-700"
            : event.status !== "Open"
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-primary text-white hover:bg-hover-background"
        }`}
      >
        {isUserJoined ? "Opuść" : "Dołącz"}
        <FontAwesomeIcon icon={isUserJoined ? faSignOutAlt : faUserPlus} />
      </button>
      {event.status !== "Open" && (
        <span className="absolute right-0 bottom-[-60px] w-48 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity text-center">
          Nie można dołączyć (
          {eventStatusTranslations[event.status].toLowerCase()})
        </span>
      )}
    </div>
  </div>
);

export default EventCard;
