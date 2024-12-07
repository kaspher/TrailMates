import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex-1 flex justify-center">
      <div className="flex items-center space-x-5">
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
    </div>
  );
};

export default Navbar;
