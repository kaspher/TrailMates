import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faTasks,
  faHome,
  faMap,
  faRunning,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

const DropdownMenu = ({ user, isMobileView, onLogout, closeDropdown }) => {
  return (
    <div
      className={`py-1 ${
        isMobileView
          ? "fixed top-full left-0 w-full bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-20"
          : "absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-20"
      }`}
    >
      <div>
        <Link
          to="/"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          onClick={closeDropdown}
        >
          <FontAwesomeIcon icon={faHome} className="mr-2" />
          Strona domowa
        </Link>
        <Link
          to="/trails"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          onClick={closeDropdown}
        >
          <FontAwesomeIcon icon={faMap} className="mr-2" />
          Mapa tras
        </Link>
        <Link
          to="/activities"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          onClick={closeDropdown}
        >
          <FontAwesomeIcon icon={faRunning} className="mr-2" />
          Aktywności
        </Link>
        <Link
          to="/events"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          onClick={closeDropdown}
        >
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
          Wydarzenia
        </Link>
        {!user && (
          <>
            <hr className="my-2 border-gray-500 border-t-2 mx-2" />
            <Link
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
              to="/login"
              onClick={closeDropdown}
            >
              Zaloguj się
            </Link>
            <Link
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
              to="/register"
              onClick={closeDropdown}
            >
              Zarejestruj się
            </Link>
          </>
        )}
        {user && (
          <>
            <hr className="my-2 border-gray-500 border-t-2 mx-2" />
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
              onClick={closeDropdown}
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Mój profil
            </Link>
            <Link
              to="/activities"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
              onClick={closeDropdown}
            >
              <FontAwesomeIcon icon={faTasks} className="mr-2" />
              Moje aktywności
            </Link>
            <button
              onClick={() => {
                onLogout();
                closeDropdown();
              }}
              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left flex items-center"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Wyloguj się
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DropdownMenu;
