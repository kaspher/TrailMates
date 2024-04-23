import React from 'react';
import { MapContainer } from 'react-leaflet';
import 'leaflet-routing-machine';
import Title from "../layers/Title";
import TrailControl from "./TrailControl";

const DynamicTrailMap = ({ center, zoom, coordinates }) => (
    <MapContainer center={center} zoom={zoom} style={{ height: '800px', width: '100%' }}>
        <Title/>
        <TrailControl coordinates={coordinates} />
    </MapContainer>
);

export default DynamicTrailMap;