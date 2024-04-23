import React from 'react';
import { TileLayer } from 'react-leaflet';
import 'leaflet-routing-machine';

const Title = () => (
    <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
);

export default Title;