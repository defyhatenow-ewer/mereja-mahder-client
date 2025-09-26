import { Carousel, Loader } from '../../components';
import { useGetReportsQuery } from '../../features/reports.api';
import { useState } from 'react';
import { useGetSafetyResourcesQuery } from '../../features/safetyResources.api';
import { routes } from '../../routing';

const WomenOverview = () => {
  const [currentReportIndex, setCurrentReportIndex] = useState(0);
  const [currentResourceIndex, setCurrentResourceIndex] = useState(0);

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

  const { data: resources, isLoading: isResourcesLoading } =
    useGetSafetyResourcesQuery({
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

  if (isReportsLoading || isResourcesLoading) {
    return <Loader />;
  }

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
          title="resources"
          currentIndex={currentResourceIndex}
          setCurrentIndex={setCurrentResourceIndex}
          posts={resources}
          parentRoute={routes.SafetyResources.absolute}
        />
      </section>
    </div>
  );
};

export default WomenOverview;
