import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaComment, FaHeart } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import loadingGif from "../../assets/img/loading.gif";
import {
  addLike,
  addComment,
  removeLike,
  fetchActivity,
} from "../../services/activitiesApi";
import { getUserById } from "../../services/usersApi";
import { calculateDistance } from "../../utils/trailsUtils";
import { getTrailById } from "../../services/trailsApi";

const DetailedPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [staticMap, setStaticMap] = useState(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentAuthors, setCommentAuthors] = useState({});
  const [distance, setDistance] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const fetchCommentAuthors = async (comments) => {
    const uniqueUserIds = [
      ...new Set(comments.map((comment) => comment.userId)),
    ];
    const authors = {};

    await Promise.all(
      uniqueUserIds.map(async (userId) => {
        try {
          const userData = await getUserById(userId);
          authors[userId] = `${userData.firstName} ${userData.lastName}`;
        } catch (error) {
          console.error(`Error fetching user data for ${userId}:`, error);
          authors[userId] = "Użytkownik";
        }
      })
    );

    setCommentAuthors((prev) => ({ ...prev, ...authors }));
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const activity = await fetchActivity(postId);
        if (!activity) {
          console.error("Activity not found");
          return;
        }

        const trailData = await getTrailById(activity.trailId);

        if (activity.comments && activity.comments.length > 0) {
          await fetchCommentAuthors(activity.comments);
        }

        const formattedPost = {
          id: activity.id,
          title: activity.title,
          description: activity.description,
          comments: activity.comments || [],
          likes: activity.likes || [],
          ownerId: activity.ownerId,
          ownerFullName: activity.ownerFullName,
          createdAt: activity.createdAt,
          type: trailData.type,
          visibility: trailData.visibility,
          picturesNames: activity.picturesNames || [],
          route: trailData.coordinates.map((coord) => ({
            lng: coord.longitude,
            lat: coord.latitude,
          })),
          location: `${trailData.coordinates[0].latitude.toFixed(
            3
          )}°N, ${trailData.coordinates[0].longitude.toFixed(3)}°E`,
          pace: "3:45",
          duration: "1:30:00",
        };

        setPost(formattedPost);

        if (trailData.coordinates && trailData.coordinates.length > 0) {
          const formattedCoordinates = trailData.coordinates.map((coord) => ({
            latitude: coord.latitude,
            longitude: coord.longitude,
          }));
          setDistance(calculateDistance(formattedCoordinates));

          const coordinates = trailData.coordinates.map((coord) => [
            coord.longitude,
            coord.latitude,
          ]);
          const simplifiedCoordinates = coordinates.filter(
            (_, index) =>
              index === 0 ||
              index === coordinates.length - 1 ||
              index % Math.ceil(coordinates.length / 20) === 0
          );

          const coordsString = simplifiedCoordinates
            .map((coord) => coord.join(","))
            .join(";");

          const directionsResponse = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/walking/${coordsString}?geometries=geojson&access_token=${mapboxgl.accessToken}`
          );
          const directionsData = await directionsResponse.json();
          const routeCoordinates =
            directionsData.routes[0].geometry.coordinates;

          const bounds = routeCoordinates.reduce(
            (acc, coord) => ({
              minLng: Math.min(acc.minLng, coord[0]),
              maxLng: Math.max(acc.maxLng, coord[0]),
              minLat: Math.min(acc.minLat, coord[1]),
              maxLat: Math.max(acc.maxLat, coord[1]),
            }),
            {
              minLng: routeCoordinates[0][0],
              maxLng: routeCoordinates[0][0],
              minLat: routeCoordinates[0][1],
              maxLat: routeCoordinates[0][1],
            }
          );

          const center = {
            lng: (bounds.minLng + bounds.maxLng) / 2,
            lat: (bounds.minLat + bounds.maxLat) / 2,
          };

          const latDiff = bounds.maxLat - bounds.minLat;
          const lngDiff = bounds.maxLng - bounds.minLng;
          const maxDiff = Math.max(latDiff, lngDiff);
          const zoom = Math.min(
            14,
            Math.max(9, Math.floor(11 - Math.log2(maxDiff * 111)))
          );

          const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/geojson(%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22stroke%22%3A%22%23ff0000%22%2C%22stroke-width%22%3A2%7D%2C%22geometry%22%3A%7B%22type%22%3A%22LineString%22%2C%22coordinates%22%3A${JSON.stringify(
            routeCoordinates
          )}%7D%7D)/${center.lng},${
            center.lat
          },${zoom}/800x400@2x?access_token=${mapboxgl.accessToken}`;

          setStaticMap(staticMapUrl);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLike = async () => {
    if (!user) return;

    try {
      const existingLike = post?.likes.find((like) => like.userId === user.id);

      if (existingLike) {
        await removeLike(existingLike.id);
        setPost((prevPost) => ({
          ...prevPost,
          likes: prevPost.likes.filter((like) => like.userId !== user.id),
        }));
      } else {
        await addLike(post.id, user.id);
        const activity = await fetchActivity(post.id);
        if (activity) {
          setPost((prevPost) => ({
            ...prevPost,
            likes: activity.likes || [],
          }));
        }
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      const userData = await getUserById(user.id);
      const result = await addComment(post.id, user.id, newComment.trim());

      const newCommentObj = result || {
        userId: user.id,
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
      };

      setCommentAuthors((prev) => ({
        ...prev,
        [user.id]: `${userData.firstName} ${userData.lastName}`,
      }));

      setPost((prevPost) => ({
        ...prevPost,
        comments: [...prevPost.comments, newCommentObj].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ),
      }));
      setNewComment("");
      setShowCommentInput(false);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const formatDate = (dateString, isFromDatabase = true) => {
    const date = new Date(dateString);

    if (isFromDatabase) {
      date.setHours(date.getHours() + 1);
    }

    return date.toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAvatarClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src={loadingGif} alt="Loading..." className="w-64 h-64" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-xl text-gray-600">
          Nie znaleziono aktywności
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-5xl space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <img
              src={`${process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME_AVATARS}${post.ownerId}`}
              alt="User Profile"
              className="rounded-full w-10 h-10 mr-3 cursor-pointer"
              onClick={() => handleAvatarClick(post.ownerId)}
            />
            <div>
              <h3
                className="text-lg font-bold cursor-pointer hover:text-blue-600"
                onClick={() => handleAvatarClick(post.ownerId)}
              >
                {post.ownerFullName}
              </h3>
              <div className="flex flex-col text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <span>{formatDate(post.createdAt)}</span>
                  <span className="text-blue-500">#{post.type}</span>
                  <span>{post.visibility}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{post.location}</span>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
          <p className="text-gray-600 mb-4 text-base">{post.description}</p>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg shadow-sm">
              <div className="text-xl font-bold">{distance} km</div>
              <div className="text-sm text-gray-500">Dystans</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg shadow-sm">
              <div className="text-xl font-bold">{post.pace} /km</div>
              <div className="text-sm text-gray-500">Tempo</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg shadow-sm">
              <div className="text-xl font-bold">{post.duration}</div>
              <div className="text-sm text-gray-500">Czas</div>
            </div>
          </div>

          {staticMap && (
            <div className="mb-4">
              <img
                src={staticMap}
                alt="Trail map"
                className="w-full rounded-lg shadow-md"
              />
            </div>
          )}

          {post.picturesNames && post.picturesNames.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-4">Zdjęcia z trasy</h2>
              <div className="relative overflow-hidden rounded-lg shadow-md">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {post.picturesNames.map((pictureName, index) => {
                    return (
                      <div key={index} className="w-full flex-shrink-0">
                        <img
                          src={`${process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME_POSTS}${pictureName}`}
                          alt={`Activity ${index + 1}`}
                          className="w-full h-[400px] object-contain bg-gray-100"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                {post.picturesNames.length > 1 && (
                  <>
                    {currentSlide > 0 && (
                      <button
                        onClick={() =>
                          goToSlide(
                            (currentSlide - 1 + post.picturesNames.length) %
                              post.picturesNames.length
                          )
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                        aria-label="Previous image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                          />
                        </svg>
                      </button>
                    )}
                    {currentSlide < post.picturesNames.length - 1 && (
                      <button
                        onClick={() =>
                          goToSlide(
                            (currentSlide + 1) % post.picturesNames.length
                          )
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                        aria-label="Next image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </button>
                    )}
                  </>
                )}
                {post.picturesNames.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {post.picturesNames.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full ${
                          currentSlide === index ? "bg-white" : "bg-white/50"
                        } hover:bg-white transition-opacity`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 ${
                post.likes.some((like) => like.userId === user?.id)
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              <FaHeart className="text-lg" />
              <span>{post.likes.length}</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">
            Komentarze ({post.comments.length})
          </h2>
          <div className="max-h-[400px] overflow-y-auto mb-4">
            {post.comments
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((comment, index) => (
                <div key={index} className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-1">
                    <div className="flex items-center flex-1">
                      <img
                        src={`${process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME_AVATARS}${comment.userId}`}
                        alt="User"
                        className="w-6 h-6 rounded-full mr-2 cursor-pointer hover:opacity-80"
                        onClick={() => handleAvatarClick(comment.userId)}
                      />
                      <div>
                        <span
                          className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer text-sm"
                          onClick={() => handleAvatarClick(comment.userId)}
                        >
                          {commentAuthors[comment.userId] || "Użytkownik"}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatDate(comment.createdAt, !!comment.id)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm pl-8">
                    {comment.content}
                  </p>
                </div>
              ))}
          </div>

          {!showCommentInput ? (
            <button
              onClick={() => setShowCommentInput(true)}
              className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors"
            >
              <FaComment />
              <span>Dodaj komentarz</span>
            </button>
          ) : (
            <div className="mt-3 flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Dodaj komentarz..."
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={() => {
                  handleComment();
                  setShowCommentInput(false);
                }}
                disabled={!newComment.trim()}
                className={`px-4 py-2 text-white rounded transition-colors ${
                  newComment.trim()
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Dodaj
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedPost;
