import React, { useEffect, useState } from 'react';
import DynamicTrailMap from "./DynamicTrailMap";

const RouteMap = () => {
    const [trails, setTrails] = useState({});

    useEffect(() => {
        fetch('https://localhost:7186/trails')
            .then(response => response.json())
            .then(data => {
                setTrails(data.reduce((acc, trail) => {
                    acc[trail.id] = trail.coordinates;
                    return acc;
                }, {}));
            })
            .catch(err => console.error('Error fetching trail data:', err));
    }, []);

    const centerPosition = { lat: 52.0693, lng: 19.4803 };
    const zoomLevel = 7;

    return <DynamicTrailMap center={centerPosition} zoom={zoomLevel} trails={trails} />;
};

export default RouteMap;
