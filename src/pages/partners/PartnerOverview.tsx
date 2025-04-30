import { Link } from "react-router-dom";
import { Loader } from "../../components";
import { Edit } from "../../components/Icons";
import { config } from "../../config";
import { useGetBannersQuery } from "../../features/banners.api";
import { useGetReportsQuery } from "../../features/reports.api";
import { formatDateTime } from "../../utils";
import { routes } from "../../routing";
import { useTranslation } from "react-i18next";

const PartnerOverview = () => {
  const { t } = useTranslation();
  const { data: banners, isLoading: isLoadingBanner } = useGetBannersQuery({
    query: {
      where: {
        "space.title": {
          equals: "partners",
        },
      },
    },
  });
  const { data: reports, isLoading: isReportsLoading } = useGetReportsQuery({
    options: {
      limit: 4,
    },
  });

  return (
    <>
      <Loader show={isLoadingBanner || isReportsLoading} />
      <div className="flex flex-col gap-5 md:gap-10">
        {banners && banners.docs.length && (
          <section className="flex flex-col justify-between items-center gap-5 bg-primary p-5 rounded-md md:rounded-4xl md:p-8 md:flex-row">
            <div className="flex flex-col gap-5 w-full items-center md:items-start md:w-1/2 md:gap-5">
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
        <section className="overflow-x-auto">
          <table className="table">
            <thead className="border-0 bg-primary text-secondary rounded-md p-5 md:p-8 md:rounded-3xl">
              <tr className="rounded-3xl font-poppins-semi-bold">
                <th>{t("title")}</th>
                <th>{t("lastUpdated")}</th>
                <th>{t("views")}</th>
                <th>{t("edit")}</th>
              </tr>
            </thead>
            <tbody>
              {reports &&
                reports.docs.map((report) => (
                  <tr key={report.id} className="text-sm">
                    <td className="max-w-32">
                      <Link
                        to={`${routes.ReportList.absolute}/${report.slug}`}
                        className="text-wrap text-sm font-poppins-semi-bold hover:text-light-red"
                      >
                        {report.title}
                      </Link>
                    </td>
                    <td>
                      <small className="text-[#0B121580]">
                        {formatDateTime(report.updatedAt)}
                      </small>
                    </td>
                    <td>
                      <small className="text-[#555555]">{report.views}</small>
                    </td>
                    <td>
                      <a
                        href={`${config.dashboardUrl}collections/reports/${report.id}`}
                      >
                        <Edit />
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
};

export default PartnerOverview;
