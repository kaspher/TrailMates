import { BrowserRouter, Routes, Route } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import Home from "./views/HomePage";
import NoPage from "./views/NotFoundPage";
import Trails from "./views/Trails/TrailsPage";
import Layout from "./views/Layout";
import Activities from "./views/Activities/ActivitiesPage";
import Events from "./views/Events/EventsPage";
import UserProfile from "./views/Auth/UserProfilePage";
import Login from "./views/Auth/LoginPage";
import Register from "./views/Auth/RegisterPage";
import { AuthProvider } from "./components/Auth/AuthProvider";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="trails" element={<Trails />} />
            <Route path="activities" element={<Activities />} />
            <Route path="events" element={<Events />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
