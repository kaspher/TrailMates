import {Link, Outlet} from 'react-router-dom';
import {useAuth} from '../../hooks/auth/AuthProvider';

const Layout = () => {
    const {user, logOut} = useAuth();

    return (
        <>
            <header
                className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-xl border border-gray-100 bg-white/80 py-4 shadow backdrop-blur-lg lg:top-6 lg:rounded-3xl">
                <div className="px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex shrink-0">
                            <Link aria-current="page" className="flex items-center" to="/">
                                {/*<img className="h-7 w-auto" src="nasze/logo" alt="logo"/>*/}
                                <p className="font-bold text-xl text-green-600">TrailMates Logo</p>
                            </Link>
                        </div>
                        <div className="hidden md:flex md:items-center md:justify-center md:gap-5">
                            <Link
                                className="inline-block rounded-lg px-4 py-2 text-md font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                                to="/">Strona domowa</Link>
                            <Link
                                className="inline-block rounded-lg px-4 py-2 text-md font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                                to="/trails">Mapa tras</Link>
                            <Link
                                className="inline-block rounded-lg px-4 py-2 text-md font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                                to="/activities">Aktywności</Link>
                        </div>
                        <div className="flex items-center justify-end gap-4">
                            {user ? (
                                <button
                                    onClick={logOut}
                                    className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                >
                                    Wyloguj się
                                </button>
                            ) : (
                                <>
                                    <Link
                                        className="hidden items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
                                        to="/register">Zarejestruj się</Link>
                                    <Link
                                        className="inline-flex items-center justify-center rounded-xl bg-green-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-green-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                        to="/login">Zaloguj się</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <div>
                <Outlet/>
            </div>
        </>
    );
};

export default Layout;
