import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  fetchUserTrails,
  getTrailById,
  fetchTrailCompletions,
  deleteTrail,
} from "../../services/trailsApi";
import { getUserById } from "../../services/usersApi";
import { calculateDistance } from "../../utils/trailsUtils";
import {
  trailTypeTranslations,
  visibilityTranslations,
} from "../../utils/mappings";
import loadingGif from "../../assets/img/loading.gif";
import PublishActivityModal from "../../components/Activities/PublishActivityModal";
import EditTrailModal from "../../components/Activities/EditTrailModal";
import DeleteTrailModal from "../../components/Activities/DeleteTrailModal";

const ActivitiesPage = () => {
  const { user } = useAuth();
  const [trails, setTrails] = useState([]);
  const [completedTrails, setCompletedTrails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [deletingTrailId, setDeletingTrailId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [trailToDelete, setTrailToDelete] = useState(null);

  useEffect(() => {
    const fetchAllTrails = async () => {
      if (!user) return;

      try {
        setLoading(true);

        const trailsData = await fetchUserTrails(user.id);
        const trailsWithStats = trailsData.map((trail) => {
          const distance = calculateDistance(trail.coordinates);
          const time = trail.time;
          const [hours, minutes, seconds] = time.split(":").map(Number);
          const timeInHours = hours + minutes / 60 + seconds / 3600;
          const pace = distance / timeInHours;

          return {
            ...trail,
            distance: distance,
            time,
            pace: `${pace.toFixed(2)} km/h`,
            isOwned: true,
          };
        });

        const completionsData = await fetchTrailCompletions(user.id);
        const completedTrailsData = await Promise.all(
          completionsData.map(async (completion) => {
            const trailData = await getTrailById(completion.trailId);
            const distance = calculateDistance(trailData.coordinates);
            const [hours, minutes, seconds] = completion.time
              .split(":")
              .map(Number);
            const timeInHours = hours + minutes / 60 + seconds / 3600;
            const pace = distance / timeInHours;

            const authorData = await getUserById(trailData.ownerId);
            const authorFullName = `${authorData.firstName} ${authorData.lastName}`;

            return {
              ...trailData,
              distance: distance,
              time: completion.time,
              pace: `${pace.toFixed(2)} km/h`,
              isOwned: false,
              authorFullName,
              trailCompletionId: completion.id,
            };
          })
        );

        setTrails(trailsWithStats);
        setCompletedTrails(completedTrailsData);
      } catch (error) {
        console.error("Error fetching trails:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTrails();
  }, [user]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const allTrails = [...trails, ...completedTrails];
  const filteredTrails = allTrails.filter(
    (trail) =>
      trail.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trail.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTrails = [...filteredTrails].sort((a, b) => {
    if (!sortConfig.key) return 0;

    if (sortConfig.key === "pace") {
      const paceA = parseFloat(a.pace);
      const paceB = parseFloat(b.pace);
      return sortConfig.direction === "ascending"
        ? paceA - paceB
        : paceB - paceA;
    }

    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const handleEditClick = (trail) => {
    setSelectedTrail(trail);
    setIsEditModalOpen(true);
  };

  const handlePublishClick = (trail) => {
    const completedTrail = !trail.isOwned
      ? completedTrails.find((ct) => ct.id === trail.id)
      : null;

    setSelectedTrail({
      ...trail,
      isTrailCompletion: !trail.isOwned,
      trailCompletionId: completedTrail?.trailCompletionId,
      time: completedTrail?.time || trail.time,
    });
    setIsPublishModalOpen(true);
  };

  const handleEditModalClose = async () => {
    setIsEditModalOpen(false);

    try {
      const trailsData = await fetchUserTrails(user.id);
      const trailsWithStats = trailsData.map((trail) => {
        const distance = calculateDistance(trail.coordinates);
        const time = trail.time;
        const [hours, minutes, seconds] = time.split(":").map(Number);
        const timeInHours = hours + minutes / 60 + seconds / 3600;
        const pace = distance / timeInHours;

        return {
          ...trail,
          distance: distance,
          time,
          pace: `${pace.toFixed(2)} km/h`,
          isOwned: true,
        };
      });

      setTrails(trailsWithStats);

      // Znajdź zaktualizowaną trasę i zaktualizuj selectedTrail
      if (selectedTrail) {
        const updatedTrail = trailsWithStats.find(
          (t) => t.id === selectedTrail.id
        );
        if (updatedTrail) {
          setSelectedTrail(updatedTrail);
        }
      }
    } catch (error) {
      console.error("Error refreshing trails:", error);
      setSelectedTrail(null);
    }
  };

  const handlePublishModalClose = () => {
    setIsPublishModalOpen(false);
    setSelectedTrail(null);
  };

  const handleDelete = async (trail) => {
    setTrailToDelete(trail);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeletingTrailId(trailToDelete.id);
      await deleteTrail(trailToDelete.id);
      setTrails(trails.filter((trail) => trail.id !== trailToDelete.id));
    } catch (error) {
      console.error("Error deleting trail:", error);
    } finally {
      setDeletingTrailId(null);
      setIsDeleteModalOpen(false);
      setTrailToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setTrailToDelete(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-8xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Twoje trasy
            </h1>
            {sortConfig.key && (
              <button
                onClick={() =>
                  setSortConfig({ key: null, direction: "ascending" })
                }
                className="flex items-center px-3 py-1 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Reset sortowania
              </button>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Szukaj tras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center mt-8">
            <img src={loadingGif} alt="Loading..." className="w-64 h-64" />
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin relative">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center justify-center">
                      Nazwa
                      {sortConfig.key === "name" && (
                        <span className="ml-2">
                          {sortConfig.direction === "ascending" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("type")}
                  >
                    <div className="flex items-center justify-center">
                      Typ
                      {sortConfig.key === "type" && (
                        <span className="ml-2">
                          {sortConfig.direction === "ascending" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("distance")}
                  >
                    <div className="flex items-center justify-center">
                      Dystans
                      {sortConfig.key === "distance" && (
                        <span className="ml-2">
                          {sortConfig.direction === "ascending" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("time")}
                  >
                    <div className="flex items-center justify-center">
                      Czas
                      {sortConfig.key === "time" && (
                        <span className="ml-2">
                          {sortConfig.direction === "ascending" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("pace")}
                  >
                    <div className="flex items-center justify-center">
                      Tempo
                      {sortConfig.key === "pace" && (
                        <span className="ml-2">
                          {sortConfig.direction === "ascending" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("visibility")}
                  >
                    <div className="flex items-center justify-center">
                      Widoczność
                      {sortConfig.key === "visibility" && (
                        <span className="ml-2">
                          {sortConfig.direction === "ascending" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedTrails.map((trail) => (
                  <tr
                    key={`${trail.id}-${
                      !trail.isOwned ? "completion" : "original"
                    }`}
                    className={`hover:bg-gray-50 transition-colors ${
                      !trail.isOwned ? "bg-gray-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      {trail.name}
                      {!trail.isOwned && (
                        <div className="text-xs text-gray-500">
                          Autorstwa: {trail.ownerFullName}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {trailTypeTranslations[trail.type] || trail.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {trail.distance} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {trail.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {trail.pace}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {visibilityTranslations[trail.visibility] ||
                        trail.visibility}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex justify-center items-center space-x-2">
                        {trail.isOwned ? (
                          <>
                            <button
                              onClick={() => handleEditClick(trail)}
                              className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-4 py-2 rounded-lg transition-colors w-24"
                            >
                              Edytuj
                            </button>
                            <div className="relative group">
                              <button
                                className={`px-4 py-2 rounded-lg transition-colors w-24 ${
                                  trail.visibility === "Private"
                                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                                onClick={() => {
                                  if (trail.visibility === "Private") {
                                    handleDelete(trail);
                                  }
                                }}
                                disabled={trail.visibility !== "Private"}
                              >
                                Usuń
                              </button>
                              {trail.visibility !== "Private" && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  Nie możesz usunąć publicznej trasy
                                </div>
                              )}
                            </div>
                          </>
                        ) : null}
                        <button
                          onClick={() => handlePublishClick(trail)}
                          className="bg-green-200 text-green-700 hover:bg-green-300 px-4 py-2 rounded-lg transition-colors w-24"
                        >
                          Publikuj
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EditTrailModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        trail={selectedTrail}
        user={user}
        setTrails={setTrails}
      />
      <PublishActivityModal
        isOpen={isPublishModalOpen}
        onClose={handlePublishModalClose}
        trail={selectedTrail}
      />
      <DeleteTrailModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        trailName={trailToDelete?.name}
        isDeleting={deletingTrailId === trailToDelete?.id}
      />
    </div>
  );
};

export default ActivitiesPage;
