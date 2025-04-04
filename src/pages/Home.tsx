import { Link } from "react-router-dom";
import {
  affGroupPhoto,
  amharicTextBlack,
  fieldGuides,
  graphic1,
  graphic2,
  mmdhn,
} from "../assets/images";
import { routes } from "../routing";
import { ArrowDown, ArrowUpRight, ChevronRight } from "../components/Icons";
import { useGetPostsQuery } from "../features/posts.api";
import { Loader, RichTextReader } from "../components";
import { config } from "../config";
import { formatDateTime } from "../utils";
import { createFilter, createSelect, pickIdUsingTitle } from "../utils/filters";
import { useGetCategoriesQuery } from "../features/categories.api";

const Home = () => {
  const { data: categories, isLoading } = useGetCategoriesQuery({
    select: createSelect(["id", "title"]),
  });

  const reportId = pickIdUsingTitle("report", categories?.docs);
  const factCheckId = pickIdUsingTitle("fact check", categories?.docs);
  const radioShowId = pickIdUsingTitle("radio show", categories?.docs);
  const { data: reports } = useGetPostsQuery(
    {
      where: createFilter(
        {
          label: "categories",
          value: reportId,
        },
        "contains"
      ),
      limit: 3,
    },
    {
      skip: !reportId,
    }
  );
  const { data: factChecks } = useGetPostsQuery(
    {
      where: createFilter(
        {
          label: "categories",
          value: factCheckId,
        },
        "contains"
      ),
      limit: 4,
    },
    {
      skip: !factCheckId,
    }
  );
  const { data: radioShows } = useGetPostsQuery(
    {
      where: createFilter(
        {
          label: "categories",
          value: radioShowId,
        },
        "contains"
      ),
      limit: 3,
    },
    {
      skip: !radioShowId,
    }
  );

  if (isLoading) return <Loader />;
  return (
    <div className="flex flex-col bg-white gap-5 md:gap-16">
      <section className="flex flex-col mx-5 gap-5 md:gap-0 md:h-[560px] md:mx-12 md:flex-row xl:h-[600px] 2xl:h-[760px]">
        <div className="flex flex-col w-full gap-0 md:w-1/2 md:gap-0">
          <div className="flex flex-col flex-grow gap-5 justify-between bg-primary p-5 rounded-t-2xl rounded-b-2xl md:gap-0 md:rounded-t-4xl md:rounded-br-none md:rounded-bl-4xl md:p-12 lg:p-24">
            <img src={amharicTextBlack} className="max-w-36" />
            <h1>Mereja Mahder</h1>
            <p>
              An open-access information repository by #defyhatenow Ethiopia,
              serving as a central hub for credible reports, cybersecurity and
              safety resources, fact-checks, open datasets and informative
              resources to discern disinformation.
            </p>
          </div>
          <div className="bg-primary">
            <div className="bg-white h-full w-full pt-5 pe-0 md:rounded-tr-4xl md:pt-4 md:pe-4">
              <Link
                to={routes.About.relative}
                className="flex justify-between items-center gap-3 bg-secondary text-white cursor-pointer rounded-4xl p-3 ps-4 w-[100%-20px] md:w-[100%-48px] md:ps-6"
              >
                <span>Learn more</span>
                <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
                  <ArrowUpRight />
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-0 w-full bg-primary md:w-1/2">
          <div className="w-full h-3/4 pl-2 pb-2 bg-white md:rounded-bl-4xl md:pb-4 md:pl-4">
            <img
              src={affGroupPhoto}
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
      <section className="flex flex-col bg-custom-gray w-full gap-5 md:gap-12">
        <div className="flex w-full bg-custom-gray">
          <div className="bg-white p-5 pt-0 w-full justify-center md:justify-start md:rounded-br-4xl md:pt-8 md:p-12 md:w-sm">
            <h2 className="text-center md:text-left">Reports</h2>
          </div>
          <div className="flex-grow bg-white hidden md:flex">
            <div className="h-full w-full bg-custom-gray md:rounded-tl-4xl"></div>
          </div>
        </div>
        {reports && reports.docs ? (
          <div className="grid grid-flow-row grid-cols-1 gap-3 px-5 md:gap-8 md:px-12 md:grid-cols-3">
            {reports.docs.map((post) => (
              <Link
                to={`${routes.Posts.absolute}/${post.id}`}
                key={post.id}
                className="flex flex-col gap-3 p-5 bg-white rounded-2xl md:gap-6 md:rounded-3xl"
              >
                {typeof post.featuredImage === "string" && (
                  <img
                    src={`${config.env.apiKey}${post.featuredImage}`}
                    className="rounded-2xl md:rounded-3xl object-cover object-center h-full md:h-96"
                  />
                )}
                {post.featuredImage &&
                  typeof post.featuredImage !== "string" && (
                    <img
                      src={`${config.env.apiKey}${post.featuredImage.url}`}
                      className="rounded-2xl md:rounded-3xl object-cover object-center h-full md:h-96"
                    />
                  )}
                <div className="flex flex-col gap-2">
                  <small>PDF</small>
                  <div className="flex justify-between items-center w-full gap-3 md:gap-6">
                    <p>{post.title}</p>
                    <div className="flex justify-center items-center bg-primary rounded-full min-w-12 min-h-12">
                      <ArrowDown className="size-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-5 md:p-12">Sorry. No reports found</div>
        )}
        <div className="flex w-full">
          <div className="flex-grow bg-white hidden md:flex">
            <div className="h-full w-full bg-custom-gray rounded-br-4xl"></div>
          </div>
          <div className="bg-white p-5 pb-0 w-full md:rounded-tl-4xl md:pt-5 md:px-12 md:w-sm">
            <Link
              to={routes.Reports.relative}
              className="flex justify-between items-center gap-3 bg-secondary text-white cursor-pointer rounded-4xl p-3 ps-4 w-[100%-20px] md:w-[100%-48px] md:ps-6"
            >
              <span>View More</span>
              <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
                <ChevronRight />
              </div>
            </Link>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-5 md:min-h-96 md:gap-0 md:flex-row">
        <div className="flex flex-col bg-light-red w-full text-white md:rounded-tr-4xl md:w-1/2">
          <div className="flex flex-col flex-grow justify-center gap-5 py-8 p-5 md:py-12 md:gap-12 md:p-12">
            <h2 className="font-poppins">Field Guide</h2>
            <p>
              Mobilizing civic and digital action to counter online hate speech
              and online incitement to violence in Ethiopia.
            </p>
          </div>

          <div className="bg-white px-5 pt-5 w-full md:rounded-tr-4xl md:pt-8 md:px-12">
            <Link
              to={routes.Resources.relative}
              className="flex justify-between items-center gap-3 bg-secondary text-white cursor-pointer rounded-4xl p-3 ps-4 w-[100%-20px] md:w-[100%-48px] md:ps-6"
            >
              <span>View SM HS mitigation Field Guide</span>
              <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
                <ChevronRight />
              </div>
            </Link>
          </div>
        </div>
        <div className="bg-light-red h-full w-full flex relative min-h-72 rounded-bl-2xl md:rounded-bl-4xl md:min-h-96 md:w-1/2">
          <div className="h-1/3 w-full bg-white rounded-bl-2xl hidden md:block md:min-h-32 md:rounded-bl-4xl"></div>
          <div className="absolute bg-transparent inset-0 z-1 min-h-64 flex justify-center items-center md:min-h-96">
            <img src={fieldGuides} className="max-h-64 md:max-h-96" />
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-5 p-5 pt-0 md:gap-12 md:pt-0 md:p-12">
        <h2>Recent fact-checks</h2>
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
                    className="w-full  object-cover object-center md:w-1/2"
                  />
                )}
                {post.featuredImage &&
                  typeof post.featuredImage !== "string" && (
                    <img
                      src={`${config.env.apiKey}${post.featuredImage.url}`}
                      className="w-full  object-cover object-center md:w-1/2"
                    />
                  )}
                <div className="flex flex-col gap-3 p-5 bg-[#F4F4F4] w-full md:w-1/2 md:p-8 md:gap-6">
                  <div className="flex gap-5 items-center flex-wrap">
                    {post.tags.map((tag) => (
                      <Link
                        to={`${routes.Posts.absolute}?tag=${tag.title}`}
                        key={tag.id}
                        className="px-3 py-2 bg-primary rounded-2xl md:rounded-3xl md:px-4 md:py-1"
                      >
                        {tag.title}
                      </Link>
                    ))}
                  </div>
                  <Link
                    to={`${routes.Posts.absolute}/${post.id}`}
                    className="text-lg font-poppins-medium"
                  >
                    {post.title}
                  </Link>
                  <small className="text-[#0B121580]">8 min read</small>
                  <RichTextReader data={post.excerpt} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5 md:p-12">
            Sorry. No fact-checking articles found
          </div>
        )}
        <Link
          to={routes.FactChecks.relative}
          className="flex justify-between items-center gap-3 bg-secondary text-white cursor-pointer rounded-4xl p-3 ps-4 w-full md:max-w-sm md:ps-6"
        >
          <span>Read More Articles</span>
          <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
            <ChevronRight />
          </div>
        </Link>
      </section>
      <section className="flex flex-col bg-primary p-5 pt-0 md:pt-0 md:p-12 md:flex-row">
        <img src={graphic1} className="w-full md:w-1/3" />
        <div className="flex flex-col justify-center items-center text-center gap-3 pt-5 md:pt-12 md:gap-5">
          <h2>Access Resources</h2>
          <h3>Cybersecurity & Safety</h3>
          <p>
            Mobilizing civic and digital action to counter online hate speech
            and online incitement to violence in Ethiopia.
          </p>
          <Link
            to={routes.Resources.relative}
            className="flex justify-between items-center gap-3 bg-secondary text-white cursor-pointer rounded-4xl p-3 ps-4 w-full md:max-w-sm md:ps-6"
          >
            <span>View Resources</span>
            <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
              <ChevronRight />
            </div>
          </Link>
        </div>
        <img src={graphic2} className="w-full md:w-1/3" />
      </section>
      <section className="flex flex-col gap-5 p-5 pt-0 md:pt-0 md:gap-12 md:p-12">
        <h2>Media Productions</h2>
        {radioShows && radioShows.docs ? (
          <div className="grid grid-flow-row grid-cols-1 gap-3 md:gap-8 md:grid-cols-3">
            {radioShows.docs.map((post) => (
              <Link
                to={`${routes.RadioShows.absolute}/${post.id}`}
                key={post.id}
                className="flex flex-col justify-between gap-3 md:gap-5"
              >
                {typeof post.featuredImage === "string" && (
                  <img
                    src={`${config.env.apiKey}${post.featuredImage}`}
                    className="w-full object-cover object-center h-full md:h-64"
                  />
                )}
                {post.featuredImage &&
                  typeof post.featuredImage !== "string" && (
                    <img
                      src={`${config.env.apiKey}${post.featuredImage.url}`}
                      className="w-full object-cover object-center h-full md:h-64"
                    />
                  )}
                <div className="flex flex-col gap-3 md:gap-5">
                  <small className="text-[#0B121580]">
                    {formatDateTime(post.createdAt)}
                  </small>
                  <h3>{post.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-5 md:p-12">Sorry. No radio shows found</div>
        )}
        <Link
          to={routes.RadioShows.relative}
          className="flex justify-between items-center gap-3 bg-secondary text-white cursor-pointer rounded-4xl p-3 ps-4 w-full md:max-w-sm md:ps-6"
        >
          <span>More radio shows</span>
          <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
            <ChevronRight />
          </div>
        </Link>
      </section>
    </div>
  );
};

export default Home;
