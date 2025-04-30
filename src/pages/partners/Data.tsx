import { Link } from "react-router-dom";
import { Loader } from "../../components";
import { useGetChartsQuery } from "../../features/charts.api";
import { routes } from "../../routing";
import { config } from "../../config";
import { formatDateTime } from "../../utils";
import { useTranslation } from "react-i18next";

const Data = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useGetChartsQuery({
    query: {
      where: {
        and: [
          {
            _status: {
              equals: "published",
            },
          },
          {
            privacy: {
              equals: "private",
            },
          },
        ],
      },
    },
    options: {
      limit: 6,
    },
  });
  return (
    <>
      <Loader show={isLoading} />
      <section className="grid grid-flow-row grid-cols-1 gap-5 md:gap-8 md:grid-cols-3">
        {data && data.docs.length ? (
          data.docs.map((chart) => (
            <Link
              to={`${routes.Data.absolute}/${chart.slug}`}
              key={chart.id}
              className="flex flex-col justify-start gap-0 rounded-md bg-[#D9D9D9]"
            >
              <div className="bg-[#EFEFEF] flex justify-center items-center p-5">
                {typeof chart.featuredImage === "string" && (
                  <img
                    src={`${config.env.apiKey}${chart.featuredImage}`}
                    className="rounded-md object-cover object-center"
                  />
                )}
                {chart.featuredImage &&
                  typeof chart.featuredImage !== "string" && (
                    <img
                      src={`${config.env.apiKey}${chart.featuredImage.url}`}
                      className="rounded-md object-cover object-center md:h-36"
                    />
                  )}
              </div>
              <div className="flex flex-col gap-3 p-5">
                <small className="text-secondary">
                  {formatDateTime(chart.updatedAt)}
                </small>
                <h3 className="font-poppins-semi-bold child-title md:text-lg">
                  {chart.title}
                </h3>
                <button className="text-white hover:text-primary cursor-pointer bg-secondary py-2 px-5 rounded-3xl w-fit">
                  {t("seeMore")}
                </button>
              </div>
            </Link>
          ))
        ) : (
          <p>
            {t("noDataFound")}{" "}
            <a
              href={`${config.dashboardUrl}collections/charts/create`}
              target="_blank"
              className="font-poppins-semi-bold hover:text-light-red"
            >
              {t("here")}
            </a>
          </p>
        )}
      </section>
    </>
  );
};

export default Data;
