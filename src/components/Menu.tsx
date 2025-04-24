import { Link, useLocation } from "react-router-dom";
import {
  dhnLogoTransparent,
  whiteLogoWithCampaign,
  yellowLogoWithCampaign,
} from "../assets/images";
import { routes } from "../routing";
import HamburgerMenu from "./HamburgerMenu";
import { CustomLink, SpaceTypes } from "../utils";

type Props = {
  withLogin?: boolean;
};

const links: CustomLink[] = [
  {
    title: "Login",
    route: routes.Profile.absolute,
    space: SpaceTypes.General,
  },
];

const Menu = ({ withLogin = true }: Props) => {
  const location = useLocation();
  return (
    <div className="flex flex-row justify-between items-center w-full">
      <Link to={routes.Home.absolute} className="w-1/2 md:w-[20rem]">
        <img
          src={
            location.pathname === "/"
              ? whiteLogoWithCampaign
              : yellowLogoWithCampaign
          }
        />
      </Link>
      <div className="flex gap-5">
        <div className="block md:hidden">
          <HamburgerMenu links={links} />
        </div>
        <div className="gap-5 items-center hidden md:flex">
          <a href="https://asknet.community/" target="_blank" className="">
            <img src={dhnLogoTransparent} alt="#defyHateNow logo" />
          </a>
          {withLogin && (
            <Link
              to={routes.Profile.absolute}
              className="bg-white py-3 px-8 text-secondary rounded-2xl"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
