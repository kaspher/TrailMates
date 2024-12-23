import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchRoute } from "../../utils/trailsUtils";
import { TRAIL_COLORS } from "../../constants/colors";

const MapWithRoutes = ({ trails }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const initializeMap = ({ setMap, mapContainerRef }) => {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [19.9449799, 50.0646501],
        zoom: 5,
      });

      map.on("load", async () => {
        setMap(map);
        map.resize();

        for (const [index, trail] of trails.entries()) {
          const coordinates = trail.coordinates
            .sort((a, b) => a.order - b.order)
            .map((coord) => ({
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

          const color = TRAIL_COLORS[index % TRAIL_COLORS.length];

          map.addLayer({
            id: `route-${trail.id}`,
            type: "line",
            source: `route-${trail.id}`,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": color,
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
