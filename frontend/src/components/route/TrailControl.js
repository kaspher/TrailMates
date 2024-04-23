import { useEffect } from 'react';
import {  useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

const TrailControl = ({ coordinates }) => {
    const map = useMap();

    useEffect(() => {
        let routingControl = null;

        if (!map || coordinates.length < 2) return;

        routingControl = new L.Routing.control({
            waypoints: coordinates.map(coordinate => L.latLng(coordinate.latitude, coordinate.longitude)),
            routeWhileDragging: true,
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            lineOptions: {
                styles: [{ color: '#9c2458', weight: 4 }]
            },
        }).addTo(map);

        return () => {
            if (routingControl)
                map.removeLayer(routingControl);
        };
    }, [map, coordinates]);

    return null;
};

export default TrailControl;