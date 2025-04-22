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
  {
    logo: euLogo,
    url: "https://european-union.europa.eu/index_en",
  },
];

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="flex flex-col gap-8 w-full md:gap-12">
      <section className="flex flex-col gap-5 px-5 items-center md:items-start md:px-12 md:gap-3">
        <p>{t("implementedBy")}</p>
        <div className="grid grid-flow-row grid-cols-1 gap-5 md:gap-0 md:grid-cols-4">
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
      </section>
      <div className="bg-primary flex flex-col justify-between items-center p-8 ps-5 text-black w-full text-center md:flex-row md:p-5 md:px-12">
        <div className="flex flex-col gap-5 md:flex-row md:gap-12">
          <span className="text-xs md:text-base">
            © {new Date().getFullYear()} {t("copyright")}
          </span>
          <span className="hidden md:inline">{t("legalNotice")}</span>
        </div>
        <span className="hidden md:inline">CC-BY-SA 4.0 Meraja Mahder</span>
      </div>
    </footer>
  );
};

export default Footer;
