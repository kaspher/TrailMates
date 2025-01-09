import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import CommonStyles from "./CommonStyles";
import ReactionIcons from "./ReactionIcons";
import loadingGif from "../../assets/img/loading.gif";


const DetailedPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  console.log('Current postId:', postId);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!navigator.onLine) {
          throw new Error('No internet connection');
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        if (!postId) {
          throw new Error('No post ID provided');
        }

        console.log('Attempting to fetch:', `/api/trails/${postId}`);
        
        const response = await fetch(`/api/trails/${postId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log('Full response:', response);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log('Received data:', data);

        if (!data) {
          throw new Error('No data received');
        }

        const formattedPost = {
          id: data.id,
          title: data.name,
          description: data.description || '',
          images: data.images || [], 
          stats: {
            distance: data.distance || '0.00',
            pace: data.pace || '0:00',
            duration: data.duration || '0:00'
          },
          user: {
            id: data.ownerId,
            name: data.ownerFullName,
            avatar: `${process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME}/${data.ownerId}`,
            date: new Date().toLocaleDateString('pl-PL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          },
          route: data.coordinates.map(coord => ({
            lng: coord.longitude,
            lat: coord.latitude
          })),
          type: data.type,
          visibility: data.visibility
        };

        setPost(formattedPost);
      } catch (err) {
        console.error('Detailed fetch error:', err);
        if (err.name === 'AbortError') {
          setError('Request timed out. Please try again.');
        } else {
          setError(`${err.name}: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    if (post?.route && post.route.length > 0) {
      const map = new mapboxgl.Map({
        container: 'detailed-map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [post.route[0].lng, post.route[0].lat],
        zoom: 12,
        interactive: true 
      });

      const coordinates = post.route.map(coord => [coord.lng, coord.lat]);

      map.on('load', () => {
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordinates
            }
          }
        });

        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#ff0000',
            'line-width': 4,
            'line-opacity': 0.7
          }
        });

        const bounds = coordinates.reduce((bounds, coord) => {
          return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        map.fitBounds(bounds, {
          padding: 50,
          duration: 0,
          animate: false
        });
      });

      return () => map.remove();
    }
  }, [post]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLoadingTimeout(true);
      }
    }, 10000); 

    return () => clearTimeout(timer);
  }, [loading]);

  const ImageModal = ({ src, onClose }) => (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="max-w-4xl max-h-[90vh] p-4">
        <img 
          src={src} 
          alt="Powiększone zdjęcie" 
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <img src={loadingGif} alt="Loading..." className="w-16 h-16" />
        {loadingTimeout && (
          <p className="mt-4 text-gray-600">
            Ładowanie trwa dłużej niż zwykle. Proszę odświeżyć stronę.
          </p>
        )}
      </div>
    );
  }
  
  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    </div>
  );

  if (!post) return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">Post not found</span>
      </div>
    </div>
  );

  return (
    <CommonStyles>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <img 
            src={post.user.avatar} 
            alt="User Profile" 
            className="rounded-full w-12 h-12 mr-4"
          />
          <div>
            <h3 className="text-lg font-bold">{post.user.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{post.user.date}</span>
              <span className="text-blue-500">#{post.type}</span>
              <span>{post.visibility}</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

        
        <div className="grid grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{post.stats.distance} km</div>
            <div className="text-gray-600">Dystans</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{post.stats.pace} /km</div>
            <div className="text-gray-600">Tempo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{post.stats.duration}</div>
            <div className="text-gray-600">Czas</div>
          </div>
        </div>

        <div id="detailed-map" className="w-full h-96 rounded-lg overflow-hidden mb-6"></div>

        {post.description && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Opis</h2>
            <p className="text-gray-700 whitespace-pre-line">{post.description}</p>
          </div>
        )}

        {post.images && post.images.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Galeria</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {post.images.map((image, index) => (
                <div 
                  key={index} 
                  className="cursor-pointer relative group"
                  onClick={() => setActiveImage(image)}
                >
                  <img
                    src={image}
                    alt={`Zdjęcie ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeImage && (
          <ImageModal
            src={activeImage}
            onClose={() => setActiveImage(null)}
          />
        )}
      </div>
    </CommonStyles>
  );
};

export default DetailedPost;