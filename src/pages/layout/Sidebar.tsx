import { ReactNode } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../routing";
import {
  ArchiveBox,
  ArrowLeftRectangle,
  Chart,
  DocumentCheck,
  FolderOpen,
  HomeIcon,
  OpenBook,
  UserPlus,
  Users,
} from "../../components/Icons";
import { Loader } from "../../components";
import { useLogoutMutation, useMeQuery } from "../../features/auth.api";
import { SpaceTypes } from "../../utils";
import { logo } from "../../assets/images";
import { resetAuth } from "../../app/api";

type NavItemProps = {
  title: string;
  icon: ReactNode;
  route: string;
  admin?: boolean;
  space?: SpaceTypes;
  alt?: string;
  altIcon?: ReactNode;
};

const navLinks: NavItemProps[] = [
  {
    title: "Overview",
    icon: <HomeIcon className="size-4" />,
    route: routes.Dashboard.absolute,
    space: SpaceTypes.Admin,
    admin: true,
  },
  {
    title: "Fellows",
    icon: <HomeIcon className="size-4" />,
    route: routes.Fellows.absolute,
    space: SpaceTypes.AFF,
    alt: "Overview",
    altIcon: <DocumentCheck className="size-4" />,
  },
  {
    title: "Partners",
    icon: <HomeIcon className="size-4" />,
    route: routes.Partners.absolute,
    space: SpaceTypes.Partner,
    alt: "Overview",
    altIcon: <Users className="size-4" />,
  },
  {
    title: "Women Safe Space",
    icon: <HomeIcon className="size-4" />,
    route: routes.WomenSafeSpace.absolute,
    space: SpaceTypes.Women,
    alt: "Overview",
    altIcon: <UserPlus className="size-4" />,
  },
  {
    title: "Learning Resources",
    icon: <OpenBook className="size-4" />,
    route: routes.LearningResources.absolute,
    space: SpaceTypes.AFF,
  },
  {
    title: "Reports",
    icon: <FolderOpen className="size-4" />,
    route: routes.ReportList.absolute,
    space: SpaceTypes.Partner,
  },
  {
    title: "Data",
    icon: <Chart className="size-4" />,
    route: routes.Data.absolute,
    space: SpaceTypes.Partner,
  },
  {
    title: "Safety Resources",
    icon: <ArchiveBox className="size-4" />,
    route: routes.SafetyResources.absolute,
    space: SpaceTypes.Women,
  },
];

const NavItem = ({ title, icon, route }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname.includes(route);
  return (
    <Link
      to={route}
      className={`${
        isActive ? "text-[#D15334]" : "text-secondary"
      } hover:bg-primary flex gap-3 py-1 pe-3 items-center w-full`}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
};

const Sidebar = () => {
  const { data, isFetching } = useMeQuery();
  const [logoutUser] = useLogoutMutation();
  const navigate = useNavigate();

  async function logout() {
    await logoutUser().then(() => {
      navigate(routes.Login.absolute);
      resetAuth();
    });
  }

  if (isFetching) return <Loader />;

  if (!isFetching && !data) return <Navigate to={routes.Login.absolute} />;

  if (!data) return <Loader />;

  return (
    <div className="bg-white flex flex-col justify-between items-start p-5 gap-5">
      <nav className="flex flex-col gap-2">
        <Link to={routes.Home.absolute}>
          <img src={logo} className="max-h-10 mb-3" />
        </Link>
        <h2 className="text-base font-poppins">OVERVIEW</h2>
        {navLinks.map((navLink) => {
          if (navLink.admin && data.user.role === "admin") {
            return (
              <NavItem
                key={navLink.title}
                title={navLink.title}
                icon={navLink.icon}
                route={navLink.route}
              />
            );
          } else if (navLink.admin) {
            return null;
          } else if (
            data.user.role === "admin" ||
            (data.user.space && data.user.space.title === navLink.space) ||
            (data.user.space &&
              data.user.space.title === SpaceTypes.Women &&
              navLink.space === SpaceTypes.Partner &&
              navLink.route !== routes.Partners.absolute) ||
            !navLink.space
          ) {
            return (
              <NavItem
                key={navLink.title}
                title={
                  data.user.role === "admin"
                    ? navLink.title
                    : (navLink.alt ?? navLink.title)
                }
                icon={
                  data.user.role !== "admin"
                    ? navLink.icon
                    : (navLink.altIcon ?? navLink.icon)
                }
                route={navLink.route}
              />
            );
          }
          return null;
        })}
      </nav>
      <div>
        <h2 className="text-base font-poppins">FORUMS</h2>
      </div>
      <div className="flex flex-col gap-2">
        {/* <Link
          to={routes.Settings.absolute}
          className={`bg-white hover:bg-primary text-secondary flex gap-3 py-1 pe-3 items-center w-full`}
        >
          <Cog />
          <span>Settings</span>
        </Link> */}
        <button
          onClick={logout}
          className={`bg-white cursor-pointer hover:bg-primary text-secondary flex gap-3 py-1 pe-3 items-center w-full`}
        >
          <ArrowLeftRectangle />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
