import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { routes } from "../routing";
import { useLogoutMutation, useMeQuery } from "../features/auth.api";
import { resetAuth } from "../app/api";
import { ChevronDown, ChevronUp, Close, Hamburger } from "./Icons";
import Loader from "./Loader";
import { CustomLink, goToDashboard, SpaceTypes } from "../utils";
import { IUserWithoutPassword } from "../types/users.types";
import { useTranslation } from "react-i18next";
import { lngs } from "../config";
import { TFunction } from "i18next";

type MenuItemProps = {
  user: IUserWithoutPassword;
  link: CustomLink;
  t: TFunction<"translation", undefined>;
};

const MenuItem = ({ user, link, t }: MenuItemProps) => {
  const title =
    user.role === "admin"
      ? t(link.title)
      : link.alt === ""
        ? t(link.title)
        : t(link.alt as string);
  if (link.space == SpaceTypes.Admin) {
    if (user.role === "admin") {
      return link.anchor ? (
        <li>
          <a href={link.route} target={link.target}>
            {title}
          </a>
        </li>
      ) : (
        <li>
          <Link to={link.route} target={link.target}>
            {title}
          </Link>
        </li>
      );
    } else {
      return null;
    }
  } else if (
    user.role === "admin" ||
    (user.space &&
      typeof user.space !== "string" &&
      user.space.title === link.space) ||
    link.space === SpaceTypes.General
  ) {
    return link.anchor ? (
      <li>
        <a href={link.route} target={link.target}>
          {title}
        </a>
      </li>
    ) : (
      <li>
        <Link to={link.route} target={link.target}>
          {title}
        </Link>
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
  const { t, i18n } = useTranslation();
  const { data, isLoading } = useMeQuery();
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutUser] = useLogoutMutation();
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState(
    i18n.resolvedLanguage
      ? lngs[i18n.resolvedLanguage as keyof typeof lngs].nativeName
      : "English"
  );
  const [openLanguageMenu, setOpenLanguageMenu] = useState(false);

  useEffect(() => {
    const Menu = document.getElementById("hamburger-menu");
    Menu?.removeAttribute("open");
  }, [location]);

  useEffect(() => {
    const Menu = document.getElementById("language-menu");
    if (Menu) {
      document.addEventListener("click", (e) => {
        const withinBoundaries = e.composedPath().includes(Menu);
        if (!withinBoundaries && openLanguageMenu) {
          setOpenLanguageMenu(false);
          Menu.removeAttribute("open");
        }
      });
    }
  }, [openLanguageMenu]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lngs[lng as keyof typeof lngs].nativeName);
    setOpen(false);
    setOpenLanguageMenu(false);
    const DropDown = document.getElementById("language-menu");
    DropDown?.removeAttribute("open");
    const Menu = document.getElementById("hamburger-menu");
    Menu?.removeAttribute("open");
  };

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
        {dashboard && data && data.user
          ? links.map((link) => (
              <MenuItem key={link.title} user={data.user} link={link} t={t} />
            ))
          : links.map((link) => (
              <li key={t(link.title)}>
                {link.anchor ? (
                  <a href={link.route} target={link.target}>
                    {t(link.title)}
                  </a>
                ) : (
                  <Link to={link.route}>{t(link.title)}</Link>
                )}
              </li>
            ))}
        {dashboard
          ? null
          : data &&
            data.user && (
              <li>
                <Link to={goToDashboard(data.user)}>{t("dashboard")}</Link>
              </li>
            )}
        {includeLogout && (
          <li>
            <a onClick={logout}>{t("logout")}</a>
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
        <details
          id="language-menu"
          className="dropdown dropdown-end text-sm z-[99] px-3"
          onToggle={(e) => {
            if (e.currentTarget.open) {
              setOpenLanguageMenu(true);
            } else {
              setOpenLanguageMenu(false);
            }
          }}
        >
          <summary className="list-none text-secondary h-full align-middle cursor-pointer">
            <div className="h-full flex justify-between gap-2 items-center text-black p-1 rounded-md">
              <span>{language}</span>
              {openLanguageMenu ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </div>
          </summary>
          <ul className="p-3 gap-2 shadow menu dropdown-content z-[1] rounded-sm w-32 text-sm bg-primary">
            {Object.keys(lngs).map((lng) => (
              <li
                key={lng}
                className="cursor-pointer p-1 text-sm hover:bg-primary"
                onClick={() => changeLanguage(lng)}
                aria-disabled={i18n.resolvedLanguage === lng}
              >
                {lngs[lng as keyof typeof lngs].nativeName}
              </li>
            ))}
          </ul>
        </details>
      </ul>
    </details>
  );
};

export default HamburgerMenu;
