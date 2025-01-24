import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import MobileLayout from "../components/Layout/MobileLayout";
import DesktopLayout from "../components/Layout/DesktopLayout";
import logoUrl from "../assets/img/logo/longlogo.svg";
import mobileLogoUrl from "../assets/img/logo/logo.svg";

const cloudFrontDomainName =
  process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME_AVATARS;

const Layout = () => {
  const { user, logOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const dropdownRef = useRef(null);

  const location = useLocation();

  const noPaddingRoutes = ["/", "/login", "/register", "/trails"];
  const shouldResetPadding = noPaddingRoutes.includes(location.pathname);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
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
      {isMobileView ? (
        <MobileLayout
          user={user}
          cloudFrontDomainName={cloudFrontDomainName}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
          handleDropdownClose={handleDropdownClose}
          logOut={logOut}
          dropdownRef={dropdownRef}
          mobileLogoUrl={mobileLogoUrl}
        />
      ) : (
        <DesktopLayout
          user={user}
          cloudFrontDomainName={cloudFrontDomainName}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
          handleDropdownClose={handleDropdownClose}
          logOut={logOut}
          dropdownRef={dropdownRef}
          logoUrl={logoUrl}
        />
      )}
      <div className={shouldResetPadding ? "pt-0" : "pt-20"}>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
