import mapboxgl from "mapbox-gl";
import { fetchTrails } from "../services/trailsApi";

export const fetchRoute = async (coordinates) => {
  if (!coordinates || coordinates.length === 0) {
    throw new Error("No coordinates provided for route fetching");
  }

  const coordsString = coordinates
    .map((coord) => `${coord.longitude},${coord.latitude}`)
    .join(";");
  const response = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/cycling/${coordsString}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}&overview=full`
  );
  const data = await response.json();
  return data.routes[0].geometry;
};

export const updateTrails = async (bounds, filters, setTrails) => {
  try {
    const trailsData = await fetchTrails(bounds, filters);
    setTrails(trailsData);
  } catch (error) {
    console.error("Failed to fetch trails", error);
  }
};

export const calculateDistance = (coordinates) => {
  let length = 0;
  for (let i = 1; i < coordinates.length; i++) {
    const [lat1, lon1] = [
      coordinates[i - 1].latitude,
      coordinates[i - 1].longitude,
    ];
    const [lat2, lon2] = [coordinates[i].latitude, coordinates[i].longitude];
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    length += R * c;
  }

  return length.toFixed(2);
};

export const zoomToTrail = async (map, trail) => {
  const coordinates = trail.coordinates.map((coord) => [
    coord.longitude,
    coord.latitude,
  ]);

  if (!coordinates || coordinates.length === 0) {
    console.error("No coordinates available for the trail");
    return;
  }

  const bounds = coordinates.reduce((bounds, coord) => {
    return bounds.extend(coord);
  }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

  map.fitBounds(bounds, {
    padding: 200,
  });
};

export const getAddressFromCoordinates = async (longitude, latitude) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}&language=pl`
    );
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      let street = null;
      let city = null;

      data.features.forEach((feature) => {
        if (
          feature.place_type.includes("address") ||
          feature.place_type.includes("street")
        ) {
          street = feature.text;
        }
        if (feature.place_type.includes("place")) {
          city = feature.text;
        }
      });

      if (!street && data.features[0]) {
        street = data.features[0].text;
      }

      if (!city && data.features[0].context) {
        const cityContext = data.features[0].context.find((item) =>
          item.id.startsWith("place")
        );
        if (cityContext) {
          city = cityContext.text;
        }
      }

      if (city && street) {
        return `${street}, ${city}`;
      } else if (city) {
        return city;
      } else if (street) {
        return street;
      }

      return data.features[0].place_name.split(",")[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching address:", error);
    return null;
  }
};
