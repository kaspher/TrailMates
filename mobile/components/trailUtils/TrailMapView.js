import React from 'react';
import { View, Text } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import LocationPinIcon from '../../assets/icons/location-pin-solid.svg';
import FlagIcon from '../../assets/icons/flag-checkered-solid.svg';

const generateTrailColor = (id) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
    '#D4A5A5', '#9B5DE5', '#F15BB5', '#00BBF9', '#00F5D4',
    '#EF476F', '#FFD93D', '#06D6A0', '#118AB2', '#073B4C'
  ];
  const colorIndex = parseInt(id.replace(/[^0-9]/g, '')) % colors.length;
  return colors[colorIndex];
};

const MarkerWithLabel = ({ Icon, label, color = "#386641" }) => (
  <View style={{ alignItems: 'center' }}>
    <Icon width={24} height={24} fill={color} />
    <Text style={{ 
      color: color, 
      fontSize: 12, 
      marginTop: 2,
      backgroundColor: 'white',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4
    }}>
      {label}
    </Text>
  </View>
);

const TrailMapView = ({ 
  mapStyle, 
  location, 
  isTracking, 
  coordinates, 
  trails, 
  activeTrailId, 
  fetchTrailDetails,
  mapCamera,
  onUserInteraction,
  temporaryTrail
}) => {
  return (
    <MapboxGL.MapView 
      style={{ flex: 1 }}
      styleURL={mapStyle === 'Streets' ? 
        MapboxGL.StyleURL.Street : 
        MapboxGL.StyleURL.Satellite
      }
      scaleBarEnabled={false}
      onTouchStart={onUserInteraction}
      onScroll={onUserInteraction}
    >
      <MapboxGL.Camera
        ref={mapCamera}
        zoomLevel={14}
      />
      
      {!isTracking && trails && trails.length > 0 && (
        <>
          {!activeTrailId && trails
            .filter(trail => trail.visibility === 'Public')
            .map((trail) => {
              const sortedCoordinates = trail.coordinates
                .sort((a, b) => a.order - b.order);
              
              const formattedCoordinates = sortedCoordinates
                .map(coord => [coord.longitude, coord.latitude]);

              return (
                <React.Fragment key={trail.id}>
                  <MapboxGL.ShapeSource
                    id={`source-${trail.id}`}
                    shape={{
                      type: 'Feature',
                      properties: {},
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
                        lineColor: generateTrailColor(trail.id),
                        lineWidth: 2,
                        lineOpacity: 0.75,
                      }}
                    />
                  </MapboxGL.ShapeSource>
                </React.Fragment>
              );
            })}

          {activeTrailId && trails
            .filter(trail => trail.id === activeTrailId)
            .map((trail) => {
              const sortedCoordinates = trail.coordinates
                .sort((a, b) => a.order - b.order);
              
              const startPoint = sortedCoordinates[0];
              const endPoint = sortedCoordinates[sortedCoordinates.length - 1];
              
              const formattedCoordinates = sortedCoordinates
                .map(coord => [coord.longitude, coord.latitude]);

              return (
                <React.Fragment key={trail.id}>
                  <MapboxGL.ShapeSource
                    id={`source-${trail.id}`}
                    shape={{
                      type: 'Feature',
                      properties: {},
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
                        lineColor: generateTrailColor(trail.id),
                        lineWidth: 5,
                        lineOpacity: 1,
                      }}
                    />
                    <MapboxGL.LineLayer
                      id={`pulse-${trail.id}`}
                      style={{
                        lineColor: generateTrailColor(trail.id),
                        lineWidth: 3,
                        lineOpacity: 0.3,
                        lineDasharray: [2, 2]
                      }}
                    />
                  </MapboxGL.ShapeSource>

                  <MapboxGL.PointAnnotation
                    id={`start-${trail.id}`}
                    coordinate={[startPoint.longitude, startPoint.latitude]}
                  >
                    <MarkerWithLabel 
                      Icon={LocationPinIcon} 
                      label="Start"
                      color={generateTrailColor(trail.id)}
                    />
                  </MapboxGL.PointAnnotation>

                  <MapboxGL.PointAnnotation
                    id={`end-${trail.id}`}
                    coordinate={[endPoint.longitude, endPoint.latitude]}
                  >
                    <MarkerWithLabel 
                      Icon={FlagIcon} 
                      label="Meta"
                      color={generateTrailColor(trail.id)}
                    />
                  </MapboxGL.PointAnnotation>
                </React.Fragment>
              );
            })}

          {temporaryTrail && (
            <React.Fragment key={temporaryTrail.id}>
              <MapboxGL.ShapeSource
                id={`source-temp-${temporaryTrail.id}`}
                shape={{
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'LineString',
                    coordinates: temporaryTrail.coordinates
                      .sort((a, b) => a.order - b.order)
                      .map(coord => [coord.longitude, coord.latitude])
                  }
                }}
                onPress={() => fetchTrailDetails(temporaryTrail.id)}
              >
                <MapboxGL.LineLayer
                  id={`layer-temp-${temporaryTrail.id}`}
                  style={{
                    lineColor: generateTrailColor(temporaryTrail.id),
                    lineWidth: temporaryTrail.id === activeTrailId ? 5 : 2,
                    lineOpacity: temporaryTrail.id === activeTrailId ? 1 : 0.75,
                  }}
                />
                {temporaryTrail.id === activeTrailId && (
                  <MapboxGL.LineLayer
                    id={`pulse-temp-${temporaryTrail.id}`}
                    style={{
                      lineColor: generateTrailColor(temporaryTrail.id),
                      lineWidth: 3,
                      lineOpacity: 0.3,
                      lineDasharray: [2, 2]
                    }}
                  />
                )}
              </MapboxGL.ShapeSource>

              {temporaryTrail.id === activeTrailId && (
                <>
                  <MapboxGL.PointAnnotation
                    id={`start-temp-${temporaryTrail.id}`}
                    coordinate={[
                      temporaryTrail.coordinates[0].longitude,
                      temporaryTrail.coordinates[0].latitude
                    ]}
                  >
                    <MarkerWithLabel 
                      Icon={LocationPinIcon} 
                      label="Start"
                      color={generateTrailColor(temporaryTrail.id)}
                    />
                  </MapboxGL.PointAnnotation>

                  <MapboxGL.PointAnnotation
                    id={`end-temp-${temporaryTrail.id}`}
                    coordinate={[
                      temporaryTrail.coordinates[temporaryTrail.coordinates.length - 1].longitude,
                      temporaryTrail.coordinates[temporaryTrail.coordinates.length - 1].latitude
                    ]}
                  >
                    <MarkerWithLabel 
                      Icon={FlagIcon} 
                      label="Meta"
                      color={generateTrailColor(temporaryTrail.id)}
                    />
                  </MapboxGL.PointAnnotation>
                </>
              )}
            </React.Fragment>
          )}
        </>
      )}

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

      <MapboxGL.UserLocation
        visible={true}
        animated={true}
        renderMode={'native'}
        minDisplacement={5}
        puckBearingEnabled={true}
        puckBearing={'heading'}
      />
    </MapboxGL.MapView>
  );
};

export default TrailMapView; 