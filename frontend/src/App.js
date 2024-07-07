import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import NoPage from "./components/pages/NoPage";
import Trails from "./components/pages/Trails";
import Layout from "./components/pages/Layout";
import Activities from "./components/pages/Activities";

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
