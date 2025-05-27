import { useEffect, useState } from "react";
import { Loader, Pagination, RichTextReader } from "../components";
import { ChevronUp, ChevronDown, Refresh } from "../components/Icons";
import { Link, useSearchParams } from "react-router-dom";
import { config } from "../config";
import { routes } from "../routing";
import { useGetArticlesQuery } from "../features/articles.api";
import { useGetCategoriesQuery } from "../features/categories.api";
import { useGetTagsQuery } from "../features/tag.api";
import {
  createSelect,
  pickIdUsingTitle,
  pickTitleUsingID,
} from "../utils/filters";
import { useTranslation } from "react-i18next";

const FactChecks = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();

  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery({
      query: {
        select: createSelect(["id", "title"]),
      },
    });

  const { data: tags, isLoading: isTagsLoading } = useGetTagsQuery({
    query: {
      select: createSelect(["id", "title"]),
    },
  });

  const { data, isLoading } = useGetArticlesQuery({
    query: {
      where: {
        and: [
          {
            tags: {
              contains: tag,
            },
          },
          {
            categories: {
              contains: category,
            },
          },
          {
            title: {
              like: search,
            },
          },
          {
            _status: {
              equals: "published",
            },
          },
          {
            privacy: {
              equals: "public",
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
    const tagFromParams = searchParams.get("tag");
    if (tagFromParams && tags) {
      const tagId = pickIdUsingTitle(tagFromParams, tags.docs);
      if (tagId) {
        setTag(tagId);
      }
    }
  }, [searchParams, tags]);

  const clearSearch = () => {
    setSearch("");
    setPage(1);
    setCategory("");
    setTag("");
  };

  const closeTagDropdown = (id: string) => {
    setTag(id);
    setTagOpen(false);
    const DropDown = document.getElementById("tag-menu");
    if (DropDown) {
      DropDown.removeAttribute("open");
    }
  };

  const closeCategoryDropdown = (id: string) => {
    setCategory(id);
    setOpen(false);
    const DropDown = document.getElementById("category-menu");
    if (DropDown) {
      DropDown.removeAttribute("open");
    }
  };

  return (
    <div className="flex justify-center">
      <Loader show={isLoading || isCategoriesLoading || isTagsLoading} />
      <div className="flex flex-col bg-white gap-5 p-5 pt-0 max-w-[1400px] md:p-12 md:pt-0 md:gap-16">
        <h2>{t("factChecks")}</h2>
        <section className="flex flex-col gap-5 md:justify-between md:items-center md:gap-8 md:flex-row">
          <input
            type="text"
            placeholder={`${t("search")}...`}
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
                    {tag === "" ? t("tag") : pickTitleUsingID(tag, tags.docs)}
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
          {categories && (
            <details
              id="categories-menu"
              className="dropdown dropdown-end bg-[#EBEBEB] text-sm w-full p-2 rounded-2xl md:rounded-4xl md:py-3 md:px-5 md:max-w-[10rem]"
              onToggle={(e) => {
                if (e.currentTarget.open) {
                  setOpen(true);
                } else {
                  setOpen(false);
                }
              }}
              open={open}
            >
              <summary className="list-none text-white h-full align-middle cursor-pointer">
                <div className="h-full flex justify-between items-center text-black rounded-md">
                  <span>
                    {category === ""
                      ? t("category")
                      : pickTitleUsingID(category, categories.docs)}
                  </span>
                  {open ? (
                    <ChevronUp className="size-6" />
                  ) : (
                    <ChevronDown className="size-6" />
                  )}
                </div>
              </summary>
              <ul className="p-3 gap-2 shadow bg-white menu dropdown-content z-[1] rounded-sm w-32 text-sm">
                {categories.docs.map((cat) => (
                  <li
                    key={cat.id}
                    className="cursor-pointer p-1 hover:bg-primary"
                    onClick={() => closeCategoryDropdown(cat.id)}
                  >
                    {cat.title}
                  </li>
                ))}
              </ul>
            </details>
          )}
          <button
            onClick={clearSearch}
            aria-disabled={isLoading}
            className="flex justify-between items-center gap-3 bg-secondary hover:bg-primary text-primary hover:text-secondary cursor-pointer rounded-4xl p-2 ps-4 w-full md:max-w-[10rem] md:ps-6"
          >
            <span>{t("clear")}</span>
            <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary child-icon">
              <Refresh />
            </div>
          </button>
        </section>
        <section>
          {data && data.docs ? (
            <div className="flex flex-col gap-5 md:gap-8">
              <div className="grid grid-flow-row grid-cols-1 gap-5 md:gap-8 md:grid-cols-2">
                {data.docs.map((post) => (
                  <Link
                    to={`${routes.FactChecks.absolute}/${post.slug}`}
                    className="flex flex-col gap-5 hover:shadow-xl md:gap-0 md:flex-row"
                    key={post.id}
                  >
                    {typeof post.featuredImage === "string" && (
                      <img
                        src={`${config.env.apiKey}${post.featuredImage}`}
                        className="w-full  object-cover object-center rounded-2xl md:rounded-none md:w-1/2"
                      />
                    )}
                    {post.featuredImage &&
                      typeof post.featuredImage !== "string" && (
                        <img
                          src={`${config.env.apiKey}${post.featuredImage.url}`}
                          className="w-full  object-cover object-center rounded-2xl md:rounded-none md:w-1/2"
                        />
                      )}
                    <div className="flex flex-col gap-3 p-5 px-0 bg-white w-full md:bg-[#F4F4F4] md:w-1/2 md:p-8 md:gap-6">
                      <div className="flex gap-2 items-center flex-wrap">
                        {(post.tags || []).map((tag) => (
                          <Link
                            to={`${routes.FactChecks.absolute}?tag=${tag.title}`}
                            key={tag.id}
                            className="px-3 py-2 bg-primary rounded-2xl text-xs hover:bg-secondary hover:text-primary md:text-sm md:rounded-3xl md:px-4 md:py-1"
                          >
                            {tag.title}
                          </Link>
                        ))}
                      </div>
                      <Link
                        to={`${routes.FactChecks.absolute}/${post.slug}`}
                        className="text-lg font-poppins-medium hover:text-light-red"
                      >
                        {post.title}
                      </Link>
                      <small className="text-[#0B121580]">8 min read</small>
                      {post.excerpt && <RichTextReader data={post.excerpt} />}
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
            <p>{t("reportsNotFound")}</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default FactChecks;
