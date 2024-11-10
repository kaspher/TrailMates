import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchRoute } from "../../utils/trailsUtils";

const MapWithRoutes = ({ trails }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const initializeMap = ({ setMap, mapContainerRef }) => {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [19.9449799, 50.0646501],
        zoom: 5,
      });

      map.on("load", async () => {
        setMap(map);
        map.resize();

        for (const trail of trails) {
          const coordinates = trail.coordinates.map((coord) => ({
            latitude: coord.latitude,
            longitude: coord.longitude,
          }));

          const routeGeometry = await fetchRoute(coordinates);

          map.addSource(`route-${trail.id}`, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: routeGeometry,
            },
          });

          map.addLayer({
            id: `route-${trail.id}`,
            type: "line",
            source: `route-${trail.id}`,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#0b6e12",
              "line-width": 5,
            },
          });
        }
      });
    };

    if (!map) initializeMap({ setMap, mapContainerRef });
  }, [map, trails]);

  return (
    <div>
      <div ref={mapContainerRef} className="w-100 h-screen" />
    </div>
  );
};

export default MapWithRoutes;
