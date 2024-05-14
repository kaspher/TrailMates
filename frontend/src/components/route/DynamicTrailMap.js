import React from 'react';
import { MapContainer } from 'react-leaflet';
import TrailControl from './TrailControl';
import Title from "../layers/Title";

const DynamicTrailMap = ({ center, zoom, trails }) => {
    return (
        <MapContainer center={center} zoom={zoom} style={{ height: '90vh', width: '100%' }}>
            <Title />
            <TrailControl trails={trails} />
        </MapContainer>
    );
};

export default DynamicTrailMap;