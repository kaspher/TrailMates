import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { FaComment, FaHeart } from "react-icons/fa";
import { TrashIcon } from "../../assets/icons/trash";
import loadingGif from "../../assets/img/loading.gif";
import {
  getAllActivities,
  addLike,
  addComment,
  removeLike,
  deleteComment,
} from "../../services/activitiesApi";
import { getTrailById } from "../../services/trailsApi";
import { getUserById } from "../../services/usersApi";
import { useAuth } from "../../hooks/useAuth";
import { calculateDistance } from "../../utils/trailsUtils";

const BlogPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentAuthors, setCommentAuthors] = useState({});
  const [staticMaps, setStaticMaps] = useState({});

  const toggleComments = (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      setShowCommentInput(false);
    } else {
      setExpandedPostId(postId);
      setShowCommentInput(false);
    }
    setNewComment("");
  };

  const handleLike = async (postId) => {
    if (!user) return;

    try {
      const post = posts.find((post) => post.id === postId);

      const existingLike = post?.likes.find((like) => like.userId === user.id);

      if (existingLike) {
        await removeLike(existingLike.id);
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                likes: post.likes.filter((like) => like.userId !== user.id),
              };
            }
            return post;
          })
        );
      } else {
        await addLike(postId, user.id);
        const activities = await getAllActivities(1, 20);
        const updatedPost = activities.find(
          (activity) => activity.id === postId
        );
        if (updatedPost) {
          setPosts((prevPosts) =>
            prevPosts.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  likes: updatedPost.likes || [],
                };
              }
              return post;
            })
          );
        }
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleComment = async (postId) => {
    if (!user || !newComment.trim()) return;

    try {
      const userData = await getUserById(user.id);
      const result = await addComment(postId, user.id, newComment.trim());

      const newCommentObj = result || {
        userId: user.id,
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
      };

      setCommentAuthors((prev) => ({
        ...prev,
        [user.id]: `${userData.firstName} ${userData.lastName}`,
      }));

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [...post.comments, newCommentObj].sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                ),
              }
            : post
        )
      );
      setNewComment("");
      setShowCommentInput(false);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    try {
      await deleteComment(commentId, postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) => ({
          ...post,
          comments: post.comments.filter((comment) => comment.id !== commentId),
        }))
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
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
    const fetchActivities = async () => {
      try {
        const activities = await getAllActivities(1, 20);

        const formattedPosts = await Promise.all(
          activities.map(async (activity) => {
            if (!activity || !activity.trailId) return null;

            try {
              const trailData = await getTrailById(activity.trailId);
              if (
                !trailData ||
                !trailData.coordinates ||
                !trailData.coordinates.length
              )
                return null;

              if (activity.comments && activity.comments.length > 0) {
                await fetchCommentAuthors(activity.comments);
              }

              const centerCoord =
                trailData.coordinates[
                  Math.floor(trailData.coordinates.length / 2)
                ];
              const distance = calculateDistance(trailData.coordinates);
              const isTrailCompletion = activity.isTrailCompletion;

              let timeToUse;
              if (isTrailCompletion) {
                console.log(activity);
                console.log(trailData.trailCompletions);
                const userCompletion = trailData.trailCompletions?.find(
                  (completion) => completion.id === activity.trailCompletionId
                );
                timeToUse = userCompletion?.time || trailData.time;
              } else {
                timeToUse = trailData.time;
              }

              const [hours, minutes, seconds] = timeToUse
                .split(":")
                .map(Number);
              const timeInHours = hours + minutes / 60 + seconds / 3600;
              const pace = distance / timeInHours;

              return {
                id: activity.id,
                title: activity.title,
                description: activity.description,
                comments: activity.comments || [],
                likes: activity.likes || [],
                user: {
                  id: activity.ownerId,
                  name: activity.ownerFullName,
                  avatar: `${process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME_AVATARS}${activity.ownerId}`,
                  date: new Date(activity.createdAt).toLocaleDateString(
                    "pl-PL",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  ),
                  location: `${centerCoord.latitude.toFixed(
                    3
                  )}°N, ${centerCoord.longitude.toFixed(3)}°E`,
                },
                route: trailData.coordinates.map((coord) => ({
                  lng: coord.longitude,
                  lat: coord.latitude,
                })),
                distance: distance,
                time: timeToUse,
                pace: `${pace.toFixed(2)} km/h`,
                trailId: activity.trailId,
                type: trailData.type,
                visibility: trailData.visibility,
                isTrailCompletion,
              };
            } catch (error) {
              console.error(
                `Error fetching trail data for activity ${activity.id}:`,
                error
              );
              return null;
            }
          })
        );

        const validPosts = formattedPosts.filter((post) => post !== null);
        setPosts(validPosts);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    posts.forEach(async (post) => {
      if (post.route && post.route.length > 0) {
        try {
          const coordinates = post.route.map((coord) => [coord.lng, coord.lat]);

          const bounds = coordinates.reduce(
            (acc, coord) => ({
              minLng: Math.min(acc.minLng, coord[0]),
              maxLng: Math.max(acc.maxLng, coord[0]),
              minLat: Math.min(acc.minLat, coord[1]),
              maxLat: Math.max(acc.maxLat, coord[1]),
            }),
            {
              minLng: coordinates[0][0],
              maxLng: coordinates[0][0],
              minLat: coordinates[0][1],
              maxLat: coordinates[0][1],
            }
          );

          const lngDiff = bounds.maxLng - bounds.minLng;
          const latDiff = bounds.maxLat - bounds.minLat;
          const padding = 0.15;

          bounds.minLng -= lngDiff * padding;
          bounds.maxLng += lngDiff * padding;
          bounds.minLat -= latDiff * padding;
          bounds.maxLat += latDiff * padding;

          const center = {
            lng: (bounds.minLng + bounds.maxLng) / 2,
            lat: (bounds.minLat + bounds.maxLat) / 2,
          };

          const latZoom = Math.log2(360 / latDiff) - 2.5;
          const lngZoom = Math.log2(360 / lngDiff) - 2.5;
          const zoom = Math.min(latZoom, lngZoom);

          const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/geojson(%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22stroke%22%3A%22%23ff0000%22%2C%22stroke-width%22%3A2%7D%2C%22geometry%22%3A%7B%22type%22%3A%22LineString%22%2C%22coordinates%22%3A${JSON.stringify(
            coordinates
          )}%7D%7D)/${center.lng},${
            center.lat
          },${zoom}/600x300@2x?access_token=${mapboxgl.accessToken}`;

          setStaticMaps((prev) => ({
            ...prev,
            [post.id]: staticMapUrl,
          }));
        } catch (error) {
          console.error("Error creating static map:", error);
        }
      }
    });
  }, [posts]);

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="flex justify-center">
          <img src={loadingGif} alt="Loading..." className="w-64 h-64" />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto p-5">
          {posts.map((post) => (
            <div
              key={post.id}
              className="mb-8 bg-white p-5 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-4">
                <img
                  src={post.user.avatar}
                  alt="User Profile"
                  className="rounded-full w-12 h-12 mr-4"
                />
                <div>
                  <h3 className="text-lg font-bold">{post.user.name}</h3>
                  <div className="flex flex-col text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span>{post.user.date}</span>
                      <span className="text-blue-500">#{post.type}</span>
                      {post.isTrailCompletion && (
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                          Kolejne przejście
                        </span>
                      )}
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
                      <span>{post.user.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <h2
                  className="text-xl font-bold mb-2 cursor-pointer"
                  onClick={() => {
                    navigate(`/blog/${post.id}`);
                  }}
                >
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <div className="flex justify-between mb-4">
                  <div className="text-center">
                    <strong>{post.distance} km</strong>
                    <span className="block text-sm text-gray-500">Dystans</span>
                  </div>
                  <div className="text-center">
                    <strong>{post.pace}</strong>
                    <span className="block text-sm text-gray-500">Tempo</span>
                  </div>
                  <div className="text-center">
                    <strong>{post.time}</strong>
                    <span className="block text-sm text-gray-500">Czas</span>
                  </div>
                </div>
                {post.route && post.route.length > 0 && staticMaps[post.id] && (
                  <div
                    className="relative h-[300px] w-full cursor-pointer"
                    onClick={() => {
                      navigate(`/blog/${post.id}`);
                    }}
                  >
                    <img
                      src={staticMaps[post.id]}
                      alt="Trail map"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="relative group">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-1 ${
                      post.likes.some((like) => like.userId === user?.id)
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    <FaHeart />
                    <span>{post.likes.length}</span>
                  </button>
                  {!user && (
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-sm text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Zaloguj się by zareagować
                    </span>
                  )}
                </div>
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center space-x-2 text-gray-500"
                >
                  <FaComment />
                  <span>{post.comments.length} komentarzy</span>
                </button>
              </div>

              {expandedPostId === post.id && (
                <div className="mt-4">
                  <div className="max-h-60 overflow-y-auto mb-4">
                    {post.comments.length === 0 ? (
                      <div className="text-center text-gray-500 py-1">
                        Brak komentarzy
                      </div>
                    ) : (
                      post.comments
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        )
                        .map((comment, index) => (
                          <div
                            key={index}
                            className="mb-2 p-2 bg-gray-50 rounded"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center">
                                <img
                                  src={`${process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME_AVATARS}${comment.userId}`}
                                  alt="User"
                                  className="w-6 h-6 rounded-full mr-2 cursor-pointer hover:opacity-80"
                                  onClick={() =>
                                    handleAvatarClick(comment.userId)
                                  }
                                />
                                <span
                                  className="font-medium text-sm text-blue-600 hover:text-blue-800 cursor-pointer mr-2"
                                  onClick={() =>
                                    handleAvatarClick(comment.userId)
                                  }
                                >
                                  {commentAuthors[comment.userId] ||
                                    "Użytkownik"}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {formatDate(comment.createdAt, !!comment.id)}
                                </span>
                              </div>
                              {user?.id === comment.userId && (
                                <button
                                  onClick={() =>
                                    handleDeleteComment(comment.id, post.id)
                                  }
                                  className="text-red-500 hover:text-red-700 p-1"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            <p>{comment.content}</p>
                          </div>
                        ))
                    )}
                  </div>
                  {user && (
                    <div>
                      {!showCommentInput ? (
                        <button
                          onClick={() => setShowCommentInput(true)}
                          className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors"
                        >
                          <FaComment />
                          <span>Dodaj komentarz</span>
                        </button>
                      ) : (
                        <div className="mt-4 flex space-x-2 bg-white p-2">
                          <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Dodaj komentarz..."
                            className="flex-1 p-2 border rounded"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              handleComment(post.id);
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
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
