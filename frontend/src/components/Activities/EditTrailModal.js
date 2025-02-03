import React, { useState, useEffect } from "react";
import { updateTrail, fetchPrivateUserTrails } from "../../services/trailsApi";
import { calculateDistance } from "../../utils/trailsUtils";
import { trailTypeTranslations } from "../../utils/mappings";

const EditTrailModal = ({ isOpen, onClose, trail, user, setTrails }) => {
  const [formData, setFormData] = useState({
    name: trail?.name || "",
    type: trail?.type || "",
  });

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
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edytuj trasę</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nazwa
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Typ
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Wybierz typ</option>
              {Object.entries(trailTypeTranslations).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Odrzuć
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Zapisz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTrailModal;
