import React, { useState, useEffect, useRef } from "react";
import CustomAlert from "../../components/UI/CustomAlert";
import MapWithRoutes from "../../components/Trails/MapWithRoutes";

const TrailsPage = () => {
  const alertRef = useRef();
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("https://localhost:7186/api/trails");
        const trailsData = await response.json();
        setTrails(trailsData);
      } catch (err) {
        if (alertRef.current)
          alertRef.current.showAlert("Nie udało się pobrać tras.", "error");
      }
    })();
  }, []);

  return (
    <>
      <MapWithRoutes trails={trails} />
      <CustomAlert ref={alertRef} />
    </>
  );
};

export default TrailsPage;
