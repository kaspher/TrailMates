import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Home from "./components/pages/Home";
import NoPage from "./components/pages/NoPage";
import Trails from "./components/pages/Trails";
import Layout from "./components/pages/Layout";
import Activities from "./components/pages/Activities";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Layout />} >
                  <Route index element={<Home />} />
                  <Route path="trails" element={<Trails />} />
                  <Route path="*" element={<NoPage />} />
                  <Route path="activities" element={<Activities />} />
              </Route>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
