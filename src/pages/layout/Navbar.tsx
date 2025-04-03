import { routes } from "../../routing";
import { LogoutButton } from "../../components";
import HamburgerMenu from "../../components/HamburgerMenu";
import { CustomLink, SpaceTypes } from "../../utils";
import { Bell, ChevronDown, ChevronUp } from "../../components/Icons";
import { useEffect, useState } from "react";
import { useMeQuery } from "../../features/auth.api";
import { avatarPlaceholder } from "../../assets/images";

const links = [
  new CustomLink(
    "Fellows",
    routes.Fellows.absolute,
    SpaceTypes.AFF,
    "Overview"
  ),
  new CustomLink(
    "Partners",
    routes.Partners.absolute,
    SpaceTypes.Partner,
    "Overview"
  ),
  new CustomLink(
    "Women Safe Space",
    routes.WomenSafeSpace.absolute,
    SpaceTypes.Women,
    "Overview"
  ),
  new CustomLink("Forum", routes.Forum.absolute),
  new CustomLink(
    "Learning Resources",
    routes.LearningResources.absolute,
    SpaceTypes.AFF
  ),
  new CustomLink("Data", routes.Data.absolute, SpaceTypes.Partner),
  new CustomLink("Reports", routes.ReportList.absolute, SpaceTypes.Partner),
  new CustomLink(
    "Safety Resources",
    routes.SafetyResources.absolute,
    SpaceTypes.Women
  ),
  new CustomLink(
    "Settings",
    routes.Settings.absolute,
    SpaceTypes.General,
    "",
    true
  ),
];

const Navbar = () => {
  const { data } = useMeQuery();
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState(navigator.language || "en-US");

  useEffect(() => {
    const Menu = document.getElementById("language-menu");
    if (Menu) {
      document.addEventListener("click", (e) => {
        const withinBoundaries = e.composedPath().includes(Menu);
        if (!withinBoundaries && open) {
          console.log("outside");
          setOpen(false);
        }
      });
    }
  });
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
        className="dropdown dropdown-end text-sm z-[99]"
        onToggle={(e) => {
          if (e.currentTarget.open) {
            setOpen(true);
          } else {
            setOpen(false);
          }
        }}
      >
        <summary className="list-none text-white h-full align-middle cursor-pointer">
          <div className="h-full flex justify-between gap-2 items-center text-black p-1 rounded-md">
            <span>{language}</span>
            {open ? (
              <ChevronUp className="size-3" />
            ) : (
              <ChevronDown className="size-3" />
            )}
          </div>
        </summary>
        <ul className="p-3 gap-2 shadow menu dropdown-content z-[1] rounded-sm w-32 text-sm">
          <li
            className="cursor-pointer p-1 hover:bg-primary"
            onClick={() => setLanguage("en")}
          >
            English
          </li>
          <li
            className="cursor-pointer p-1 hover:bg-primary"
            onClick={() => setLanguage("am")}
          >
            Amharic
          </li>
        </ul>
      </details>
      {data && (
        <div className="flex gap-3 items-center md:gap-5">
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img src={data.user.avatar ?? avatarPlaceholder} />
            </div>
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <span>{data.user.name}</span>
            <span className="capitalize">{data.user.role}</span>
          </div>
        </div>
      )}
      <div className="hidden md:block">
        <LogoutButton />
      </div>
      <div className="block md:hidden">
        <HamburgerMenu links={links} includeLogout dashboard />
      </div>
    </div>
  );
};

export default Navbar;
