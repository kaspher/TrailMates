import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../../services/usersApi";
import { fetchUserTrails } from "../../services/trailsApi";
import { fetchUserEvents } from "../../services/eventsApi";
import { fetchTrailCompletions, getTrailById } from "../../services/trailsApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import loadingGif from "../../assets/img/loading.gif";

const eventStatusColors = {
  Open: "bg-green-500",
  Active: "bg-blue-500",
  Cancelled: "bg-red-500",
  Completed: "bg-gray-500",
};

const eventStatusTranslations = {
  Open: "Otwarte",
  Active: "W trakcie",
  Cancelled: "Anulowane",
  Completed: "Zakończone",
};

const trailTypeTranslations = {
  Cycling: "Kolarstwo",
  Running: "Bieganie",
  Trekking: "Trekking",
};

const UserStatisticsPage = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userTrails, setUserTrails] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [trailCompletions, setTrailCompletions] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getUserById(userId);
        setUser(userData);

        const [trailsData, eventsData, completionsData] = await Promise.all([
          fetchUserTrails(userId),
          fetchUserEvents(userId),
          fetchTrailCompletions(userId),
        ]);

        setUserTrails(trailsData);
        setUserEvents(eventsData);

        const completionDetails = await Promise.all(
          completionsData.map(async (completion) => {
            try {
              const trailDetails = await getTrailById(completion.trailId);
              return {
                ...completion,
                trailName: trailDetails.name,
                trailType: trailDetails.type,
                trailOwnerFullName: trailDetails.ownerFullName,
              };
            } catch (error) {
              console.error(`Error fetching trail details: ${error}`);
              return {
                ...completion,
                trailName: "Unknown",
                trailType: "Unknown",
                trailOwnerFullName: "Unknown",
              };
            }
          })
        );

        setTrailCompletions(completionDetails);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src={loadingGif} alt="Loading..." className="w-16 h-16" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto mt-6 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Użytkownik nie został znaleziony.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-6 p-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={`${process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME_AVATARS}${userId}`}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-dark">{`${user.firstName} ${user.lastName}`}</h1>
            <p className="text-gray-600">
              {[user.city, user.country].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-dark">Dodane trasy</h2>
          {userTrails.length === 0 ? (
            <p className="text-gray-500">Brak dodanych tras.</p>
          ) : (
            <div className="space-y-4">
              {userTrails.map((trail) => (
                <div
                  key={trail.id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-dark">{trail.name}</h3>
                    <div className="px-2 py-1 rounded border border-gray-300 bg-white">
                      <FontAwesomeIcon
                        icon={
                          trail.visibility === "Public" ? faLockOpen : faLock
                        }
                        className="text-gray-500"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{trail.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    {trail.time && (
                      <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                        Czas: {trail.time}
                      </span>
                    )}
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                      {trailTypeTranslations[trail.type]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-dark">
            Dodane wydarzenia
          </h2>
          {userEvents.length === 0 ? (
            <p className="text-gray-500">Brak dodanych wydarzeń.</p>
          ) : (
            <div className="space-y-4">
              {userEvents.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-dark">{event.name}</h3>
                    <div
                      className={`px-3 py-1 rounded text-white text-sm font-medium ${
                        eventStatusColors[event.status]
                      }`}
                    >
                      {eventStatusTranslations[event.status]}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                    <span>
                      Data: {new Date(event.startDate).toLocaleDateString()}
                    </span>
                    <span>
                      Uczestnicy: {event.participantsIds.length}/
                      {event.participantsLimit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-dark">
          Ukończenia tras
        </h2>
        {trailCompletions.length === 0 ? (
          <p className="text-gray-500">Brak ukończonych tras.</p>
        ) : (
          <div className="space-y-4">
            {trailCompletions.map((completion) => (
              <div
                key={completion.id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-dark">
                    {completion.trailName}
                  </h3>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                    {trailTypeTranslations[completion.trailType]}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                    Czas: {completion.time}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                    Autor trasy: {completion.trailOwnerFullName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStatisticsPage;
