import DynamicTrailMap from "./DynamicTrailMap";
import React, {useEffect, useState} from 'react';

const RouteMap = () => {
    const [trailCoordinates, setTrailCoordinates] = useState([]);

    useEffect(() => {
        fetch('https://localhost:7186/trails')
            .then(response => response.json())
            .then(data => setTrailCoordinates(data.map(trail => trail.coordinates).flat()))
            .catch(err => console.error('Error fetching trail data:', err));
    }, []);

    console.log(trailCoordinates)

    const centerPosition = { lat: 51.9194, lng: 19.1451 };
    const zoomLevel = 7;

    return <DynamicTrailMap center={centerPosition} zoom={zoomLevel} coordinates={trailCoordinates} />;
};

export default RouteMap;