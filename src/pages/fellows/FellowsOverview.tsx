import { Carousel, Loader } from '../../components';
import { useGetMaterialsQuery } from '../../features/materials.api';
import { useState } from 'react';
import { useGetLearningResourcesQuery } from '../../features/learningResources.api';
import { routes } from '../../routing';

const FellowsOverview = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentResourceIndex, setCurrentResourceIndex] = useState(0);

  const { data: resources, isLoading: isResourcesLoading } =
    useGetLearningResourcesQuery({
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
  const { data: materials, isLoading: isMaterialsLoading } =
    useGetMaterialsQuery({
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

  if (isMaterialsLoading || isResourcesLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-5 md:gap-10">
      <section>
        <Carousel
          title="learningMaterials"
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          posts={materials}
          parentRoute={routes.Materials.absolute}
        />
      </section>
      <section>
        <Carousel
          title="learningResources"
          currentIndex={currentResourceIndex}
          setCurrentIndex={setCurrentResourceIndex}
          posts={resources}
          parentRoute={routes.LearningResources.absolute}
        />
      </section>
    </div>
  );
};

export default FellowsOverview;
