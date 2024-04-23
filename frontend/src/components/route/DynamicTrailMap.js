import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import TrailControl from './TrailControl';

const DynamicTrailMap = ({ center, zoom, trails }) => {
    return (
        <MapContainer center={center} zoom={zoom} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <TrailControl trails={trails} />
        </MapContainer>
    );
};

export default DynamicTrailMap;