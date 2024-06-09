import { Outlet, Link } from "react-router-dom";
import '../../styles/Layout.css';

const Layout = () => {
    return (
        <>
            <nav className="navbar">
                <div className="navbar-logo">
                    <Link to="/">TrailMates</Link>
                </div>
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <Link to="/">Strona domowa</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/trails">Mapa tras</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/activities">Aktywności</Link>
                    </li>
                </ul>
                <div className="navbar-login">
                    <Link to="/">Zaloguj się</Link>
                </div>
            </nav>
            <Outlet />
        </>
    )
};

export default Layout;
