import React, { useEffect, useState } from "react";
import MapWithRoutes from "../trails/MapWithRoutes";

const Trails = () => {
    const [trails, setTrails] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('https://localhost:7186/api/trails');
                const trailsData = await response.json();
                setTrails(trailsData);
            } catch (err) {
                alert("Nie udało się pobrać tras. ");
            }
        })();
    }, []);

    return (
        <MapWithRoutes trails={trails}/>
    );
};

export default Trails;
