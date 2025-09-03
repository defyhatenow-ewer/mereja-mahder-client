import { Link, useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import { Loader, RichTextReader } from '../components';
import { formatDateTime } from '../utils';
import {
  FacebookButton,
  LinkedInButton,
  TwitterButton,
} from '../components/ShareButtons';
import { config } from '../config';
import { ArrowUpRight } from '../components/Icons';
import { routes } from '../routing';
import { useGetShowsQuery } from '../features/shows.api';
import { useTranslation } from 'react-i18next';
import OpenGraph from '../components/OpenGraph';

const buttonList = [FacebookButton, LinkedInButton, TwitterButton];

const SingleRadioShow = () => {
  const { t } = useTranslation();
  const { slug } = useParams();

  const { data: post, isLoading } = useGetShowsQuery(
    {
      query: {
        where: {
          slug: {
            equals: slug,
          },
        },
      },
    },
    {
      skip: !slug,
    }
  );
  const { data: posts, isLoading: isPostsLoading } = useGetShowsQuery(
    {
      query: {
        where: {
          id: {
            not_equals: post?.docs[0].id as string,
          },
        },
      },
      options: {
        limit: 5,
      },
    },
    {
      skip: !slug || !post || !post.docs.length,
    }
  );

  if (isLoading || isPostsLoading) return <Loader />;

  if (!isLoading && (!post || !post.docs.length))
    return (
      <div className="flex flex-col bg-white gap-5 p-5 pt-0 md:p-12 md:pt-0 md:gap-16">
        {t('postNotFound')}
      </div>
    );

  if (!post) return <Loader />;

  return (
    <div className="flex justify-center">
      <OpenGraph meta={post.docs[0].meta} />
      <div className="flex flex-col bg-white gap-5 p-5 pt-0 w-full md:max-w-[1400px] md:p-12 md:pt-0 md:gap-12">
        <section className="flex flex-col gap-3 w-full md:w-4/5 md:gap-5">
          <h2>{post.docs[0].title}</h2>
          <div className="flex gap-3 items-center flex-col md:flex-row md:gap-5">
            <small className="text-[#0B121580]">
              {formatDateTime(post.docs[0].publishedAt)}
            </small>
            <div className="flex gap-2 items-center">
              {(post.docs[0].tags || []).map((tag) => (
                <Link
                  to={`${routes.RadioShows.absolute}?tag=${tag.title}`}
                  key={tag.id}
                  className="px-3 py-2 bg-primary rounded-2xl text-xs hover:bg-secondary hover:text-primary md:text-sm md:rounded-3xl md:px-4 md:py-1"
                >
                  {tag.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-5 md:gap-12 md:flex-row">
          <div className="flex flex-col gap-5 w-full items-center md:items-start md:w-7/10 md:gap-16">
            <div className="w-[calc(100vw-40px)] wrap md:w-full">
              {parse(post.docs[0].iframe)}
            </div>
            <RichTextReader data={post.docs[0].content} />
            <div className="flex flex-col gap-2">
              <small>{t('sharePost')}</small>
              <div className="flex gap-1">
                {buttonList.map((Btn, index) => (
                  <Btn
                    url={`${config.env.siteUrl}/${routes.RadioShows.absolute}/${slug}`}
                    title={post.docs[0].title}
                    withText={false}
                    round={false}
                    className="rounded-2xl"
                    key={index}
                    borderRadius={10}
                  />
                ))}
              </div>
            </div>
            <hr className="w-full h-[1px] border-0 bg-[#D5D5D5]" />
          </div>
          <div className="flex flex-col w-full gap-5 md:gap-12 md:w-3/10">
            <div className="flex flex-col bg-primary rounded-md md:rounded-2xl">
              <div className="bg-white rounded-t-md md:rounded-t-2xl">
                <p className="bg-primary p-5 rounded-t-md rounded-b-md md:rounded-bl-2xl md:rounded-t-2xl md:p-8">
                  {t('subscribeToListen')}{' '}
                  <strong className="font-poppins-semi-bold">#BeAware</strong>{' '}
                  {t('radioShows')}
                </p>
              </div>
              <div className="flex">
                <div className="md:bg-primary w-full md:w-4/5">
                  <div className="bg-white p-3 pb-0 md:ps-0 md:rounded-tr-2xl md:pt-3 md:pb-0 md:px-3">
                    <a
                      href="#"
                      target="_blank"
                      className="flex justify-between items-center gap-3 bg-secondary hover:bg-primary text-primary hover:text-secondary cursor-pointer rounded-4xl p-1 ps-4 md:ps-4"
                    >
                      <span>{t('subscribe')}</span>
                      <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary child-icon">
                        <ArrowUpRight />
                      </div>
                    </a>
                  </div>
                </div>

                <div className="hidden w-1/5 bg-white md:flex">
                  <div className="w-full h-full bg-primary rounded-b-md md:rounded-b-2xl"></div>
                </div>
              </div>
            </div>
            <p>
              {t('getUpdates')} #BeAware {t('radioShows')}
            </p>
            <div className="flex flex-col gap-2 bg-[#F3F3F3] rounded-md p-5 md:p-8 md:rounded-2xl md:gap-6">
              <h3 className="font-poppins-medium">{t('recentPosts')}</h3>
              {posts && posts.docs.length ? (
                <div className="grid grid-cols-1 gap-3 md:gap-6">
                  {posts.docs.map((doc) => (
                    <Link
                      key={doc.id}
                      to={`${routes.RadioShows.absolute}/${doc.slug}`}
                      className="flex flex-col gap-2"
                    >
                      <h4 className="font-poppins-medium text-left text-xs hover:text-light-red md:text-sm">
                        {doc.title}
                      </h4>
                      <small className="text-[#0B121580]">
                        {formatDateTime(doc.publishedAt)}
                      </small>
                      <hr className="w-full h-[1px] border-0 bg-[#D5D5D5]" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p>{t('recentPosts')}</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SingleRadioShow;
