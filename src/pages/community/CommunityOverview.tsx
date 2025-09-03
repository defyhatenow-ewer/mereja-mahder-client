import { Carousel, Loader } from '../../components';
import { useGetReportsQuery } from '../../features/reports.api';
import { useState } from 'react';
import { useGetChartsQuery } from '../../features/charts.api';
import { routes } from '../../routing';

const CommunityOverview = () => {
  const [currentReportIndex, setCurrentReportIndex] = useState(0);
  const [currentChartIndex, setCurrentChartIndex] = useState(0);

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

  if (isReportsLoading || isChartsLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-5 md:gap-10">
      <section>
        <Carousel
          title="reports"
          currentIndex={currentReportIndex}
          setCurrentIndex={setCurrentReportIndex}
          posts={reports}
          parentRoute={routes.ReportList.absolute}
        />
      </section>
      <section>
        <Carousel
          title="charts"
          currentIndex={currentChartIndex}
          setCurrentIndex={setCurrentChartIndex}
          posts={charts}
          parentRoute={routes.Data.absolute}
        />
      </section>
    </div>
  );
};

export default CommunityOverview;
