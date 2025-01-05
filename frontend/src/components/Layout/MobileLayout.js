import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faHome,
  faMap,
  faTasks,
  faCalendarAlt,
  faRunning,
  faBars,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";

const MobileLayout = ({
  user,
  cloudFrontDomainName,
  isDropdownOpen,
  toggleDropdown,
  handleDropdownClose,
  logOut,
  dropdownRef,
  mobileLogoUrl,
}) => (
  <header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-xl border border-gray-100 bg-white/80 py-4 shadow backdrop-blur-lg">
    <div className="px-8 flex items-center justify-between">
      <Link aria-current="page" className="flex items-center" to="/">
        <img
          src={mobileLogoUrl}
          alt="TrailMates"
          className="w-auto h-8 filter brightness-0"
        />
      </Link>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2"
        >
          {user ? (
            <img
              src={cloudFrontDomainName + user.id}
              alt="user avatar"
              className="h-10 w-10 rounded-full object-cover object-center"
            />
          ) : (
            <FontAwesomeIcon icon={faBars} className="text-gray-900 text-2xl" />
          )}
        </button>
        {isDropdownOpen && (
          <div className="fixed top-full left-0 w-full bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1">
              <Link
                to="/"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={handleDropdownClose}
              >
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                Strona domowa
              </Link>
              <Link
                to="/trails"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={handleDropdownClose}
              >
                <FontAwesomeIcon icon={faMap} className="mr-2" />
                Mapa tras
              </Link>
              <Link
                to="/activities"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={handleDropdownClose}
              >
                <FontAwesomeIcon icon={faRunning} className="mr-2" />
                Aktywności
              </Link>
              <Link
                to="/events"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={handleDropdownClose}
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Wydarzenia
              </Link>
              {user ? (
                <>
                  <hr className="my-2 border-gray-500 border-t-2 mx-2" />
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
                </>
              ) : (
                <>
                  <hr className="my-2 border-gray-500 border-t-2 mx-2" />
                  <Link
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                    to="/login"
                    onClick={handleDropdownClose}
                  >
                    Zaloguj się
                  </Link>
                  <Link
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                    to="/register"
                    onClick={handleDropdownClose}
                  >
                    Zarejestruj się
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  </header>
);

export default MobileLayout;
