import { routes } from "../../routing";
import HamburgerMenu from "../../components/HamburgerMenu";
import { CustomLink, SpaceTypes } from "../../utils";
import { Bell, ChevronDown, ChevronUp, Edit } from "../../components/Icons";
import { useEffect, useState } from "react";
import { useMeQuery } from "../../features/auth.api";
import { avatarPlaceholder } from "../../assets/images";
import { config } from "../../config";
import { useTranslation } from "react-i18next";
import { lngs } from "../../config";

const links = [
  new CustomLink(
    "fellows",
    routes.Fellows.absolute,
    SpaceTypes.AFF,
    "overview"
  ),
  new CustomLink(
    "partners",
    routes.Partners.absolute,
    SpaceTypes.Partner,
    "overview"
  ),
  new CustomLink(
    "womenSafeSpace",
    routes.WomenSafeSpace.absolute,
    SpaceTypes.Women,
    "overview"
  ),
  new CustomLink("forum", routes.Forum.absolute),
  new CustomLink(
    "learningResources",
    routes.LearningResources.absolute,
    SpaceTypes.AFF
  ),
  new CustomLink("data", routes.Data.absolute, SpaceTypes.Partner),
  new CustomLink("reports", routes.ReportList.absolute, SpaceTypes.Partner),
  new CustomLink(
    "safetyResources",
    routes.SafetyResources.absolute,
    SpaceTypes.Women
  ),
  new CustomLink(
    "settings",
    routes.Settings.absolute,
    SpaceTypes.General,
    "",
    true,
    "_blank"
  ),
];

const Navbar = () => {
  const { i18n } = useTranslation();
  const { data } = useMeQuery();
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState(
    i18n.resolvedLanguage
      ? lngs[i18n.resolvedLanguage as keyof typeof lngs].nativeName
      : "English"
  );

  useEffect(() => {
    const Menu = document.getElementById("language-menu");
    if (Menu) {
      document.addEventListener("click", (e) => {
        const withinBoundaries = e.composedPath().includes(Menu);
        if (!withinBoundaries && open) {
          setOpen(false);
          Menu.removeAttribute("open");
        }
      });
    }
  }, [open]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lngs[lng as keyof typeof lngs].nativeName);
    setOpen(false);
    const DropDown = document.getElementById("language-menu");
    if (DropDown) {
      DropDown.removeAttribute("open");
    }
  };

  return (
    <div className="flex flex-row justify-between items-center w-full pb-5 md:pb-0">
      <label className="input rounded-2xl md:!w-112">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input type="search" required placeholder="Search" />
      </label>
      <div className="flex justify-center items-center relative">
        <Bell fill="#222221" className="size-8" />
        <div className="absolute top-0 right-0 flex justify-center items-center w-4 h-4 rounded-full bg-primary text-secondary text-[10px]">
          6
        </div>
      </div>
      <details
        id="language-menu"
        className="dropdown dropdown-end text-sm z-[99] hidden md:inline-block"
        onToggle={(e) => {
          if (e.currentTarget.open) {
            setOpen(true);
          } else {
            setOpen(false);
          }
        }}
      >
        <summary className="list-none text-secondary h-full align-middle cursor-pointer">
          <div className="h-full flex justify-between gap-2 items-center text-black p-1 rounded-md">
            <span>{language}</span>
            {open ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </div>
        </summary>
        <ul className="p-3 gap-2 shadow menu dropdown-content z-[1] rounded-sm w-32 text-sm bg-white">
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
      {data && (
        <a
          href={routes.Settings.absolute}
          className="gap-3 items-center hidden md:flex md:gap-5"
          target="_blank"
        >
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img
                src={
                  data.user.avatar
                    ? `${config.env.apiKey}${data.user.avatar.thumbnailURL}`
                    : avatarPlaceholder
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 text-xs">
            <span>{data.user.name}</span>
            <div className="flex justify-between items-center">
              <span className="capitalize">{data.user.role}</span>
              <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
                <Edit className="size-4" />
              </div>
            </div>
          </div>
        </a>
      )}
      <div className="block md:hidden">
        <HamburgerMenu links={links} includeLogout dashboard />
      </div>
    </div>
  );
};

export default Navbar;
