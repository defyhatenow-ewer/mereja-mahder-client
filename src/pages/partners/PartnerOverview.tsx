import { Carousel, Loader } from '../../components';
import { config } from '../../config';
import { useGetBannersQuery } from '../../features/banners.api';
import { useGetReportsQuery } from '../../features/reports.api';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useGetChartsQuery } from '../../features/charts.api';
import { Link } from 'react-router-dom';
import { routes } from '../../routing';

const PartnerOverview = () => {
  const { t } = useTranslation();
  const [currentReportIndex, setCurrentReportIndex] = useState(0);
  const [currentChartIndex, setCurrentChartIndex] = useState(0);
  const { data: banners, isLoading: isLoadingBanner } = useGetBannersQuery({
    query: {
      where: {
        'space.title': {
          equals: 'partners',
        },
      },
    },
  });
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
      limit: 9,
    },
  });

  const { data: charts, isLoading: isChartsLoading } = useGetChartsQuery({
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
      limit: 9,
    },
  });

  return (
    <>
      <Loader show={isLoadingBanner || isReportsLoading || isChartsLoading} />
      <div className="flex flex-col gap-5 md:gap-10">
        {banners && banners.docs.length && (
          <section className="flex flex-col justify-between items-center gap-5 bg-primary p-5 rounded-md md:rounded-4xl md:p-8 md:flex-row">
            <div className="flex flex-col gap-5 w-full items-center md:items-start md:w-1/2 md:gap-5">
              <p>{t('upcomingActivity')}</p>
              <h2 className="text-lg font-poppins-semi-bold md:text-2xl">
                {banners.docs[0].title}
              </h2>
              <div className="flex gap-3 flex-wrap">
                {banners.docs[0].links.length &&
                  banners.docs[0].links[0].links?.length &&
                  banners.docs[0].links[0].links[0].link.url && (
                    <a
                      className="bg-secondary text-white hover:text-primary text-xs px-5 py-2 rounded-2xl w-fit"
                      href={banners.docs[0].links[0].links[0].link.url}
                      target={
                        banners.docs[0].links[0].links[0].link.newTab === true
                          ? '_blank'
                          : '_self'
                      }
                    >
                      {banners.docs[0].links[0].links[0].link.label}
                    </a>
                  )}
                <Link
                  to={routes.Submit.absolute}
                  className="bg-secondary text-white hover:text-primary text-xs px-5 py-2 rounded-2xl w-fit"
                >
                  {t('submit')}
                </Link>
              </div>
            </div>
            {typeof banners.docs[0].image === 'string' ? (
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
          <Carousel
            title="reports"
            currentIndex={currentReportIndex}
            setCurrentIndex={setCurrentReportIndex}
            posts={reports}
          />
        </section>
        <section>
          <Carousel
            title="charts"
            currentIndex={currentChartIndex}
            setCurrentIndex={setCurrentChartIndex}
            posts={charts}
          />
        </section>
      </div>
    </>
  );
};

export default PartnerOverview;
