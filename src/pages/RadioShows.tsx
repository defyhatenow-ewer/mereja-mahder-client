import { useEffect, useState } from 'react';
import { Loader, Pagination } from '../components';
import { ChevronUp, ChevronDown, Refresh } from '../components/Icons';
import { Link, useSearchParams } from 'react-router-dom';
import { config } from '../config';
import { routes } from '../routing';
import { formatDateTime } from '../utils';
import { useGetShowsQuery } from '../features/shows.api';
import { useGetTagsQuery } from '../features/tag.api';
import {
  createSelect,
  pickIdUsingTitle,
  pickTitleUsingID,
} from '../utils/filters';
import { useTranslation } from 'react-i18next';

const RadioShows = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [tagOpen, setTagOpen] = useState(false);
  const [tag, setTag] = useState('');
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();

  const { data: tags, isLoading: isTagsLoading } = useGetTagsQuery({
    query: {
      select: createSelect(['id', 'title']),
    },
  });

  const { data, isLoading: isPostsLoading } = useGetShowsQuery({
    query: {
      where: {
        and: [
          {
            tags: {
              contains: tag,
            },
          },
          {
            title: {
              like: search,
            },
          },
          {
            _status: {
              equals: 'published',
            },
          },
          {
            privacy: {
              equals: 'public',
            },
          },
        ],
      },
    },
    options: {
      limit: 6,
      page,
    },
  });

  useEffect(() => {
    const tagFromParams = searchParams.get('tag');
    if (tagFromParams && tags) {
      const tagId = pickIdUsingTitle(tagFromParams, tags.docs);
      if (tagId) {
        setTag(tagId);
      }
    }
  }, [searchParams, tags]);

  const clearSearch = () => {
    setSearch('');
    setPage(1);
    setTag('');
  };

  const closeTagDropdown = (id: string) => {
    setTag(id);
    setTagOpen(false);
    const DropDown = document.getElementById('tag-menu');
    if (DropDown) {
      DropDown.removeAttribute('open');
    }
  };

  return (
    <div className="flex justify-center">
      <Loader show={isPostsLoading || isTagsLoading} />
      <div className="flex flex-col bg-white gap-8 p-5 pt-0 max-w-[1400px] md:p-12 md:pt-0 md:gap-16">
        <div className="flex flex-col gap-3">
          <h2>{t('mediaProductions')}</h2>
          <h3 className="text-[#D5D5D5] text-2xl font-poppins">
            {t('podcasts&Shows')}
          </h3>
        </div>
        <section className="flex flex-col gap-5 md:justify-between md:items-center md:gap-8 md:flex-row">
          <input
            type="text"
            placeholder={`${t('search')}...`}
            value={search}
            className="input border-0 w-full bg-[#EBEBEB] p-3 rounded-2xl md:rounded-4xl md:p-6"
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          {tags && (
            <details
              id="tag-menu"
              className="dropdown dropdown-end bg-[#EBEBEB] text-sm w-full p-2 rounded-2xl md:rounded-4xl md:py-3 md:px-5 md:max-w-[10rem]"
              onToggle={(e) => {
                if (e.currentTarget.open) {
                  setTagOpen(true);
                } else {
                  setTagOpen(false);
                }
              }}
              open={tagOpen}
            >
              <summary className="list-none text-white h-full align-middle cursor-pointer">
                <div className="h-full flex justify-between items-center text-black rounded-md">
                  <span>
                    {tag === '' ? t('tag') : pickTitleUsingID(tag, tags.docs)}
                  </span>
                  {tagOpen ? (
                    <ChevronUp className="size-6" />
                  ) : (
                    <ChevronDown className="size-6" />
                  )}
                </div>
              </summary>
              <ul className="p-3 gap-2 shadow bg-white menu dropdown-content z-[1] rounded-sm w-32 text-sm">
                {tags.docs.map((t) => (
                  <li
                    key={t.id}
                    className="cursor-pointer p-1 hover:bg-primary"
                    onClick={() => closeTagDropdown(t.id)}
                  >
                    {t.title}
                  </li>
                ))}
              </ul>
            </details>
          )}
          <button
            onClick={clearSearch}
            aria-disabled={isPostsLoading}
            className="flex justify-between items-center gap-3 bg-secondary hover:bg-primary text-primary hover:text-secondary cursor-pointer rounded-4xl p-2 ps-4 w-full md:max-w-[10rem] md:ps-6"
          >
            <span>{t('clear')}</span>
            <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary child-icon">
              <Refresh />
            </div>
          </button>
        </section>
        <section>
          {data && data.docs ? (
            <div className="flex flex-col gap-5 md:gap-8">
              <div className="grid grid-flow-row grid-cols-1 gap-5 md:gap-8 md:grid-cols-3">
                {data.docs.map((post) => (
                  <Link
                    to={`${routes.RadioShows.absolute}/${post.slug}`}
                    key={post.id}
                    className="flex flex-col justify-between gap-3 border-1 border-[#D5D5D5] rounded-2xl md:rounded-3xl md:p-5 md:gap-5 hover:shadow-xl"
                  >
                    {typeof post.featuredImage === 'string' && (
                      <img
                        src={`${config.env.apiKey}${post.featuredImage}`}
                        className="w-full object-cover object-center rounded-2xl md:rounded-3xl"
                      />
                    )}
                    {post.featuredImage &&
                      typeof post.featuredImage !== 'string' && (
                        <img
                          src={`${config.env.apiKey}${post.featuredImage.url}`}
                          className="w-full object-cover object-center rounded-2xl md:rounded-3xl"
                        />
                      )}
                    <div className="flex flex-col gap-3 p-5 md:p-0 md:gap-5">
                      <small className="text-[#0B121580]">
                        {formatDateTime(post.publishedAt)}
                      </small>
                      <Link
                        className="text-left text-lg hover:text-light-red md:text-xl"
                        to={`${routes.RadioShows.absolute}/${post.slug}`}
                      >
                        {post.title}
                      </Link>
                      <div className="flex gap-2 items-center flex-wrap md:hidden">
                        {(post.tags || []).map((tag) => (
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
                  </Link>
                ))}
              </div>
              <Pagination
                currentPage={page}
                setPage={setPage}
                totalPages={data.totalPages}
              />
            </div>
          ) : (
            <p>{t('showsNotFound')}</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default RadioShows;
