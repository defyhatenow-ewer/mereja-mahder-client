import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  mobilizingCivicAction,
  amharicTextBlack,
  fieldGuides,
  graphic1,
  graphic2,
  mmdhn,
} from "../assets/images";
import { routes } from "../routing";
import { ArrowDown, ArrowUpRight, ChevronRight } from "../components/Icons";
import { Loader, RichTextReader } from "../components";
import { config } from "../config";
import { formatDateTime, makeDownloadable } from "../utils";
import { useGetReportsQuery } from "../features/reports.api";
import { useGetArticlesQuery } from "../features/articles.api";
import { useGetShowsQuery } from "../features/shows.api";

const Home = () => {
  const { t } = useTranslation();
  const { data: reports, isLoading: isReportsLoading } = useGetReportsQuery({
    options: {
      limit: 3,
    },
  });
  const { data: factChecks, isLoading: isFactChecksLoading } =
    useGetArticlesQuery({
      options: {
        limit: 4,
      },
    });
  const { data: radioShows, isLoading: isRadioShowsLoading } = useGetShowsQuery(
    {
      options: {
        limit: 3,
      },
    }
  );

  return (
    <>
      <Loader
        show={isReportsLoading || isFactChecksLoading || isRadioShowsLoading}
      />
      <div className="flex flex-col items-center bg-white gap-8 md:gap-16">
        <section className="flex flex-col px-5 gap-5 max-w-[1400px] md:gap-0 md:h-[400px] md:px-12 md:flex-row xl:h-[500px] 2xl:h-[500px]">
          <div className="flex flex-col w-full gap-0 md:w-1/2 md:gap-0">
            <div className="flex flex-col flex-grow gap-5 justify-between bg-primary p-8 rounded-t-2xl rounded-b-2xl md:gap-0 md:rounded-t-4xl md:rounded-br-none md:rounded-bl-4xl md:p-12 lg:p-12">
              <img src={amharicTextBlack} className="max-w-36" />
              <h1 className="text-left text-6xl">Mereja Mahder</h1>
              <p>{t("description")}</p>
              <div className="flex flex-col items-center md:hidden">
                <img
                  src={mobilizingCivicAction}
                  className="rounded-4xl object-cover object-left-top w-full"
                />
                <Link
                  to={routes.About.relative}
                  className="flex justify-between items-center gap-3 outline-20 outline-primary bg-secondary text-white cursor-pointer rounded-4xl p-3 ps-4 w-fit"
                >
                  <span>{t("learnMore")}</span>
                  <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
                    <ArrowUpRight />
                  </div>
                </Link>
              </div>
            </div>
            <div className="bg-primary hidden md:flex">
              <div className="bg-white h-full w-full pt-5 pe-12 md:rounded-tr-4xl md:pt-4 md:pe-4">
                <Link
                  to={routes.About.relative}
                  className="flex justify-between items-center gap-3 bg-secondary text-white cursor-pointer rounded-4xl p-3 ps-4 w-[100%-20px] text-sm md:text-base md:w-[100%-48px] md:ps-6"
                >
                  <span>{t("learnMore")}</span>
                  <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
                    <ArrowUpRight />
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden flex-col gap-0 w-full bg-primary md:flex md:w-1/2">
            <div className="w-full h-3/5 pl-2 pb-2 bg-white md:rounded-bl-4xl md:pb-4 md:pl-4">
              <img
                src={mobilizingCivicAction}
                className="rounded-2xl object-cover object-left-top h-full w-full md:rounded-4xl"
              />
            </div>
            <div className="flex bg-white flex-row gap-0 w-full flex-grow">
              <div className="h-full w-1/2 bg-primary rounded-b-2xl rounded-tr-2xl hidden md:flex md:rounded-b-4xl md:rounded-tr-4xl"></div>
              <div className="flex justify-center items-center bg-white h-full w-full pt-5 md:pt-0 md:w-1/2">
                <img src={mmdhn} className="w-48 h-48" />
              </div>
            </div>
          </div>
        </section>
        {/* Reports */}
        <section className="flex flex-col items-center bg-custom-gray w-full gap-8 rounded-4xl md:rounded-none md:gap-12">
          <div className="flex w-full bg-custom-gray">
            <div className="bg-white p-8 pt-0 w-full justify-center md:justify-start md:rounded-br-4xl md:pt-8 md:p-12 md:w-sm xl:p-16 xl:w-md 2xl:w-xl">
              <h2 className="text-center md:text-left xl:text-right">
                {t("reports")}
              </h2>
            </div>
            <div className="flex-grow bg-white hidden md:flex">
              <div className="h-full w-full bg-custom-gray md:rounded-tl-4xl"></div>
            </div>
          </div>
          {reports && reports.docs ? (
            <div className="grid grid-flow-row grid-cols-1 gap-8 px-5 max-w-[1400px] md:gap-8 md:px-12 md:grid-cols-3">
              {reports.docs.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col justify-between gap-3 p-5 bg-[#E4E4E4] rounded-2xl md:gap-6 md:rounded-3xl"
                >
                  <Link to={`${routes.Reports.absolute}/${post.id}`}>
                    {typeof post.featuredImage === "string" && (
                      <img
                        src={`${config.env.apiKey}${post.featuredImage}`}
                        className="rounded-2xl object-cover object-center h-full md:h-96 md:rounded-3xl"
                      />
                    )}
                    {post.featuredImage &&
                      typeof post.featuredImage !== "string" && (
                        <img
                          src={`${config.env.apiKey}${post.featuredImage.url}`}
                          className="rounded-2xl object-cover object-center md:rounded-3xl"
                        />
                      )}
                  </Link>
                  <div className="flex flex-col gap-2">
                    <small>PDF</small>
                    <div className="flex justify-between items-center w-full gap-3 md:gap-6">
                      <Link to={`${routes.Reports.absolute}/${post.id}`}>
                        {post.title}
                      </Link>
                      {post.pdf && typeof post.pdf === "string" && (
                        <a
                          href={makeDownloadable(
                            `${config.env.apiKey}${post.pdf}`
                          )}
                          download
                          className="flex justify-center items-center bg-primary rounded-full min-w-12 min-h-12"
                        >
                          <ArrowDown className="size-5" />
                        </a>
                      )}
                      {post.pdf &&
                        typeof post.pdf !== "string" &&
                        post.pdf.url && (
                          <a
                            href={makeDownloadable(
                              `${config.env.apiKey}${post.pdf.url}`
                            )}
                            download
                            className="flex justify-center items-center bg-primary rounded-full min-w-12 min-h-12"
                          >
                            <ArrowDown className="size-5" />
                          </a>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 md:p-12">{t("reportsNotFound")}</div>
          )}
          <div className="flex w-full">
            <div className="flex-grow bg-white hidden md:flex">
              <div className="h-full w-full bg-custom-gray rounded-br-4xl"></div>
            </div>
            <div className="flex justify-center bg-white p-5 pb-0 w-full md:rounded-tl-4xl md:pt-5 md:px-12 md:w-sm xl:w-md xl:p-12 xl:pb-0 xl:justify-start">
              <Link
                to={routes.Reports.relative}
                className="flex justify-between items-center gap-3 bg-secondary text-white cursor-pointer rounded-4xl p-3 ps-4 w-fit text-sm md:text-base md:w-[100%-48px] md:ps-6"
              >
                <span>{t("viewMore")}</span>
                <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
                  <ChevronRight />
                </div>
              </Link>
            </div>
          </div>
        </section>
        <section className="flex flex-col w-full gap-8 md:min-h-96 md:gap-0 md:flex-row">
          <div className="flex flex-col bg-light-red text-white m-5 md:m-0 md:w-1/2">
            <div className="bg-white flex-grow">
              <div className="flex flex-col flex-grow h-full bg-light-red rounded-4xl justify-center items-center gap-8 pt-8 p-8 pb-0 md:rounded-none md:rounded-tr-4xl md:items-start md:py-12 md:gap-12 md:p-12">
                <div className="flex flex-col gap-8 max-w-[600px] self-end md:gap-12">
                  <h2 className="font-poppins">{t("fieldGuide")}</h2>
                  <p className="text-center md:text-left">
                    {t("fieldGuideDescription")}
                  </p>
                </div>
                <img
                  src={fieldGuides}
                  className="w-9/10 inline z-1 -mb-10 md:hidden"
                />
              </div>
            </div>

            <div className="bg-white px-5 pt-16 w-full flex justify-end md:rounded-tr-4xl md:pt-8 md:px-12">
              <Link
                to={routes.Resources.relative}
                className="flex justify-between items-center gap-3 bg-secondary text-white cursor-pointer rounded-4xl p-3 ps-4 w-[100%-20px] text-sm max-w-[600px] md:text-base md:w-full md:ps-6"
              >
                <span>{t("viewFieldGuide")}</span>
                <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
                  <ChevronRight />
                </div>
              </Link>
            </div>
          </div>
          <div className="bg-light-red h-full w-full relative min-h-72 rounded-bl-2xl hidden md:flex md:rounded-bl-4xl md:min-h-96 md:w-1/2">
            <div className="h-1/3 w-full bg-white rounded-bl-2xl hidden md:block md:min-h-32 md:rounded-bl-4xl"></div>
            <div className="absolute bg-transparent inset-0 z-1 min-h-64 flex justify-center items-center max-w-[700px] md:min-h-96">
              <img src={fieldGuides} className="max-h-64 md:max-h-96" />
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-8 p-8 pt-0 max-w-[1400px] md:gap-12 md:pt-0 md:p-12">
          <h2>{t("recentFactChecks")}</h2>
          {factChecks && factChecks.docs ? (
            <div className="grid grid-flow-row grid-cols-1 gap-3 md:gap-8 md:grid-cols-2">
              {factChecks.docs.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col gap-5 md:gap-0 md:flex-row"
                >
                  {typeof post.featuredImage === "string" && (
                    <img
                      src={`${config.env.apiKey}${post.featuredImage}`}
                      className="w-full  object-cover object-center rounded-2xl md:rounded-none md:w-1/2"
                    />
                  )}
                  {post.featuredImage &&
                    typeof post.featuredImage !== "string" && (
                      <img
                        src={`${config.env.apiKey}${post.featuredImage.url}`}
                        className="w-full  object-cover object-center rounded-2xl md:rounded-none md:w-1/2"
                      />
                    )}
                  <div className="flex flex-col gap-3 p-5 px-0 bg-white w-full md:bg-[#F4F4F4] md:w-1/2 md:p-8 md:gap-6">
                    <div className="flex gap-2 items-center flex-wrap">
                      {(post.tags || []).map((tag) => (
                        <Link
                          to={`${routes.FactChecks.absolute}?tag=${tag.title}`}
                          key={tag.id}
                          className="px-3 py-2 bg-primary rounded-2xl text-xs md:text-sm md:rounded-3xl md:px-4 md:py-1"
                        >
                          {tag.title}
                        </Link>
                      ))}
                    </div>
                    <Link
                      to={`${routes.FactChecks.absolute}/${post.id}`}
                      className="text-lg font-poppins-medium"
                    >
                      {post.title}
                    </Link>
                    <small className="text-[#0B121580]">8 min read</small>
                    {post.excerpt && <RichTextReader data={post.excerpt} />}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 md:p-12">{t("articlesNotFound")}</div>
          )}
          <Link
            to={routes.FactChecks.relative}
            className="flex justify-between items-center gap-3 bg-secondary text-white cursor-pointer rounded-4xl p-3 ps-4 w-full text-sm md:text-base md:max-w-sm md:ps-6"
          >
            <span>{t("readMoreArticles")}</span>
            <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
              <ChevronRight />
            </div>
          </Link>
        </section>
        <section className="flex bg-primary mx-8 rounded-4xl justify-center md:rounded-none md:mx-0 md:w-full">
          <div className="flex flex-col bg-primary p-8 rounded-4xl max-w-[1400px] md:rounded-none md:mx-0 md:pt-0 md:p-12 md:flex-row">
            <img src={graphic1} className="w-full hidden md:inline md:w-1/3" />
            <div className="flex flex-col justify-center items-center text-center gap-3 md:pt-12 md:gap-5">
              <h2 className="text-center">{t("accessResources")}</h2>
              <h3 className="font-poppins-regular">
                {t("cybersecurity&safety")}
              </h3>
              <p>{t("accessResourcesDescription")}</p>
              <Link
                to={routes.Resources.relative}
                className="flex justify-between items-center gap-3 bg-secondary text-white cursor-pointer rounded-4xl p-3 ps-4 w-full text-sm md:text-base md:max-w-sm md:ps-6"
              >
                <span>{t("viewResources")}</span>
                <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
                  <ChevronRight />
                </div>
              </Link>
            </div>
            <img src={graphic2} className="w-full hidden md:inline md:w-1/3" />
          </div>
        </section>
        <section className="flex flex-col gap-8 p-8 pt-0 max-w-[1400px] md:pt-0 md:gap-12 md:p-12">
          <h2 className="hidden md:block">{t("mediaProductions")}</h2>
          <h2 className="block md:hidden">{t("radioShows")}</h2>
          {radioShows && radioShows.docs ? (
            <div className="grid grid-flow-row grid-cols-1 gap-8 md:gap-8 md:grid-cols-3">
              {radioShows.docs.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col justify-between gap-3 border-1 border-[#D5D5D5] rounded-3xl md:rounded-none md:border-0 md:gap-5"
                >
                  {typeof post.featuredImage === "string" && (
                    <img
                      src={`${config.env.apiKey}${post.featuredImage}`}
                      className="w-full object-cover object-center h-full rounded-3xl md:rounded-none md:h-64"
                    />
                  )}
                  {post.featuredImage &&
                    typeof post.featuredImage !== "string" && (
                      <img
                        src={`${config.env.apiKey}${post.featuredImage.url}`}
                        className="w-full object-cover object-center h-full rounded-3xl md:rounded-none md:h-64"
                      />
                    )}
                  <div className="flex flex-col gap-3 p-5 md:p-0 md:gap-5">
                    <small className="text-[#0B121580]">
                      {formatDateTime(post.createdAt)}
                    </small>
                    <a
                      className="text-left text-lg md:text-xl"
                      href={`${routes.RadioShows.absolute}/${post.id}`}
                    >
                      {post.title}
                    </a>
                    <div className="flex gap-2 items-center flex-wrap md:hidden">
                      {(post.tags || []).map((tag) => (
                        <Link
                          to={`${routes.RadioShows.absolute}?tag=${tag.title}`}
                          key={tag.id}
                          className="px-3 py-2 bg-primary rounded-2xl text-xs md:text-sm md:rounded-3xl md:px-4 md:py-1"
                        >
                          {tag.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 md:p-12">{t("showsNotFound")}</div>
          )}
          <Link
            to={routes.RadioShows.relative}
            className="flex justify-between items-center self-center gap-8 bg-secondary text-white cursor-pointer rounded-4xl p-3 ps-4 w-fit text-sm md:self-start md:text-base md:w-sm md:ps-6"
          >
            <span>{t("moreShows")}</span>
            <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
              <ChevronRight />
            </div>
          </Link>
        </section>
      </div>
    </>
  );
};

export default Home;
