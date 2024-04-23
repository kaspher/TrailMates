import React from 'react';
import RouteMap from "./components/route/RouteMap";
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function App() {
  return (
      <div className="App">
          <h1>TrailMates - mapa tras</h1>
          <RouteMap />
      </div>
  );
}

export default App;
