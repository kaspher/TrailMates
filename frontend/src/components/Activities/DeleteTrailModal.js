import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";

const DeleteTrailModal = ({
  isOpen,
  onClose,
  onConfirm,
  trailName,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isDeleting}
        >
          <FontAwesomeIcon icon={faTimes} className="text-xl" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faTrash} className="text-red-600 text-2xl" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Potwierdzenie usunięcia
        </h2>

        <p className="text-gray-600 text-center mb-8 text-lg">
          Czy na pewno chcesz usunąć trasę{" "}
          <span className="italic">"{trailName}"</span>?
          <br />
          Tej operacji nie można cofnąć.
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium min-w-[120px]"
            disabled={isDeleting}
          >
            Anuluj
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className={`px-6 py-3 rounded-lg transition-colors font-medium min-w-[120px] ${
              isDeleting
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {isDeleting ? "Usuwanie..." : "Usuń"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTrailModal;
