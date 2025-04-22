import { Link } from "react-router-dom";
import { Loader } from "../../components";
import { Edit } from "../../components/Icons";
import { config } from "../../config";
import { useGetBannersQuery } from "../../features/banners.api";
import { useGetReportsQuery } from "../../features/reports.api";
import { routes } from "../../routing";
import { formatDateTime } from "../../utils";

const ReportList = () => {
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
            <div className="flex flex-col gap-5 w-full md:w-1/2 md:gap-5">
              <p>UPCOMING ACTIVITY</p>
              <h2 className="text-lg font-poppins-semi-bold md:text-2xl">
                {banners.docs[0].title}
              </h2>
              {banners.docs[0].links.length &&
                banners.docs[0].links[0].links?.length &&
                banners.docs[0].links[0].links[0].link.url && (
                  <a
                    className="bg-secondary text-white text-xs px-5 py-2 rounded-2xl w-fit"
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
                <th>Title</th>
                <th>Last Updated</th>
                <th>Views</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {reports &&
                reports.docs.map((report) => (
                  <tr key={report.id} className="text-sm">
                    <td className="max-w-32">
                      <Link
                        to={`${routes.ReportList.absolute}/${report.id}`}
                        className="text-wrap text-sm font-poppins-semi-bold"
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

export default ReportList;
