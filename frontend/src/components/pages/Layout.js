import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/auth/AuthProvider";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faHome,
  faMap,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";
import logoUrl from "../../assets/img/logo/longlogo.svg";
import mobileLogoUrl from "../../assets/img/logo/logo.svg";

const cloudFrontDomainName = process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME;

const Layout = () => {
  const { user, logOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    // Detect screen size
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768); // Mobile view when width < 768px
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleDropdownClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-xl border border-gray-100 bg-white/80 py-4 shadow backdrop-blur-lg lg:top-6 lg:rounded-3xl">
        <div className="px-8">
          <div className="flex items-center justify-between">
            <div className="flex shrink-0">
              <Link aria-current="page" className="flex items-center" to="/">
                <img
                  src={isMobileView ? mobileLogoUrl : logoUrl}
                  alt="TrailMates"
                  className={`w-auto filter brightness-0 ${isMobileView ? "h-8" : "h-5"}`}
                />
              </Link>
            </div>

            {!isMobileView && (
              <div className="hidden md:flex md:items-center md:justify-center md:gap-5">
                <Link
                  className="inline-block rounded-lg px-4 py-2 text-md font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                  to="/"
                >
                  Strona domowa
                </Link>
                <Link
                  className="inline-block rounded-lg px-4 py-2 text-md font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                  to="/trails"
                >
                  Mapa tras
                </Link>
                <Link
                  className="inline-block rounded-lg px-4 py-2 text-md font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                  to="/activities"
                >
                  Aktywności
                </Link>
                <Link
                  className="inline-block rounded-lg px-4 py-2 text-md font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                  to="/events"
                >
                  Wydarzenia
                </Link>
              </div>
            )}

            <div className="flex items-center justify-end gap-4">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2"
                >
                  {user && (
                    <span className="text-gray-900 font-medium hidden md:inline">
                      Witaj, {user.name}
                    </span>
                  )}
                  <img
                    src={user ? cloudFrontDomainName + user.id : logoUrl} //logoUrl placeholder for user avatar
                    alt="users avatar"
                    className="h-10 w-10 rounded-full object-cover object-center"
                  />
                </button>
                {isDropdownOpen && (
                  <div
                    className={`${
                      isMobileView
                        ? "fixed top-full left-0 w-full rounded-none"
                        : "absolute right-0 mt-2 w-48 rounded-md"
                    } bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-20`}
                  >
                    <div className="py-1">
                      {isMobileView && (
                        <>
                          <Link
                            to="/"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                            onClick={handleDropdownClose}
                          >
                            <FontAwesomeIcon icon={faHome} className="mr-2" />
                            Strona domowa
                          </Link>
                          <Link
                            to="/trails"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                            onClick={handleDropdownClose}
                          >
                            <FontAwesomeIcon icon={faMap} className="mr-2" />
                            Mapa tras
                          </Link>
                          <Link
                            to="/activities"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                            onClick={handleDropdownClose}
                          >
                            <FontAwesomeIcon icon={faTasks} className="mr-2" />
                            Aktywności
                          </Link>
                          <Link
                            to="/events"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                            onClick={handleDropdownClose}
                          >
                            <FontAwesomeIcon icon={faTasks} className="mr-2" />
                            Wydarzenia
                          </Link>
                        </>
                      )}
                      {user && (
                        <Link
                          to="/profile"
                          className="block mb-1 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                          onClick={handleDropdownClose}
                        >
                          <FontAwesomeIcon icon={faUser} className="mr-2" />
                          Mój profil
                        </Link>
                      )}
                      <hr className="my-2 border-gray-500 border-t-2 mx-2" />
                      {user ? (
                        <button
                          onClick={() => {
                            logOut();
                            handleDropdownClose();
                          }}
                          className="block mt-1 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left flex items-center"
                        >
                          <FontAwesomeIcon
                            icon={faSignOutAlt}
                            className="mr-2"
                          />
                          Wyloguj się
                        </button>
                      ) : (
                        <>
                          <Link
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                            to="/register"
                            onClick={handleDropdownClose}
                          >
                            Zarejestruj się
                          </Link>
                          <Link
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                            to="/login"
                            onClick={handleDropdownClose}
                          >
                            Zaloguj się
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="pt-20">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
