import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

const TrailControl = ({ trails }) => {
    const map = useMap();

    useEffect(() => {
        const routingControls = [];

        if (!map || Object.keys(trails).length === 0) return;

        Object.entries(trails).forEach(([trailId, coordinates]) => {
            if (coordinates.length < 2) return;

            const waypoints = coordinates.map(coord => L.latLng(coord.latitude, coord.longitude));
            const routingControl = L.Routing.control({
                waypoints,
                routeWhileDragging: true,
                show: false,
                addWaypoints: false,
                draggableWaypoints: false,
                fitSelectedRoutes: false,
                lineOptions: {
                    styles: [{ color: '#9c2458', weight: 4 }]
                },
            }).addTo(map);
            routingControls.push(routingControl);
        });

        return () => {
            routingControls.forEach(control => control && map.removeLayer(control));
        };
    }, [map, trails]);

    return null;
};

export default TrailControl;
