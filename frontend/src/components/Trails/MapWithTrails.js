import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  fetchRoute,
  zoomToTrail,
  calculateDistance,
} from "../../utils/trailsUtils";
import { TRAIL_COLORS } from "../../constants/colors";
import { fetchTrails } from "../../services/trailsApi";
import TrailPanel from "./TrailPanel";
import Filters from "../Trails/Filters";

const MapWithTrails = ({ trails, setTrails }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const filtersRef = useRef({
    lengthRange: { from: "", to: "" },
    trailTypes: {},
  });
  const currentLayersRef = useRef(new Set());

  const filterTrailsByLength = useCallback((trails) => {
    const { from, to } = filtersRef.current.lengthRange;
    return trails.filter((trail) => {
      const length = calculateDistance(trail.coordinates);
      return (!from || length >= from) && (!to || length <= to);
    });
  }, []);

  const updateTrails = useCallback(
    async (bounds) => {
      try {
        const trailsData = await fetchTrails(bounds, filtersRef.current);
        const filteredTrails = filterTrailsByLength(trailsData);
        setTrails(filteredTrails);
      } catch (error) {
        console.error("Failed to fetch trails", error);
      }
    },
    [setTrails, filterTrailsByLength]
  );

  const updateMapLayers = useCallback(async () => {
    if (map) {
      const existingLayers = new Set(
        map.getStyle().layers.map((layer) => layer.id)
      );
      const existingSources = new Set(Object.keys(map.getStyle().sources));
      const newLayers = new Set();

      for (const trail of trails) {
        const coordinates = trail.coordinates
          .sort((a, b) => a.order - b.order)
          .map((coord) => ({
            latitude: coord.latitude,
            longitude: coord.longitude,
          }));

        const routeGeometry = await fetchRoute(coordinates);
        const sourceId = `route-${trail.id}`;
        const layerId = `route-${trail.id}`;

        newLayers.add(layerId);

        if (!existingSources.has(sourceId)) {
          map.addSource(sourceId, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: routeGeometry,
            },
          });
        } else {
          const source = map.getSource(sourceId);
          if (source) {
            source.setData({
              type: "Feature",
              properties: {},
              geometry: routeGeometry,
            });
          }
        }

        if (!existingLayers.has(layerId)) {
          const color =
            TRAIL_COLORS[trails.indexOf(trail) % TRAIL_COLORS.length];
          map.addLayer({
            id: layerId,
            type: "line",
            source: sourceId,
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
      }

      currentLayersRef.current.forEach((layerId) => {
        if (!newLayers.has(layerId)) {
          if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
          }
          if (map.getSource(layerId)) {
            map.removeSource(layerId);
          }
        }
      });

      currentLayersRef.current = newLayers;
    }
  }, [map, trails]);

  useEffect(() => {
    const initializeMap = () => {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [18.6466384, 54.3520252],
        zoom: 9,
      });

      map.on("load", async () => {
        setMap(map);
        map.resize();
        await updateTrails(map.getBounds());
      });

      map.on("moveend", async () => {
        await updateTrails(map.getBounds());
      });
    };

    if (!map) initializeMap();
  }, [map, updateTrails]);

  useEffect(() => {
    if (map) {
      updateTrails(map.getBounds());
    }
  }, [map, updateTrails]);

  useEffect(() => {
    updateMapLayers();
  }, [map, trails, updateMapLayers]);

  const handleFilterChange = (newFilters) => {
    filtersRef.current = newFilters;
    if (map) {
      updateTrails(map.getBounds());
    }
  };

  return (
    <div className="relative h-screen">
      <div
        ref={mapContainerRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      <Filters onFilterChange={handleFilterChange} />
      <TrailPanel
        trails={trails}
        isPanelOpen={isPanelOpen}
        togglePanel={() => setIsPanelOpen(!isPanelOpen)}
        zoomToTrail={(trail) => zoomToTrail(map, trail)}
      />
    </div>
  );
};

export default MapWithTrails;
