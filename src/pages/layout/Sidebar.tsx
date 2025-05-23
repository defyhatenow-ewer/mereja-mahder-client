import { HTMLAttributeAnchorTarget, ReactNode } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../routing";
import {
  ArchiveBox,
  ArrowLeftRectangle,
  Chart,
  ChatBubble,
  Cog,
  DocumentCheck,
  FolderOpen,
  HomeIcon,
  Inbox,
  OpenBook,
  UserPlus,
  Users,
} from "../../components/Icons";
import { Loader } from "../../components";
import { useLogoutMutation, useMeQuery } from "../../features/auth.api";
import { SpaceTypes } from "../../utils";
import { logo } from "../../assets/images";
import { resetAuth } from "../../app/api";
import { useTranslation } from "react-i18next";

type NavItemProps = {
  title: string;
  icon: ReactNode;
  route: string;
  admin?: boolean;
  space?: SpaceTypes;
  alt?: string;
  altIcon?: ReactNode;
  anchor?: boolean;
  target?: HTMLAttributeAnchorTarget;
};

const navLinks: NavItemProps[] = [
  {
    title: "fellows",
    icon: <HomeIcon className="size-4" />,
    route: routes.Fellows.absolute,
    space: SpaceTypes.AFF,
    alt: "overview",
    altIcon: <DocumentCheck className="size-4" />,
  },
  {
    title: "partners",
    icon: <HomeIcon className="size-4" />,
    route: routes.Partners.absolute,
    space: SpaceTypes.Partner,
    alt: "overview",
    altIcon: <Users className="size-4" />,
  },
  {
    title: "womenSafeSpace",
    icon: <HomeIcon className="size-4" />,
    route: routes.WomenSafeSpace.absolute,
    space: SpaceTypes.Women,
    alt: "overview",
    altIcon: <UserPlus className="size-4" />,
  },
  {
    title: "submitArticle",
    icon: <Inbox className="size-4" />,
    route: routes.SubmitArticle.absolute,
    space: SpaceTypes.AFF,
    anchor: true,
    target: "_blank",
  },
  {
    title: "learningResources",
    icon: <OpenBook className="size-4" />,
    route: routes.LearningResources.absolute,
    space: SpaceTypes.AFF,
  },
  {
    title: "reports",
    icon: <FolderOpen className="size-4" />,
    route: routes.ReportList.absolute,
    space: SpaceTypes.Partner,
  },
  {
    title: "data",
    icon: <Chart className="size-4" />,
    route: routes.Data.absolute,
    space: SpaceTypes.Partner,
  },
  {
    title: "safetyResources",
    icon: <ArchiveBox className="size-4" />,
    route: routes.SafetyResources.absolute,
    space: SpaceTypes.Women,
  },
  {
    title: "forum",
    icon: <ChatBubble className="size-4" />,
    route: routes.Forum.absolute,
    anchor: true,
    target: "_blank",
  },
];

const NavItem = ({ title, icon, route, anchor, target }: NavItemProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const isActive = location.pathname.includes(route);

  if (anchor) {
    return (
      <a
        href={route}
        target={target}
        className={`${
          isActive ? "text-[#D15334]" : "text-secondary"
        } hover:bg-primary flex gap-3 py-1 px-3 items-center w-full text-xs`}
      >
        {icon}
        <span>{t(title)}</span>
      </a>
    );
  }
  return (
    <Link
      to={route}
      className={`${
        isActive ? "text-[#D15334]" : "text-secondary"
      } hover:bg-primary flex gap-3 py-1 px-3 items-center w-full text-xs`}
    >
      {icon}
      <span>{t(title)}</span>
    </Link>
  );
};

const Sidebar = () => {
  const { t } = useTranslation();
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

  if (!isFetching && (!data || !data.user))
    return <Navigate to={routes.Login.absolute} />;

  if (!data) return <Loader />;

  return (
    <div className="bg-white flex flex-col justify-between items-start p-5 gap-5">
      <nav className="flex flex-col gap-1">
        <Link to={routes.Home.absolute}>
          <img src={logo} className="max-h-12 mb-3" />
        </Link>
        <h2 className="text-base font-poppins">{t("overviewCaps")}</h2>
        {navLinks.map((navLink) => {
          if (navLink.admin && data.user.role === "admin") {
            return (
              <NavItem
                key={navLink.title}
                title={navLink.title}
                icon={navLink.icon}
                route={navLink.route}
                anchor={navLink.anchor}
                target={navLink.target}
              />
            );
          } else if (navLink.admin) {
            return null;
          } else if (
            data.user.role === "admin" ||
            (data.user.space &&
              typeof data.user.space !== "string" &&
              data.user.space.title === navLink.space) ||
            (data.user.space &&
              typeof data.user.space !== "string" &&
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
                anchor={navLink.anchor}
                target={navLink.target}
              />
            );
          }
          return null;
        })}
      </nav>
      {/* <div className="flex flex-col gap-2">
        <Link
          to={routes.Forum.absolute}
          className="text-base font-poppins block"
        >
          {t("forumsCaps")}
        </Link>
        {forums &&
          forums.docs.map((forum) => (
            <Link
              key={forum.id}
              to={`${routes.Forum.absolute}/${forum.slug}`}
              className="text-xs hover:text-light-red"
            >
              {forum.title}
            </Link>
          ))}
        <Link
          to={routes.Forum.absolute}
          className="bg-white cursor-pointer hover:bg-primary text-secondary flex gap-3 py-1 pe-3 items-center w-full font-poppins-medium"
        >
          <span>{t("viewMore")}</span>
          <ChevronRight className="size-3" />
        </Link>
      </div> */}
      <div className="flex flex-col gap-2">
        <Link
          to={routes.Profile.absolute}
          className={`bg-white hover:bg-primary text-secondary flex gap-3 py-1 pe-3 items-center w-full`}
        >
          <Cog />
          <span>Settings</span>
        </Link>
        <button
          onClick={logout}
          className={`bg-white cursor-pointer hover:bg-primary text-secondary flex gap-3 py-1 pe-3 items-center w-full`}
        >
          <ArrowLeftRectangle />
          <span>{t("logout")}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
