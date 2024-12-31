import React, { useState, useRef } from "react";
import CustomAlert from "../../components/UI/CustomAlert";
import MapWithTrails from "../../components/Trails/MapWithTrails";

const TrailsPage = () => {
  const alertRef = useRef();
  const [trails, setTrails] = useState([]);

  return (
    <>
      <MapWithTrails trails={trails} setTrails={setTrails} />
      <CustomAlert ref={alertRef} />
    </>
  );
};

export default TrailsPage;
