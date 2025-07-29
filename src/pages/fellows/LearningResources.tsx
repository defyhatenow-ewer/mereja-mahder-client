import { Link } from 'react-router-dom';
import { Loader, RichTextReader } from '../../components';
import { ArrowUpRight } from '../../components/Icons';
import { config } from '../../config';
import { routes } from '../../routing';
import { useTranslation } from 'react-i18next';
import { useGetLearningResourcesQuery } from '../../features/learningResources.api';

const LearningResources = () => {
  const { t } = useTranslation();
  const { data, isLoading: isResourcesLoading } = useGetLearningResourcesQuery({
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

  if (isResourcesLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-5 md:gap-10">
      <section>
        {data && data.docs.length ? (
          <div className="flex flex-col gap-5 md:gap-8">
            <div className="grid grid-flow-row grid-cols-1 gap-5 md:gap-8 md:grid-cols-3">
              {data.docs.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col justify-start gap-0 rounded-md border-1 border-[#D5D5D5] bg-white md:rounded-2xl"
                >
                  {typeof post.featuredImage === 'string' && (
                    <div className="relative">
                      <img
                        src={`${config.env.apiKey}${post.featuredImage}`}
                        className="rounded-md object-cover object-center md:rounded-2xl"
                      />
                      <Link
                        to={`${routes.LearningResources.absolute}/${post.slug}`}
                        className="absolute bottom-2 right-2 z-1 flex justify-center items-center rounded-full p-1 bg-primary text-secondary hover:bg-secondary hover:text-primary"
                      >
                        <ArrowUpRight className="size-5" />
                      </Link>
                    </div>
                  )}
                  {post.featuredImage &&
                    typeof post.featuredImage !== 'string' && (
                      <div className="relative">
                        <img
                          src={`${config.env.apiKey}${post.featuredImage.url}`}
                          className="rounded-md object-cover object-center md:rounded-2xl"
                        />
                        <Link
                          to={`${routes.LearningResources.absolute}/${post.slug}`}
                          className="absolute bottom-2 right-2 z-1 flex justify-center items-center rounded-full p-1 bg-primary text-secondary child-icon"
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
                            to={`${routes.LearningResources.absolute}?tag=${tag.title}`}
                            key={index}
                            className="px-3 py-2 bg-primary rounded-2xl text-xs hover:bg-secondary hover:text-primary md:rounded-3xl md:px-4 md:py-1"
                          >
                            {tag.title}
                          </Link>
                        ))}
                    </div>
                    <Link
                      to={`${routes.LearningResources.absolute}/${post.slug}`}
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
          <p>{t('noLearningResourcesFound')}</p>
        )}
      </section>
    </div>
  );
};

export default LearningResources;
