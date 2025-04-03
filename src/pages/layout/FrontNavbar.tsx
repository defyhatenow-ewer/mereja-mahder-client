import { Link, useLocation } from "react-router-dom";
import { logo } from "../../assets/images";
import { routes } from "../../routing";
import HamburgerMenu from "../../components/HamburgerMenu";
import { ArrowUpRight } from "../../components/Icons";
import { useMeQuery } from "../../features/auth.api";
import { CustomLink, goToDashboard } from "../../utils";

const links: CustomLink[] = [
  new CustomLink("Home", routes.Home.absolute),
  new CustomLink("Reports", routes.Reports.absolute),
  new CustomLink("Resources", routes.Resources.absolute),
  new CustomLink("Radio Shows", routes.RadioShows.absolute),
  new CustomLink("Fact-checks", routes.FactChecks.absolute),
  new CustomLink("About", routes.About.absolute),
];

const FrontNavbar = () => {
  const location = useLocation();
  const { data } = useMeQuery();

  return (
    <nav className="bg-white w-full flex justify-between items-center gap-5 p-5 md:p-12">
      <Link to={routes.Home.absolute}>
        <img className="w-1/2 md:w-auto md:max-h-12" src={logo} alt="logo" />
      </Link>
      <div className="hidden flex-row gap-8 items-center justify-end md:flex">
        <ul className="menu menu-horizontal gap-3">
          {links.map((link) => (
            <li key={link.title}>
              {link.anchor ? (
                <a
                  href={link.route}
                  className={`${
                    location.pathname === link.route
                      ? "bg-[#D9D9D9]"
                      : "bg-white"
                  } text-sm rounded-2xl py-2 px-4`}
                >
                  {link.title}
                </a>
              ) : (
                <Link
                  to={link.route}
                  className={`${
                    location.pathname === link.route
                      ? "bg-[#D9D9D9]"
                      : "bg-white"
                  } text-sm rounded-2xl py-2 px-4 hover:bg-primary`}
                >
                  {link.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
        {data && data.user ? (
          <Link
            to={goToDashboard(data.user)}
            className="flex justify-between items-center gap-3 bg-secondary text-primary cursor-pointer rounded-4xl p-2 ps-3 w-full md:w-fit md:ps-5"
          >
            <span>Dashboard</span>
            <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
              <ArrowUpRight />
            </div>
          </Link>
        ) : (
          <Link
            to={routes.Login.absolute}
            className="flex justify-between items-center gap-3 bg-secondary text-primary cursor-pointer rounded-4xl p-2 ps-3 w-full md:w-fit md:ps-5"
          >
            <span>Login</span>
            <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
              <ArrowUpRight />
            </div>
          </Link>
        )}
      </div>
      <div className="flex items-center justify-end md:hidden">
        <HamburgerMenu links={links} />
      </div>
    </nav>
  );
};

export default FrontNavbar;
