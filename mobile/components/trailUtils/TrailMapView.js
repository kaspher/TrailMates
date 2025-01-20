import React from 'react';
import { View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';

const TrailMapView = ({ 
  mapStyle, 
  location, 
  isTracking, 
  coordinates, 
  trails, 
  activeTrailId, 
  fetchTrailDetails,
  mapCamera 
}) => {
  return (
    <MapboxGL.MapView 
      style={{ flex: 1 }}
      styleURL={mapStyle === 'Streets' ? 
        MapboxGL.StyleURL.Street : 
        MapboxGL.StyleURL.Satellite
      }
      scaleBarEnabled={false}
    >
      <MapboxGL.Camera
        ref={mapCamera}
        zoomLevel={14}
        centerCoordinate={[location.longitude, location.latitude]}
        animationMode="flyTo"
        animationDuration={2000}
      />
      
      {!isTracking && trails && trails.length > 0 && trails
        .filter(trail => trail.visibility === 'Public')
        .map((trail) => {
          const formattedCoordinates = trail.coordinates
            .sort((a, b) => a.order - b.order)
            .map(coord => [coord.longitude, coord.latitude]);

          return (
            <React.Fragment key={trail.id}>
              <MapboxGL.ShapeSource
                id={`source-${trail.id}`}
                shape={{
                  type: 'Feature',
                  properties: {
                    name: trail.name,
                    type: trail.type,
                    owner: trail.ownerFullName
                  },
                  geometry: {
                    type: 'LineString',
                    coordinates: formattedCoordinates
                  }
                }}
                onPress={() => fetchTrailDetails(trail.id)}
              >
                <MapboxGL.LineLayer
                  id={`layer-${trail.id}`}
                  style={{
                    lineColor: trail.type === 'Cycling' ? '#F44336' : 
                              trail.type === 'Trekking' ? '#4CAF50' : 
                              '#2196F3',
                    lineWidth: trail.id === activeTrailId ? 7 : 5,
                    lineOpacity: trail.id === activeTrailId ? 1 : 0.5,
                  }}
                />
                {trail.id === activeTrailId && (
                  <MapboxGL.LineLayer
                    id={`pulse-${trail.id}`}
                    style={{
                      lineColor: trail.type === 'Cycling' ? '#F44336' : 
                                trail.type === 'Trekking' ? '#4CAF50' : 
                                '#2196F3',
                      lineWidth: 3,
                      lineOpacity: 0.3,
                      lineDasharray: [2, 2]
                    }}
                  />
                )}
              </MapboxGL.ShapeSource>
            </React.Fragment>
          );
        })}

      {isTracking && coordinates && coordinates.length > 1 && (
        <MapboxGL.ShapeSource
          id="recordingSource"
          shape={{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordinates.map(coord => [coord.longitude, coord.latitude])
            }
          }}
        >
          <MapboxGL.LineLayer
            id="recordingLine"
            style={{
              lineColor: '#4CAF50',
              lineWidth: 4,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />
        </MapboxGL.ShapeSource>
      )}

      <MapboxGL.PointAnnotation
        id="userLocation"
        coordinate={[location.longitude, location.latitude]}
      >
        <View className="flex items-center justify-center w-8 h-8">
          <View className="w-8 h-8 rounded-full bg-primary border-2 border-white" />
        </View>
      </MapboxGL.PointAnnotation>
    </MapboxGL.MapView>
  );
};

export default TrailMapView; 