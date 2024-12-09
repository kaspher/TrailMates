import { Link } from "react-router-dom";
import logoUrl from "../../assets/img/logo/longlogo.svg";
import mobileLogoUrl from "../../assets/img/logo/logo.svg";

const Header = ({ isMobileView }) => {
  return (
    <div className="flex shrink-0">
      <Link aria-current="page" className="flex items-center" to="/">
        <img
          src={isMobileView ? mobileLogoUrl : logoUrl}
          alt="TrailMates"
          className={`w-auto filter brightness-0 ${
            isMobileView ? "h-8" : "h-5"
          }`}
        />
      </Link>
    </div>
  );
};

export default Header;
