import React, {useEffect, useState} from "react";
import MapWithRoutes from "../trails/MapWithRoutes";

const Trails = () => {
    const [trails, setTrails] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await fetch('https://localhost:7186/api/trails');
            const trailsData = await response.json();
            setTrails(trailsData);
        })();
    }, []);

    return (
        <MapWithRoutes trails={trails}/>
    );
};

export default Trails;