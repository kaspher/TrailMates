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

  const tableCellClass = "p-2 border border-gray-300";
  const editButtonClass = "text-blue-500";
  const deleteButtonClass = "text-red-500";
  const publishButtonClass = "text-black";
  const popUpShareOptions = "block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-150 ease-in-out";
  const popUpMenuClass = "absolute right-0 mt-2 w-56 bg-white shadow-lg border rounded-lg z-50 overflow-hidden";

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
    <div className="max-w-5xl mx-auto my-2 bg-background p-5 shadow-md rounded-lg">
      <h1 className="text-4xl mb-5 text-primary">Twoje aktywności</h1>
      <div className="flex items-center mb-5 rounded-lg bg-background text-secondary">
        <input
          type="text"
          className="mr-2 p-2 border rounded w-full sm:w-1/4"
          placeholder="Szukaj po sporcie lub tytule"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="activities">
        <div className="flex items-center mb-2">
          <h2 className="text-xl text-primary mr-2">Lista aktywności</h2>
          {sortConfig.key && (
            <button
              onClick={resetSort}
              className="bg-red-500 text-white py-1 px-3 rounded-lg"
            >
              Reset Sort
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mb-5">
            <thead>
              <tr>
                <th
                  className={tableCellClass}
                  onClick={() => handleSort("sport")}
                >
                  Sport{" "}
                  {sortConfig.key === "sport" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th
                  className={tableCellClass}
                  onClick={() => handleSort("date")}
                >
                  Data{" "}
                  {sortConfig.key === "date" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th
                  className={tableCellClass}
                  onClick={() => handleSort("title")}
                >
                  Tytuł{" "}
                  {sortConfig.key === "title" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th
                  className={tableCellClass}
                  onClick={() => handleSort("time")}
                >
                  Czas{" "}
                  {sortConfig.key === "time" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th
                  className={tableCellClass}
                  onClick={() => handleSort("distance")}
                >
                  Dystans{" "}
                  {sortConfig.key === "distance" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th className={tableCellClass}>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((activity, index) => (
                <tr
                  key={index}
                  className="hover:bg-hover-background transition-all"
                >
                  <td className={tableCellClass}>{activity.sport}</td>
                  <td className={tableCellClass}>{activity.date}</td>
                  <td className={tableCellClass}>{activity.title}</td>
                  <td className={tableCellClass}>{activity.time}</td>
                  <td className={tableCellClass}>{activity.distance}</td>
                  <td className={tableCellClass}>
                    <div className="flex space-x-4 items-center">
                      <button
                        className={editButtonClass}
                        onClick={() => handleEditClick(activity)}
                      >
                        Edytuj
                      </button>
                      <button className={deleteButtonClass}>Usuń</button>
                      <div className="relative inline-block" ref={menuRef}>
                        <button
                          className={`${publishButtonClass} flex items-center`}
                          onClick={() => toggleMenu(index)}
                        >
                          Publikuj
                          <svg
                            className="w-4 h-4 ml-1"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
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
                          <div className={popUpMenuClass}>
                            <button 
                              onClick={() => handlePublish(activity.id, 'public')}
                              className={popUpShareOptions}
                            >
                              Opublikuj dla wszystkich
                            </button>
                            <button 
                              onClick={() => handlePublish(activity.id, 'private')}
                              className={popUpShareOptions}
                            >
                              Opublikuj tylko dla siebie
                            </button>
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
