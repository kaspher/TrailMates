import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CustomAlert from "../../components/UI/CustomAlert";
import MapWithTrails from "../../components/Trails/MapWithTrails";

const TrailsPage = () => {
  const alertRef = useRef();
  const [trails, setTrails] = useState([]);
  const [searchParams] = useSearchParams();
  const [selectedTrailId, setSelectedTrailId] = useState(null);

  useEffect(() => {
    const trailId = searchParams.get("trailId");
    if (trailId) {
      setSelectedTrailId(trailId);
    }
  }, [searchParams]);

  return (
    <>
      <MapWithTrails
        trails={trails}
        setTrails={setTrails}
        initialSelectedTrailId={selectedTrailId}
      />
      <CustomAlert ref={alertRef} />
    </>
  );
};

export default TrailsPage;
