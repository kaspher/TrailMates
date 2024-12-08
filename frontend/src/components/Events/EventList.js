import React from "react";
import EventCard from "./EventCard";

const EventList = ({ events, user, handleJoinEvent, handleLeaveEvent }) => (
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
);

export default EventList;
