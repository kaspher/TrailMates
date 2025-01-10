import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faTasks,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef } from "react";
import CustomAlert from "../../components/UI/CustomAlert";
import { getUserById } from "../../services/usersApi";

const DesktopLayout = ({
  user,
  cloudFrontDomainName,
  isDropdownOpen,
  toggleDropdown,
  handleDropdownClose,
  logOut,
  dropdownRef,
  logoUrl,
}) => {
  const [userData, setUserData] = useState(null);
  const alertRef = useRef();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          const data = await getUserById(user.id);
          setUserData(data);
        } catch (error) {
          alertRef.current?.showAlert(error.message, "error");
        }
      }
    };

    fetchUserData();
  }, [user]);

  return (
      <header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-xl border border-gray-100 bg-white/80 py-4 shadow lg:backdrop-blur-lg lg:top-6 lg:rounded-3xl">
        <div className="px-8 flex items-center justify-between">
          <Link aria-current="page" className="flex items-center" to="/">
            <img
                src={logoUrl}
                alt="TrailMates"
                className="w-auto h-5 filter brightness-0"
            />
          </Link>
          <div className="flex-1 flex justify-center">
            <div className="flex items-center space-x-5">
              <Link
                  className={`inline-block rounded-lg px-4 py-2 text-md font-medium transition-all duration-200 hover:bg-gray-100 ${
                      location.pathname === "/" ? "text-custom-green" : "text-gray-900"
                  }`}
                  to="/"
              >
                Strona domowa
              </Link>
              <Link
                  className={`inline-block rounded-lg px-4 py-2 text-md font-medium transition-all duration-200 hover:bg-gray-100 ${
                      location.pathname === "/trails" ? "text-custom-green" : "text-gray-900"
                  }`}
                  to="/trails"
              >
                Mapa tras
              </Link>
              <Link
                  className={`inline-block rounded-lg px-4 py-2 text-md font-medium transition-all duration-200 hover:bg-gray-100 ${
                      location.pathname === "/events" ? "text-custom-green" : "text-gray-900"
                  }`}
                  to="/events"
              >
                Wydarzenia
              </Link>
              <Link
                  className={`inline-block rounded-lg px-4 py-2 text-md font-medium transition-all duration-200 hover:bg-gray-100 ${
                      location.pathname === "/blog" ? "text-custom-green" : "text-gray-900"
                  }`}
                  to="/blog"
              >
                Blog
              </Link>
            </div>
          </div>
          <div className="relative" ref={dropdownRef}>
            {user ? (
                <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2"
                >
              <span className="text-gray-900 font-medium hidden md:inline">
                Witaj,{" "}
                {userData?.firstName?.length > 20
                    ? `${userData.firstName.slice(0, 17)}...`
                    : userData?.firstName || "Użytkowniku"}
              </span>
                  <img
                      src={cloudFrontDomainName + user.id}
                      alt="user avatar"
                      className="h-10 w-10 rounded-full object-cover object-center"
                  />
                </button>
            ) : (
                <div className="flex space-x-5">
                  <Link
                      className="inline-block rounded-lg border-2 border-primary bg-primary px-4 py-2 text-md font-medium text-white transition-all duration-200"
                      to="/login"
                  >
                    Zaloguj się
                  </Link>
                  <Link
                      className="inline-block rounded-lg border-2 border-primary px-4 py-2 text-md font-medium text-primary transition-all duration-200 hover:bg-gray-200"
                      to="/register"
                  >
                    Zarejestruj się
                  </Link>
                </div>
            )}
            {isDropdownOpen && user && (
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                  <div className="py-1">
                    <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                        onClick={handleDropdownClose}
                    >
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      Mój profil
                    </Link>
                    <Link
                        to={`/profile/${user.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                        onClick={handleDropdownClose}
                    >
                      <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                      Moje statystyki
                    </Link>
                    <Link
                        to="/activities"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                        onClick={handleDropdownClose}
                    >
                      <FontAwesomeIcon icon={faTasks} className="mr-2" />
                      Twoje aktywności
                    </Link>
                    <button
                        onClick={() => {
                          logOut();
                          handleDropdownClose();
                        }}
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left flex items-center"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                      Wyloguj się
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>
        <CustomAlert ref={alertRef} />
      </header>
  );
};

export default DesktopLayout;

