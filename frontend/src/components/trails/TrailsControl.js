import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import debounce from 'lodash/debounce';

const TrailsControl = ({ trails }) => {
    const map = useMap();
    const routingControlsRef = useRef([]);
    const isMountedRef = useRef(false);

    useEffect(() => {
        isMountedRef.current = true;

        const debouncedAddRoutingControls = debounce(() => {
            if (!isMountedRef.current) return;

            routingControlsRef.current.forEach(control => {
                if (map.hasLayer(control)) {
                    map.removeControl(control);
                }
            });
            routingControlsRef.current = [];

            Object.entries(trails).forEach(([, coordinates]) => {
                if (coordinates.length < 2) return;

                const routingControl = L.Routing.control({
                    waypoints: coordinates.map(coord => L.latLng(coord.latitude, coord.longitude)),
                    routeWhileDragging: true,
                    show: false,
                    addWaypoints: false,
                    draggableWaypoints: false,
                    fitSelectedRoutes: false,
                    lineOptions: {
                        styles: [{ color: '#9c2458', weight: 4 }]
                    }
                }).addTo(map);

                routingControlsRef.current.push(routingControl);
            });
        });

        debouncedAddRoutingControls();

        return () => {
            isMountedRef.current = false;
            debouncedAddRoutingControls.cancel();
            routingControlsRef.current.forEach(control => {
                try {
                    if (map.hasLayer(control)) {
                        map.removeControl(control);
                    }
                } catch (error) {
                    console.error('Error during cleanup:', error);
                }
            });
            routingControlsRef.current = [];
        };
    }, [map, trails]);

    return null;
};

export default TrailsControl;
