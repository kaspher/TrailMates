import React, { useState, useEffect } from "react";
import { FaImage, FaShareAlt } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { createActivity } from "../../services/activitiesApi";
import { updateTrailVisibility } from "../../services/trailsApi";
import { useNavigate } from "react-router-dom";
import loadingGif from "../../assets/img/loading.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const PublishActivityModal = ({ isOpen, onClose, trail }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [publishWithPost, setPublishWithPost] = useState(
    trail?.visibility === "Public" || false
  );

  useEffect(() => {
    if (trail?.visibility === "Public") {
      setPublishWithPost(true);
    }
  }, [trail]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);

    const newPreviewImages = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevPreviewImages) => [
      ...prevPreviewImages,
      ...newPreviewImages,
    ]);
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setPreviewImages((prevPreviews) => {
      URL.revokeObjectURL(prevPreviews[index]);
      return prevPreviews.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log(publishWithPost);
      if (publishWithPost) {
        const submitData = new FormData();
        submitData.append("title", formData.title);
        submitData.append("description", formData.description);
        submitData.append("ownerId", user.id);
        submitData.append("trailId", trail.id);
        submitData.append("isTrailCompletion", trail.isTrailCompletion);

        if (trail.isTrailCompletion) {
          submitData.append("trailCompletionId", trail.trailCompletionId);
        } else {
          submitData.append(
            "trailCompletionId",
            "00000000-0000-0000-0000-000000000000"
          );
        }

        images.forEach((image) => {
          submitData.append("pictures", image);
        });

        const activityId = await createActivity(submitData);
        navigate(`/blog/${activityId}`);
      } else {
        await updateTrailVisibility(trail.id);
      }

      onClose();
      setFormData({ title: "", description: "" });
      setImages([]);
      setPreviewImages([]);
    } catch (error) {
      console.error("Error publishing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isPublic = trail.visibility === "Public";
  const isDisabled = !publishWithPost && !isPublic;
  const disabledClass = isDisabled
    ? "opacity-50 pointer-events-none"
    : "opacity-100 pointer-events-auto";

  const isSubmitDisabled =
    isLoading ||
    (publishWithPost &&
      (formData.title.length < 1 || formData.description.length < 10));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-xl relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50 rounded-lg">
            <img src={loadingGif} alt="Loading..." className="w-16 h-16" />
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faTimes} className="text-xl" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
            <FaShareAlt className="text-green-600 text-2xl" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Publikacja trasy
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isPublic && (
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="publishWithPost"
                checked={publishWithPost}
                onChange={(e) => {
                  setPublishWithPost(e.target.checked);
                }}
                className="rounded border-gray-300 text-primary focus:ring-primary"
                disabled={isLoading}
              />
              <label
                htmlFor="publishWithPost"
                className={`text-sm font-medium ${
                  isLoading ? "text-gray-400" : "text-gray-700"
                }`}
              >
                Opublikuj z postem
              </label>
            </div>
          )}

          <div className={`transition-opacity duration-300 ${disabledClass}`}>
            <label
              className={`block text-sm font-medium ${
                isLoading ? "text-gray-400" : "text-gray-700"
              }`}
            >
              Tytuł
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              required={publishWithPost || isPublic}
              disabled={isDisabled || isLoading}
            />
            <p
              className={`text-sm mt-1 ${
                formData.title.length < 1 ? "text-red-500" : "text-green-500"
              }`}
            >
              Tytuł musi mieć co najmniej 1 znak
            </p>
          </div>

          <div className={`transition-opacity duration-300 ${disabledClass}`}>
            <label
              className={`block text-sm font-medium ${
                isLoading ? "text-gray-400" : "text-gray-700"
              }`}
            >
              Opis
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="4"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              placeholder="Dodaj opis swojej aktywności..."
              required={publishWithPost || isPublic}
              disabled={isDisabled || isLoading}
            />
            <p
              className={`text-sm mt-1 ${
                formData.description.length < 10
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              Opis musi mieć co najmniej 10 znaków (
              {formData.description.length}/10)
            </p>
          </div>

          <div className={`transition-opacity duration-300 ${disabledClass}`}>
            <label
              className={`block text-sm font-medium mb-2 ${
                isLoading ? "text-gray-400" : "text-gray-700"
              }`}
            >
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
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 hover:bg-red-600 disabled:bg-gray-400"
                    disabled={isDisabled || isLoading}
                  >
                    ×
                  </button>
                </div>
              ))}
              <label
                className={`flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg ${
                  isDisabled || isLoading
                    ? "border-gray-300 cursor-not-allowed"
                    : "border-gray-300 cursor-pointer hover:border-blue-500"
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isDisabled || isLoading}
                />
                <div className="text-center">
                  <FaImage
                    className={`mx-auto text-2xl ${
                      isLoading ? "text-gray-300" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`mt-2 block text-sm ${
                      isLoading ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Dodaj zdjęcia
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium min-w-[120px] disabled:bg-gray-100 disabled:text-gray-400"
              disabled={isLoading}
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`px-6 py-3 rounded-lg transition-colors font-medium min-w-[120px] ${
                isSubmitDisabled
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {isLoading ? "Publikowanie..." : "Opublikuj"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishActivityModal;
