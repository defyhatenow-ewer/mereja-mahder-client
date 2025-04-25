import { useTranslation } from "react-i18next";
import { rogLogo, ppeLogo, euLogo, dhnEthLogo } from "../../assets/images";

const partners = [
  {
    logo: dhnEthLogo,
    url: "https://defyhatenow.org/",
  },
  {
    logo: rogLogo,
    url: "https://openculture.agency/",
  },
  {
    logo: ppeLogo,
    url: "https://ppeth.org/",
  },
];

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="flex flex-col items-center gap-8 w-full md:gap-12">
      <section className="flex flex-col gap-5 px-5 items-center max-w-[1400px] md:items-start md:px-12 md:gap-3 2xl:w-[1400px]">
        <p>{t("implementedBy")}</p>
        <div className="flex flex-col justify-between items-center w-full md:flex-row">
          <div className="grid grid-flow-row grid-cols-1 gap-5 md:gap-0 md:grid-cols-3">
            {partners.map((partner, index) => (
              <a
                href={partner.url}
                target="_blank"
                key={index}
                className="flex justify-center items-center"
              >
                <img src={partner.logo} className="bg-white" />
              </a>
            ))}
          </div>
          <a
            href="https://european-union.europa.eu/index_en"
            target="_blank"
            className="flex justify-center items-center self-end"
          >
            <img src={euLogo} className="bg-white" />
          </a>
        </div>
      </section>
      <div className="bg-primary flex flex-col items-center text-black w-full text-center">
        <div className="flex flex-col justify-between items-center w-full max-w-[1400px] text-xs p-8 ps-5 md:p-5 md:px-12 md:text-base md:flex-row">
          <div className="flex flex-col gap-5 md:flex-row md:gap-12">
            <span className="">
              © {new Date().getFullYear()} {t("copyright")}
            </span>
            <span className="hidden md:inline">{t("legalNotice")}</span>
          </div>
          <span className="hidden md:inline">CC-BY-SA 4.0 Meraja Mahder</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
