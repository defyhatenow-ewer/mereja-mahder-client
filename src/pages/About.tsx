import { useTranslation } from "react-i18next";
import {
  amharicText,
  civicActionGraphic,
  civicEngagement,
  communityEngagement,
  counteringHateSpeech,
  dhnEthLogo,
  digitalResilience,
} from "../assets/images";
import { translate } from "../i18n";

const focusAreas = [
  {
    image: digitalResilience,
    title: translate("digitalResilience"),
  },
  {
    image: communityEngagement,
    title: translate("grassRootsEngagement"),
  },
  {
    image: counteringHateSpeech,
    title: translate("counteringHateSpeech"),
  },
  {
    image: civicEngagement,
    title: translate("civicEngagement"),
  },
];

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center bg-white gap-5 pb-5 md:pb-16 md:gap-16">
      <section className="flex flex-col p-5 pt-0 gap-5 w-full max-w-[1400px] md:gap-8 md:flex-row md:p-12 md:pt-0">
        <div className="flex flex-col gap-3 w-full md:justify-between md:w-1/2">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-poppins-extra-light">{t("about")}</h2>
            <h1 className="font-poppins-semi-bold">
              Mareja
              <br />
              Mahder
            </h1>
          </div>

          <img
            src={amharicText}
            className="bg-secondary max-w-xs py-1 px-3 rounded-2xl md:rounded-4xl md:py-2 md:px-16"
          />
          <p className="w-full md:max-w-sm">{t("aboutDescription")}</p>
        </div>
        <div className="flex flex-col gap-3 w-full md:gap-6 md:w-1/2">
          <a
            href="https://defyhatenow.org/"
            target="_blank"
            className="self-center"
          >
            <img src={dhnEthLogo} className="" />
          </a>
          <img src={civicActionGraphic} className="rounded-md md:rounded-3xl" />
        </div>
      </section>
      {/* {t("focusAreas")} */}
      <section className="flex flex-col bg-custom-gray w-full gap-5 md:gap-12">
        <div className="flex w-full bg-custom-gray">
          <div className="bg-white p-5 pt-0 w-full justify-center md:justify-start md:rounded-br-4xl md:pt-8 md:p-12 md:w-md xl:p-16 xl:w-md 2xl:w-xl">
            <h3 className="text-center md:text-left xl:text-right">
              #defyhatenowEthiopia
            </h3>
            <h2 className="text-center md:text-left xl:text-right">
              {t("focusAreas")}
            </h2>
          </div>
          <div className="flex-grow bg-white hidden md:flex">
            <div className="h-full w-full bg-custom-gray md:rounded-tl-4xl"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 p-5 self-center max-w-[1400px] md:py-12 md:px-32 md:gap-32 md:grid-cols-2">
          {focusAreas.map((area, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 justify-between md:gap-12 xl:gap-16"
            >
              <img
                src={area.image}
                className="h-full object-cover object-center md:h-96"
              />
              <h3 className="text-3xl">{area.title}</h3>
            </div>
          ))}
        </div>
        <div className="flex w-full">
          <div className="flex-grow bg-white hidden md:flex">
            <div className="h-full w-full bg-custom-gray rounded-br-4xl"></div>
          </div>
          <div className="bg-white w-full md:rounded-tl-4xl md:w-sm md:h-24"></div>
        </div>
      </section>
    </div>
  );
};

export default About;
