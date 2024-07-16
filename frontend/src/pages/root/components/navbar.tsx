import { Link } from "react-router-dom";
import { NavLink as RRNavlink } from "react-router-dom";
import DropdownProfile from "./dropdown-profile";
import DropdownProfileMobile from "./dropdown-profile-mobile";
import { cn } from "@/lib/utils";


const NavLink = ({ link, label }) => {
  return (
    <RRNavlink
      to={`/${link}`}
      className={({ isActive }) =>
        cn("nav-link", isActive ? "active" : "inactive")
      }
    >
      {label}
    </RRNavlink>
  );
};

const Navbar = () => {
  return (
    <>
      <nav className="nav-bar">
        <div className="nav-bar-restrict-grow">
          <div className="nav-layout">
            <div className="flex left-side">
              <Link to="/" className="logo-wrapper">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="block h-9 w-auto"
                >
                  <path
                    d="M11.395 44.428C4.557 40.198 0 32.632 0 24 0 10.745 10.745 0 24 0a23.891 23.891 0 0113.997 4.502c-.2 17.907-11.097 33.245-26.602 39.926z"
                    fill="#6875F5"
                  ></path>
                  <path
                    d="M14.134 45.885A23.914 23.914 0 0024 48c13.255 0 24-10.745 24-24 0-3.516-.756-6.856-2.115-9.866-4.659 15.143-16.608 27.092-31.75 31.751z"
                    fill="#6875F5"
                  ></path>
                </svg>
              </Link>
              <ul className="nav-links">
                <NavLink link="" label="Dashboard" />
                <NavLink link="records" label="Records" />
              </ul>
            </div>
            <div className="right-side">
              <DropdownProfile />
            </div>
            <div className="right-side-mobile flex items-center sm:hidden">
              <DropdownProfileMobile />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
