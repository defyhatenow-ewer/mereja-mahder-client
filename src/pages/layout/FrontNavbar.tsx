import { Link, useLocation } from 'react-router-dom';
import { logo } from '../../assets/images';
import { routes } from '../../routing';
import HamburgerMenu from '../../components/HamburgerMenu';
import { ArrowUpRight, ChevronDown, ChevronUp } from '../../components/Icons';
import { useMeQuery } from '../../features/auth.api';
import { CustomLink, goToDashboard, SpaceTypes } from '../../utils';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { lngs } from '../../config';
import { pickLanguageToDisplay } from '../../i18n';

const links: CustomLink[] = [
  new CustomLink('home', routes.Home.absolute),
  // new CustomLink("reports", routes.Reports.absolute),
  new CustomLink('resources', routes.Resources.absolute),
  new CustomLink('radioShows', routes.RadioShows.absolute),
  new CustomLink('factChecks', routes.FactChecks.absolute),
  new CustomLink('about', routes.About.absolute),
  new CustomLink(
    'forum',
    routes.Forum.absolute,
    SpaceTypes.General,
    '',
    true,
    '_blank'
  ),
];

const FrontNavbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { data } = useMeQuery();
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState(
    pickLanguageToDisplay(i18n.resolvedLanguage)
  );

  useEffect(() => {
    const Menu = document.getElementById('language-menu');
    if (Menu) {
      document.addEventListener('click', (e) => {
        const withinBoundaries = e.composedPath().includes(Menu);
        if (!withinBoundaries && open) {
          setOpen(false);
          Menu.removeAttribute('open');
        }
      });
    }
  }, [open]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(pickLanguageToDisplay(lng));
    setOpen(false);
    const DropDown = document.getElementById('language-menu');
    if (DropDown) {
      DropDown.removeAttribute('open');
    }
  };

  return (
    <div className="flex justify-center bg-white">
      <nav className="bg-white w-full flex justify-between items-center max-w-[1400px] gap-5 p-5 md:p-5 md:px-12">
        <Link to={routes.Home.absolute}>
          <img
            className={`w-1/2 md:w-auto ${i18n.resolvedLanguage === 'om' ? 'max-h-16' : 'max-h-16'}`}
            src={logo}
            alt="logo"
          />
        </Link>
        <div className="hidden flex-row gap-5 items-center justify-end mdl:flex">
          <ul className="menu menu-horizontal gap-2">
            {links.map((link) => (
              <li key={link.title}>
                {link.anchor ? (
                  <a
                    href={link.route}
                    className={`${
                      location.pathname === link.route
                        ? 'bg-primary'
                        : 'bg-white'
                    } text-sm rounded-2xl py-2 px-2 hover:bg-[#D9D9D9]`}
                    target={link.target}
                  >
                    {t(link.title)}
                  </a>
                ) : (
                  <Link
                    to={link.route}
                    className={`${
                      location.pathname === link.route
                        ? 'bg-primary'
                        : 'bg-white'
                    } text-sm rounded-2xl py-2 px-2 hover:bg-[#D9D9D9]`}
                  >
                    {t(link.title)}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <details
            id="language-menu"
            className="dropdown dropdown-end text-sm z-[99] rounded-2xl p-1 px-2 hover:bg-[#D9D9D9] border-1 hidden md:inline-block"
            onToggle={(e) => {
              if (e.currentTarget.open) {
                setOpen(true);
              } else {
                setOpen(false);
              }
            }}
          >
            <summary className="list-none text-secondary h-full align-middle cursor-pointer rounded-2xl">
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
          {data && data.user ? (
            <Link
              to={goToDashboard(data.user)}
              className="flex justify-between items-center gap-3 bg-secondary hover:bg-primary text-primary hover:text-secondary cursor-pointer rounded-4xl p-2 ps-3 w-full md:w-fit md:ps-5"
            >
              <span>{t('dashboard')}</span>
              <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary child-icon">
                <ArrowUpRight />
              </div>
            </Link>
          ) : (
            <Link
              to={routes.Login.absolute}
              className="flex justify-between items-center gap-3 bg-secondary hover:bg-primary text-primary hover:text-secondary cursor-pointer rounded-4xl p-2 ps-3 w-full md:w-fit md:ps-5"
            >
              <span>{t('login')}</span>
              <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary child-icon">
                <ArrowUpRight />
              </div>
            </Link>
          )}
        </div>
        <div className="flex items-center justify-end mdl:hidden">
          <HamburgerMenu links={links} />
        </div>
      </nav>
    </div>
  );
};

export default FrontNavbar;
