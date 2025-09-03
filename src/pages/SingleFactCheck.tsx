import { Link, useParams } from 'react-router-dom';
import { Loader } from '../components';
import { formatDateTime } from '../utils';
import {
  FacebookButton,
  LinkedInButton,
  TwitterButton,
} from '../components/ShareButtons';
import { config } from '../config';
import { routes } from '../routing';
import { useGetArticlesQuery } from '../features/articles.api';
import { useTranslation } from 'react-i18next';
import RichText from '../components/RichText';
import OpenGraph from '../components/OpenGraph';

const buttonList = [FacebookButton, LinkedInButton, TwitterButton];

const SingleFactCheck = () => {
  const { t } = useTranslation();
  const { slug } = useParams();

  const { data: post, isLoading } = useGetArticlesQuery(
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

  if (isLoading) return <Loader />;

  if (!isLoading && (!post || !post.docs.length))
    return (
      <div className="flex flex-col bg-white gap-5 p-5 pt-0 md:p-12 md:pt-0 md:gap-16">
        {t('postNotFound')}
      </div>
    );

  if (!post) return <Loader />;

  return (
    <div className="flex flex-col justify-center bg-white gap-5 p-5 pt-0 md:p-12 md:pt-0 md:gap-12">
      <OpenGraph meta={post.docs[0].meta} />
      <section className="flex flex-col self-center items-center gap-5 w-full xl:w-4xl md:items-start md:gap-12 xl:gap-16">
        <div className="flex flex-col gap-3 w-full md:gap-5">
          <h2 className="">{post.docs[0].title}</h2>
          <div className="flex gap-3 items-center flex-col md:flex-row md:gap-5">
            <small className="text-[#0B121580]">
              {formatDateTime(post.docs[0].publishedAt)}
            </small>
            <div className="flex gap-2 items-center">
              {(post.docs[0].tags || []).map((tag) => (
                <Link
                  to={`${routes.FactChecks.absolute}?tag=${tag.title}`}
                  key={tag.id}
                  className="px-3 py-2 bg-primary rounded-2xl text-xs hover:bg-secondary hover:text-primary md:text-sm md:rounded-3xl md:px-4 md:py-1"
                >
                  {tag.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <RichText data={post.docs[0].content} />
        <div className="flex flex-col gap-2">
          <small>{t('sharePost')}</small>
          <div className="flex gap-1">
            {buttonList.map((Btn, index) => (
              <Btn
                url={`${config.env.siteUrl}/${routes.FactChecks.absolute}/${slug}`}
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
      </section>
    </div>
  );
};

export default SingleFactCheck;
