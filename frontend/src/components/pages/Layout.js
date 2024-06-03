import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Strona domowa</Link>
                    </li>
                    <li>
                        <Link to="/trails">Mapa tras</Link>
                    </li>
                    <li>
                        <Link to="/activities">Aktywności</Link>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </>
    )
};

export default Layout;