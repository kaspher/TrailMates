import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import TrailsControl from './TrailsControl';

const Map = ({ center, zoom, trails }) => {
    return (
        <MapContainer center={center} zoom={zoom} style={{ height: '90vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <TrailsControl trails={trails} />
        </MapContainer>
    );
};

export default Map;
