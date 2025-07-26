import { Carousel, Loader } from '../../components';
import { config } from '../../config';
import { useGetBannersQuery } from '../../features/banners.api';
import { useGetMaterialsQuery } from '../../features/materials.api';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetLearningResourcesQuery } from '../../features/learningResources.api';
import { Link } from 'react-router-dom';
import { routes } from '../../routing';

const FellowsOverview = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentResourceIndex, setCurrentResourceIndex] = useState(0);

  const { data: banners, isLoading: isLoadingBanner } = useGetBannersQuery({
    query: {
      where: {
        'space.title': {
          equals: 'aff',
        },
      },
    },
  });

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

  return (
    <>
      <Loader
        show={isLoadingBanner || isMaterialsLoading || isResourcesLoading}
      />
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
            title="learningMaterials"
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            posts={materials}
          />
        </section>
        <section>
          <Carousel
            title="learningResources"
            currentIndex={currentResourceIndex}
            setCurrentIndex={setCurrentResourceIndex}
            posts={resources}
          />
        </section>
      </div>
    </>
  );
};

export default FellowsOverview;
