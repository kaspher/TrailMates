import React, { useState, useEffect } from 'react';
import { fetchPublicUserTrails } from '../../services/trailsApi';

const CreateEventModal = ({ isOpen, onClose, onSubmit, user }) => {
  const defaultStartDate = new Date().toISOString();
  const defaultEndDate = new Date(new Date().getTime() + 60*60*1000).toISOString(); 

  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    trailId: '',
    participantsLimit: 12,
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  });
  const [availableTrails, setAvailableTrails] = useState([]);

  useEffect(() => {
    const loadTrails = async () => {
      if (isOpen && user?.id) {
        try {
          const trails = await fetchPublicUserTrails(user.id);
          setAvailableTrails(trails);
        } catch (error) {
          console.error('Wystąpił błąd podczas pobierania tras:', error);
        }
      }
    };

    loadTrails();
  }, [isOpen, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventDataToSend = {
      name: eventData.name,
      description: eventData.description,
      organizerId: user.id,
      trailId: eventData.trailId,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      participantsLimit: eventData.participantsLimit
    };
    
    
    onSubmit(eventDataToSend);
    onClose();
  };

  const handleStartDateChange = (e) => {
    const newStartDate = new Date(e.target.value);
    const newEndDate = new Date(newStartDate.getTime() + 60*60*1000);
    setEventData({
      ...eventData,
      startDate: newStartDate.toISOString(),
      endDate: newEndDate.toISOString()
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Stwórz nowe wydarzenie</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nazwa wydarzenia:
            </label>
            <input
              type="text"
              value={eventData.name}
              onChange={(e) => setEventData({...eventData, name: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Opis:
            </label>
            <textarea
              value={eventData.description}
              onChange={(e) => setEventData({...eventData, description: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Data rozpoczęcia:
            </label>
            <input
              type="datetime-local"
              value={eventData.startDate.slice(0, 16)}
              onChange={handleStartDateChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Data zakończenia:
            </label>
            <input
              type="datetime-local"
              value={eventData.endDate.slice(0, 16)}
              onChange={(e) => setEventData({...eventData, endDate: new Date(e.target.value).toISOString()})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Limit uczestników:
            </label>
            <input
              type="number"
              min="1"
              value={eventData.participantsLimit}
              onChange={(e) => setEventData({...eventData, participantsLimit: parseInt(e.target.value)})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Wybierz trasę:
            </label>
            <select
              value={eventData.trailId}
              onChange={(e) => setEventData({...eventData, trailId: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Wybierz trasę</option>
              {availableTrails.map(trail => (
                <option key={trail.id} value={trail.id}>
                  {trail.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Utwórz wydarzenie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal; 