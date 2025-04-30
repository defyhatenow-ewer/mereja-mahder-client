import { Link } from "react-router-dom";
import { Loader, RichTextReader } from "../../components";
import { ArrowUpRight } from "../../components/Icons";
import { config } from "../../config";
import { useGetBannersQuery } from "../../features/banners.api";
import { routes } from "../../routing";
import { useTranslation } from "react-i18next";
import { useGetSafetyResourcesQuery } from "../../features/safetyResources.api";

const SafetyResources = () => {
  const { t } = useTranslation();
  const { data: banners, isLoading: isLoadingBanner } = useGetBannersQuery({
    query: {
      where: {
        "space.title": {
          equals: "aff",
        },
      },
    },
  });
  const { data, isLoading: isResourcesLoading } = useGetSafetyResourcesQuery({
    query: {
      where: {
        _status: {
          equals: "published",
        },
      },
    },
    options: {
      limit: 9,
    },
  });

  return (
    <>
      <Loader show={isLoadingBanner || isResourcesLoading} />
      <div className="flex flex-col gap-5 md:gap-10">
        {banners && banners.docs.length && (
          <section className="flex flex-col justify-between items-center gap-5 bg-primary p-5 rounded-md md:rounded-4xl md:p-8 md:flex-row">
            <div className="flex flex-col gap-5 w-full md:w-1/2 md:gap-5">
              <p>{t("upcomingActivity")}</p>
              <h2 className="text-lg font-poppins-semi-bold md:text-2xl">
                {banners.docs[0].title}
              </h2>
              {banners.docs[0].links.length &&
                banners.docs[0].links[0].links?.length &&
                banners.docs[0].links[0].links[0].link.url && (
                  <a
                    className="bg-secondary text-white hover:text-primary text-xs px-5 py-2 rounded-2xl w-fit"
                    href={banners.docs[0].links[0].links[0].link.url}
                    target={
                      banners.docs[0].links[0].links[0].link.newTab === true
                        ? "_blank"
                        : "_self"
                    }
                  >
                    {banners.docs[0].links[0].links[0].link.label}
                  </a>
                )}
            </div>
            {typeof banners.docs[0].image === "string" ? (
              <img
                className="max-h-64 md:-mb-16"
                src={`${config.env.apiKey}${banners.docs[0].image}`}
              />
            ) : (
              <img
                className="max-h-64 md:-mb-16"
                src={`${config.env.apiKey}${banners.docs[0].image.url}`}
              />
            )}
          </section>
        )}
        <section>
          {data && data.docs ? (
            <div className="flex flex-col gap-5 md:gap-8">
              <div className="grid grid-flow-row grid-cols-1 gap-5 md:gap-8 md:grid-cols-3">
                {data.docs.map((post) => (
                  <div
                    key={post.id}
                    className="flex flex-col justify-start gap-0 rounded-md border-1 border-[#D5D5D5] bg-white md:rounded-2xl"
                  >
                    {typeof post.featuredImage === "string" && (
                      <div className="relative">
                        <img
                          src={`${config.env.apiKey}${post.featuredImage}`}
                          className="rounded-md object-cover object-center md:rounded-2xl"
                        />
                        <Link
                          to={`${routes.SafetyResources.absolute}/${post.slug}`}
                          className="absolute bottom-2 right-2 z-1 flex justify-center items-center rounded-full p-1 bg-primary text-secondary child-icon"
                        >
                          <ArrowUpRight className="size-5" />
                        </Link>
                      </div>
                    )}
                    {post.featuredImage &&
                      typeof post.featuredImage !== "string" && (
                        <div className="relative">
                          <img
                            src={`${config.env.apiKey}${post.featuredImage.url}`}
                            className="rounded-md object-cover object-center md:rounded-2xl"
                          />
                          <Link
                            to={`${routes.SafetyResources.absolute}/${post.slug}`}
                            className="absolute bottom-2 right-2 z-1 flex justify-center items-center rounded-full p-1 bg-primary text-secondary hover:bg-secondary hover:text-primary child-icon"
                          >
                            <ArrowUpRight className="size-5" />
                          </Link>
                        </div>
                      )}
                    <div className="flex flex-col gap-2 p-5 md:p-5">
                      <div className="flex gap-3 items-center">
                        {post.tags &&
                          post.tags.map((tag, index) => (
                            <Link
                              to={`${routes.SafetyResources.absolute}?tag=${tag.title}`}
                              key={index}
                              className="px-3 py-2 bg-primary rounded-2xl text-xs hover:bg-secondary hover:text-primary md:rounded-3xl md:px-4 md:py-1"
                            >
                              {tag.title}
                            </Link>
                          ))}
                      </div>
                      <Link
                        to={`${routes.SafetyResources.absolute}/${post.slug}`}
                        className="text-base font-poppins-semi-bold hover:text-light-red"
                      >
                        {post.title}
                      </Link>
                      <small className="text-[#555555]">PDF</small>
                      {post.excerpt && (
                        <RichTextReader
                          data={post.excerpt}
                          className="text-[#555555]"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>{t("resourcesNotFound")}</p>
          )}
        </section>
      </div>
    </>
  );
};

export default SafetyResources;
