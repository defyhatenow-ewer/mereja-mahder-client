import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { routes } from "../routing";
import { useLogoutMutation, useMeQuery } from "../features/auth.api";
import { resetAuth } from "../app/api";
import { Close, Hamburger } from "./Icons";
import Loader from "./Loader";
import { CustomLink, goToDashboard, SpaceTypes } from "../utils";
import { IUserWithoutPassword } from "../types/users.types";

type MenuItemProps = {
  user: IUserWithoutPassword;
  link: CustomLink;
};

const MenuItem = ({ user, link }: MenuItemProps) => {
  const title =
    user.role === "admin"
      ? link.title
      : link.alt === ""
      ? link.title
      : link.alt;
  if (link.space == SpaceTypes.Admin) {
    if (user.role === "admin") {
      return link.anchor ? (
        <li>
          <a href={link.route}>{title}</a>
        </li>
      ) : (
        <li>
          <Link to={link.route}>{title}</Link>
        </li>
      );
    } else {
      return null;
    }
  } else if (
    user.role === "admin" ||
    (user.space && user.space.title === link.space) ||
    link.space === SpaceTypes.General
  ) {
    return link.anchor ? (
      <li>
        <a href={link.route}>{title}</a>
      </li>
    ) : (
      <li>
        <Link to={link.route}>{title}</Link>
      </li>
    );
  }

  return null;
};

type Props = {
  links: CustomLink[];
  includeLogout?: boolean;
  dashboard?: boolean;
};

const HamburgerMenu = ({
  links,
  includeLogout = false,
  dashboard = false,
}: Props) => {
  const { data, isLoading } = useMeQuery();
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutUser] = useLogoutMutation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const Menu = document.getElementById("hamburger-menu");
    Menu?.removeAttribute("open");
  }, [location]);

  async function logout() {
    await logoutUser().then(() => {
      navigate(routes.Login.absolute);
      resetAuth();
    });
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <details
      id="hamburger-menu"
      className="dropdown dropdown-end z-[99]"
      onToggle={(e) => {
        if (e.currentTarget.open) {
          setOpen(true);
        } else {
          setOpen(false);
        }
      }}
    >
      <summary className="list-none text-white h-full align-middle cursor-pointer">
        <div className="h-full flex justify-center items-center text-black p-1 rounded-md">
          {open ? <Close /> : <Hamburger />}
        </div>
      </summary>
      <ul className="p-3 shadow menu dropdown-content z-[1] rounded-sm bg-primary text-black font-[500] font-roboto w-[60vw]">
        {dashboard && data
          ? links.map((link) => (
              <MenuItem key={link.title} user={data.user} link={link} />
            ))
          : links.map((link) => (
              <li key={link.title}>
                {link.anchor ? (
                  <a href={link.route}>{link.title}</a>
                ) : (
                  <Link to={link.route}>{link.title}</Link>
                )}
              </li>
            ))}
        {dashboard
          ? null
          : data &&
            data.user && (
              <li>
                <Link to={goToDashboard(data.user)}>Dashboard</Link>
              </li>
            )}
        {includeLogout && (
          <li>
            <a onClick={logout}>Logout</a>
          </li>
        )}
        {/* <li>
          <a
            href="https://defyhatenow.org/"
            className="md:w-fit"
            target="_blank"
          >
            <h2 className="font-permanent-marker text-base">#defyhatenow</h2>
          </a>
        </li> */}
      </ul>
    </details>
  );
};

export default HamburgerMenu;
