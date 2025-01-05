import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  fetchRoute,
  zoomToTrail,
  calculateDistance,
} from "../../utils/trailsUtils";
import { colorManager } from "../../utils/colorManager";
import { fetchTrails } from "../../services/trailsApi";
import TrailPanel from "./TrailPanel";
import Filters from "../Trails/Filters";
import TrailDetailsModal from "./TrailDetailsModal";

const MapWithTrails = ({ trails, setTrails }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const filtersRef = useRef({
    lengthRange: { from: "", to: "" },
    trailTypes: {},
  });
  const currentLayersRef = useRef(new Set());
  const pulseAnimationRef = useRef(null);

  const startPulseAnimation = useCallback(
    (layerId) => {
      if (pulseAnimationRef.current) {
        cancelAnimationFrame(pulseAnimationRef.current);
      }

      let start = null;
      const duration = 1500;
      const minWidth = 4;
      const maxWidth = 7;

      const animate = (timestamp) => {
        if (!start) start = timestamp;
        const progress = (timestamp - start) % duration;
        const phase = progress / duration;

        const width =
          minWidth +
          (maxWidth - minWidth) * (0.5 * (1 + Math.sin(2 * Math.PI * phase)));

        if (map && map.getLayer(layerId)) {
          map.setPaintProperty(layerId, "line-width", width);
        }

        pulseAnimationRef.current = requestAnimationFrame(animate);
      };

      pulseAnimationRef.current = requestAnimationFrame(animate);
    },
    [map]
  );

  const stopPulseAnimation = useCallback(
    (layerId) => {
      if (pulseAnimationRef.current) {
        cancelAnimationFrame(pulseAnimationRef.current);
        pulseAnimationRef.current = null;
      }

      if (map && map.getLayer(layerId)) {
        map.setPaintProperty(layerId, "line-width", 4);
      }
    },
    [map]
  );

  const handleTrailClick = useCallback(
    (trail) => {
      const oldSelectedLayerId = selectedTrail
        ? `route-${selectedTrail.id}`
        : null;
      const newLayerId = `route-${trail.id}`;

      if (selectedTrail && selectedTrail.id === trail.id) {
        setSelectedTrail(null);
        stopPulseAnimation(newLayerId);
      } else {
        if (oldSelectedLayerId) {
          stopPulseAnimation(oldSelectedLayerId);
        }
        setSelectedTrail(trail);
        startPulseAnimation(newLayerId);
      }
      zoomToTrail(map, trail);
    },
    [map, selectedTrail, startPulseAnimation, stopPulseAnimation]
  );

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
      const newSources = new Set();

      currentLayersRef.current.forEach((sourceId) => {
        const layerId = sourceId;
        if (map.getLayer(layerId)) {
          map.off("click", layerId);
          map.off("mouseenter", layerId);
          map.off("mouseleave", layerId);
        }
      });

      const visibleTrailColors = colorManager.getVisibleTrailsColors(
        trails.map((trail) => trail.id)
      );

      if (selectedTrail && !trails.find((t) => t.id === selectedTrail.id)) {
        stopPulseAnimation(`route-${selectedTrail.id}`);
        setSelectedTrail(null);
      }

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

        newSources.add(sourceId);

        try {
          if (!existingSources.has(sourceId)) {
            if (map.getSource(sourceId)) {
              if (map.getLayer(layerId)) {
                map.removeLayer(layerId);
              }
              map.removeSource(sourceId);
            }
            
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
        } catch (error) {
          console.warn(`Error handling source ${sourceId}:`, error);
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
          const isSelected = selectedTrail && selectedTrail.id === trail.id;
          map.addLayer({
            id: layerId,
            type: "line",
            source: sourceId,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": visibleTrailColors[trail.id],
              "line-width": 4,
              "line-opacity": isSelected ? 1 : 0.8,
            },
          });

          map.on("click", layerId, () => handleTrailClick(trail));

          map.on("mouseenter", layerId, () => {
            map.getCanvas().style.cursor = "pointer";
            if (!selectedTrail || selectedTrail.id !== trail.id) {
              map.setPaintProperty(layerId, "line-width", 5);
              map.setPaintProperty(layerId, "line-opacity", 0.9);
            }
          });

          map.on("mouseleave", layerId, () => {
            map.getCanvas().style.cursor = "";
            if (!selectedTrail || selectedTrail.id !== trail.id) {
              map.setPaintProperty(layerId, "line-width", 4);
              map.setPaintProperty(layerId, "line-opacity", 0.8);
            }
          });

          if (isSelected) {
            startPulseAnimation(layerId);
          }
        }
      }

      currentLayersRef.current.forEach((sourceId) => {
        if (!newSources.has(sourceId)) {
          const layerId = sourceId;
          if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
          }
          if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
          }
        }
      });

      currentLayersRef.current = newSources;
    }
  }, [
    map,
    trails,
    handleTrailClick,
    selectedTrail,
    startPulseAnimation,
    stopPulseAnimation,
  ]);

  useEffect(() => {
    const initializeMap = () => {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [18.6466384, 54.3520252],
        zoom: 9,
        dragRotate: false,
        touchZoomRotate: false,
        pitchWithRotate: false,
        maxPitch: 0,
      });

      map.dragRotate.disable();
      map.touchZoomRotate.disableRotation();

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

    return () => {
      if (pulseAnimationRef.current) {
        cancelAnimationFrame(pulseAnimationRef.current);
      }
    };
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
        onTrailClick={handleTrailClick}
      />
      {selectedTrail && (
        <TrailDetailsModal
          trail={selectedTrail}
          onClose={() => {
            stopPulseAnimation(`route-${selectedTrail.id}`);
            setSelectedTrail(null);
          }}
        />
      )}
    </div>
  );
};

export default MapWithTrails;
