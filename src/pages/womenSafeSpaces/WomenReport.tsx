import { Link } from 'react-router-dom';
import { Loader } from '../../components';
import { useGetReportsQuery } from '../../features/reports.api';
import { routes } from '../../routing';
import { formatDateTime } from '../../utils';
import { useTranslation } from 'react-i18next';

const WomenReport = () => {
  const { t } = useTranslation();
  const { data: reports, isLoading: isReportsLoading } = useGetReportsQuery({
    query: {
      where: {
        and: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            privacy: {
              equals: 'private',
            },
          },
        ],
      },
    },
    options: {
      limit: 4,
    },
  });
  if (isReportsLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-5 md:gap-10">
      <section className="overflow-x-auto">
        {reports && reports.docs.length ? (
          <table className="table">
            <thead className="border-0 bg-primary text-secondary rounded-md p-5 md:p-8 md:rounded-3xl">
              <tr className="rounded-3xl font-poppins-semi-bold">
                <th>{t('title')}</th>
                <th>{t('lastUpdated')}</th>
                <th>{t('views')}</th>
              </tr>
            </thead>
            <tbody>
              {reports.docs.map((report) => (
                <tr key={report.id} className="text-sm">
                  <td className="max-w-32">
                    <Link
                      to={`${routes.WomenReport.absolute}/${report.slug}`}
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
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>{t('noPrivateReportsFound')}</p>
        )}
      </section>
    </div>
  );
};

export default WomenReport;
