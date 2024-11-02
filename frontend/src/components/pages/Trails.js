import React, { useState, useEffect, useRef } from "react";
import CustomAlert from '../CustomAlert'
import MapWithRoutes from "../trails/MapWithRoutes";

const Trails = () => {
    const alertRef = useRef();
    const [trails, setTrails] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('https://localhost:7186/api/trails');
                const trailsData = await response.json();
                setTrails(trailsData);
            } catch (err) {
                if (alertRef.current)
                    alertRef.current.showAlert('Nie udało się pobrać tras.', 'error');
            }
        })();
    }, []);

    return (
        <>
            <MapWithRoutes trails={trails}/>
            <CustomAlert ref={alertRef} />
        </>
    );
};

export default Trails;
