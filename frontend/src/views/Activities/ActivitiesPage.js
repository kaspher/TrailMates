import React, { useState, useEffect, useRef } from "react";
import { FaImage } from 'react-icons/fa';

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([
    //hardcoded data for now to test the layout, not copied from chat I promise
    {
      id: 1,
      sport: "Mountain Bike Ride",
      date: "Sat, 4/20/2024",
      title: "Afternoon Mountain Bike Ride",
      time: "1:22:30",
      distance: "14.91 km",
    },
    {
      id: 2,
      sport: "Mountain Bike Ride",
      date: "Sat, 7/15/2023",
      title: "Szybka oliva",
      time: "1:05:14",
      distance: "10.81 km",
    },
    {
      id: 3,
      sport: "Ride",
      date: "Sat, 4/29/2023",
      title: "Afternoon Ride",
      time: "2:06:47",
      distance: "29.94 km",
    },
    {
      id: 4,
      sport: "Ride",
      date: "Thu, 4/27/2023",
      title: "Luźny trip",
      time: "42:59",
      distance: "14.13 km",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [menuVisible, setMenuVisible] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = (index) => {
    setMenuVisible(menuVisible === index ? null : index);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const resetSort = () => {
    setSortConfig({ key: null, direction: "ascending" });
  };

  const parseTime = (time) => {
    const parts = time.split(":").map(Number);
    if (parts.length === 2) {
      const [minutes, seconds] = parts;
      return minutes * 60 + seconds;
    } else {
      const [hours, minutes, seconds] = parts;
      return hours * 3600 + minutes * 60 + seconds;
    }
  };

  const parseDate = (date) => {
    return new Date(date);
  };

  const sortedActivities = [...activities].sort((a, b) => {
    if (sortConfig.key === "time") {
      const timeA = parseTime(a.time);
      const timeB = parseTime(b.time);
      return sortConfig.direction === "ascending"
        ? timeA - timeB
        : timeB - timeA;
    } else if (sortConfig.key === "date") {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return sortConfig.direction === "ascending"
        ? dateA - dateB
        : dateB - dateA;
    } else {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    }
  });

  const filteredActivities = sortedActivities.filter(
    (activity) =>
      activity.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSelectedActivity((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === selectedActivity.id ? selectedActivity : activity
      )
    );
    handleModalClose();
  };

  const handlePublish = (activityId, visibility) => {
    console.log(`Publishing activity ${activityId} with visibility: ${visibility}`);
    setMenuVisible(null); 
  };

  const EditActivityModal = ({ isOpen, onClose, activity, onSave }) => {
    const [editedActivity, setEditedActivity] = useState(activity);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    useEffect(() => {
      if (activity) {
        setEditedActivity(activity);
        setDescription(activity.description || '');
        setImages([]);
        setPreviewImages([]);
      }
    }, [activity]);

    const handleImageChange = (e) => {
      const files = Array.from(e.target.files);
      setImages(prevImages => [...prevImages, ...files]);

      const newPreviewImages = files.map(file => URL.createObjectURL(file));
      setPreviewImages(prevPreviewImages => [...prevPreviewImages, ...newPreviewImages]);
    };

    const removeImage = (index) => {
      setImages(prevImages => prevImages.filter((_, i) => i !== index));
      setPreviewImages(prevPreviews => {
        URL.revokeObjectURL(prevPreviews[index]);
        return prevPreviews.filter((_, i) => i !== index);
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      const formData = new FormData();
      formData.append('name', editedActivity.name);
      formData.append('description', description);
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });
      
      
      try {
        await onSave(formData);
        onClose();
      } catch (error) {
        console.error('Error saving activity:', error);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Edytuj aktywność</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tytuł
              </label>
              <input
                type="text"
                value={editedActivity.name}
                onChange={(e) => setEditedActivity({...editedActivity, name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Opis
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Dodaj opis swojej aktywności..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zdjęcia
              </label>
              <div className="flex flex-wrap gap-4 mb-4">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="text-center">
                  <FaImage className="mx-auto text-gray-400 text-2xl" />
                  <span className="mt-2 block text-sm text-gray-600">
                    Dodaj zdjęcia
                  </span>
                </div>
              </label>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Anuluj
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Zapisz zmiany
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-8xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-800">Twoje aktywności</h1>
            {sortConfig.key && (
              <button
                onClick={resetSort}
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
              placeholder="Szukaj aktywności..."
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

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("sport")}
                >
                  <div className="flex items-center">
                    Sport
                    {sortConfig.key === "sport" && (
                      <span className="ml-2">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Data
                    {sortConfig.key === "date" && (
                      <span className="ml-2">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center">
                    Tytuł
                    {sortConfig.key === "title" && (
                      <span className="ml-2">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("time")}
                >
                  <div className="flex items-center">
                    Czas
                    {sortConfig.key === "time" && (
                      <span className="ml-2">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("distance")}
                >
                  <div className="flex items-center">
                    Dystans
                    {sortConfig.key === "distance" && (
                      <span className="ml-2">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredActivities.map((activity, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activity.sport}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activity.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.distance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleEditClick(activity)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edytuj
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Usuń
                      </button>
                      <div className="relative inline-block">
                        <button
                          onClick={() => toggleMenu(index)}
                          className="text-custom-green hover:text-custom-green flex items-center bg-gray-50 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          Publikuj
                          <svg
                            className={`w-4 h-4 ml-1 transform transition-transform text-custom-green ${
                              menuVisible === index ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {menuVisible === index && (
                          <div className="fixed transform translate-y-2 -translate-x-20 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[9999]">
                            <div className="py-1">
                              <button
                                onClick={() => handlePublish(activity.id, 'public')}
                                className="flex items-center w-full px-4 py-2 text-sm text-custom-green hover:bg-gray-100 transition-colors"
                              >
                                <svg 
                                  className="w-4 h-4 mr-2 text-custom-green" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" 
                                  />
                                </svg>
                                Opublikuj dla wszystkich
                              </button>
                              <button
                                onClick={() => handlePublish(activity.id, 'private')}
                                className="flex items-center w-full px-4 py-2 text-sm text-custom-green hover:bg-gray-100 transition-colors"
                              >
                                <svg 
                                  className="w-4 h-4 mr-2 text-custom-green" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                                  />
                                </svg>
                                Opublikuj tylko dla siebie
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <EditActivityModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          activity={selectedActivity}
          onSave={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default ActivitiesPage;
