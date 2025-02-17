import React, { useState, useEffect } from "react";
import { updateTrail, fetchPrivateUserTrails } from "../../services/trailsApi";
import { calculateDistance } from "../../utils/trailsUtils";
import { trailTypeTranslations } from "../../utils/mappings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPen } from "@fortawesome/free-solid-svg-icons";

const EditTrailModal = ({ isOpen, onClose, trail, user, setTrails }) => {
  const [formData, setFormData] = useState({
    name: trail?.name || "",
    type: trail?.type || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (trail) {
      setFormData({
        name: trail.name,
        type: trail.type,
      });
    }
  }, [trail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateTrail(trail.id, formData);
      const trailsData = await fetchPrivateUserTrails(user.id);
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
      onClose();
    } catch (error) {
      console.error("Error updating trail:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isSubmitting}
        >
          <FontAwesomeIcon icon={faTimes} className="text-xl" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faPen} className="text-blue-600 text-2xl" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Edytuj trasę
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nazwa
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Typ
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
              required
              disabled={isSubmitting}
            >
              <option value="">Wybierz typ</option>
              {Object.entries(trailTypeTranslations).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium min-w-[120px]"
              disabled={isSubmitting}
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-lg transition-colors font-medium min-w-[120px] ${
                isSubmitting
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Zapisywanie..." : "Zapisz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTrailModal;
