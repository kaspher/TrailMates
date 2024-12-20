import mapboxgl from "mapbox-gl";

export const fetchRoute = async (coordinates) => {
  const coordsString = coordinates
    .map((coord) => `${coord.longitude},${coord.latitude}`)
    .join(";");
  const response = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
  );
  const data = await response.json();
  return data.routes[0].geometry;
};
