import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import mapboxgl from "mapbox-gl";
import Home from "./components/pages/Home";
import NoPage from "./components/pages/NoPage";
import Trails from "./components/pages/Trails";
import Layout from "./components/pages/Layout";
import Activities from "./components/pages/Activities";
import Login from "./components/pages/auth/Login";
import Register from "./components/pages/auth/Register";
import AuthProvider from "./hooks/auth/AuthProvider";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<Home/>}/>
                        <Route path="trails" element={<Trails/>}/>
                        <Route path="*" element={<NoPage/>}/>
                        <Route path="activities" element={<Activities/>}/>
                        <Route path="login" element={<Login/>}/>
                        <Route path="register" element={<Register />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
