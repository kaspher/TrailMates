import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { calculateDistance } from "../../utils/trailsUtils";
import { useNavigate } from "react-router-dom";
import { trailTypeTranslations } from "../../utils/mappings";

const cloudFrontDomainName =
  process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME_AVATARS;

const TrailPanel = ({ trails, isPanelOpen, togglePanel, onTrailClick }) => {
  const navigate = useNavigate();

  const handleAvatarClick = (e, ownerId) => {
    e.stopPropagation();
    navigate(`/profile/${ownerId}`);
  };

  return (
    <>
      <button
        onClick={togglePanel}
        className={`fixed z-50 bg-white p-2 shadow-lg border border-gray-300 transform -translate-y-1/2 ${
          isPanelOpen ? "right-80" : "right-0"
        } top-1/2 transition-all`}
      >
        <FontAwesomeIcon icon={isPanelOpen ? faChevronRight : faChevronLeft} />
      </button>
      <div
        className={`fixed top-1/2 right-0 z-40 bg-gray-100 h-[70%] w-80 transition-transform transform -translate-y-1/2 ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        } shadow-lg border-l border-gray-200 rounded-lg`}
      >
        <div className="p-4 overflow-y-auto h-full">
          <h2 className="text-xl font-bold mb-4">Trasy</h2>
          {trails.length === 0 ? (
            <div className="flex items-center justify-center">
              <p className="text-md text-gray-600">Brak dostępnych tras</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {trails.map((trail) => {
                const distance = calculateDistance(trail.coordinates);

                return (
                  <li
                    key={trail.id}
                    className="p-4 bg-white shadow-md rounded-lg border border-gray-200 relative cursor-pointer hover:border-primary transition-colors"
                    onClick={() => onTrailClick(trail)}
                  >
                    <div>
                      <div className="relative">
                        <div className="absolute top-0 right-0 transform translate-x-2 translate-y-[-8px]">
                          <div
                            className="relative group cursor-pointer"
                            onClick={(e) => handleAvatarClick(e, trail.ownerId)}
                          >
                            <img
                              src={cloudFrontDomainName + trail.ownerId}
                              alt={trail.ownerFullName}
                              className="w-6 h-6 rounded-full border border-gray-300 shadow-sm hover:border-primary"
                            />
                            <span className="absolute left-1/2 bottom-full mb-1 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              {trail.ownerFullName}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          {trail.name}
                        </h3>
                        <div className="text-sm text-gray-600 space-x-4">
                          <span>{trailTypeTranslations[trail.type]}</span>
                          <span>|</span>
                          <span>{distance} km</span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default TrailPanel;
