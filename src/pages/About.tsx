import {
  amharicText,
  civicActionGraphic,
  civicEngagement,
  communityEngagement,
  counteringHateSpeech,
  dhnEthLogo,
  digitalResilience,
} from "../assets/images";

const focusAreas = [
  {
    image: digitalResilience,
    title: "Digital Resilience, Media Literacy & Online Safety",
  },
  {
    image: communityEngagement,
    title: "Grassroots Community Engagement",
  },
  {
    image: counteringHateSpeech,
    title: "Countering hate speech and Disinformation",
  },
  {
    image: civicEngagement,
    title: "Civic Engagement & Capacity Building",
  },
];

const About = () => {
  return (
    <div className="flex flex-col bg-white gap-5 pb-5 md:pb-16 md:gap-16">
      <section className="flex flex-col p-5 pt-0 gap-5 md:gap-8 md:flex-row md:p-12 md:pt-0">
        <div className="flex flex-col gap-3 w-full md:justify-between md:w-1/2">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-poppins-extra-light">About</h2>
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
          <p className="w-full md:max-w-sm">
            #defyhatenow Ethiopia is a peacebuilding initiative working to
            counter hate speech, mis/disinformation, and incitement to violence
            through civic engagement and digital literacy. Our goal is in Meraja
            Mahder is to strengthen democratic, secure and civil digital space
            in Ethiopia. We work with youth, women, educators, journalists,
            policymakers, civil society organizations, and grassroots
            communities to strengthen media literacy, fact-checking skills, and
            conflict prevention efforts in Ethiopia.
          </p>
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
      {/* Focus Areas */}
      <section className="flex flex-col bg-custom-gray w-full gap-5 md:gap-12">
        <div className="flex w-full bg-custom-gray">
          <div className="bg-white p-5 pt-0 w-full justify-center md:justify-start md:rounded-br-4xl md:pt-8 md:p-12 md:w-md">
            <h3>#defyhatenowEthiopia</h3>
            <h2 className="text-center md:text-left">Focus Areas</h2>
          </div>
          <div className="flex-grow bg-white hidden md:flex">
            <div className="h-full w-full bg-custom-gray md:rounded-tl-4xl"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 p-5 md:py-12 md:px-32 md:gap-32 md:grid-cols-2">
          {focusAreas.map((area) => (
            <div
              key={area.title}
              className="flex flex-col gap-3 justify-between md:gap-12"
            >
              <img src={area.image} />
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
