import { useEffect, useState } from "react";
import { Loader, Pagination } from "../components";
import {
  ChevronUp,
  ChevronDown,
  ArrowDown,
  Refresh,
} from "../components/Icons";
import { Link, useSearchParams } from "react-router-dom";
import { config } from "../config";
import { routes } from "../routing";
import { useGetReportsQuery } from "../features/reports.api";
import { useGetCategoriesQuery } from "../features/categories.api";
import { useGetTagsQuery } from "../features/tag.api";
import {
  createSelect,
  pickIdUsingTitle,
  pickTitleUsingID,
} from "../utils/filters";
import { makeDownloadable } from "../utils";
import { useTranslation } from "react-i18next";

const Reports = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();

  const { data: categories, isLoading } = useGetCategoriesQuery({
    query: {
      select: createSelect(["id", "title"]),
    },
  });

  const { data: tags, isLoading: isTagsLoading } = useGetTagsQuery({
    query: {
      select: createSelect(["id", "title"]),
    },
  });

  const { data, isLoading: isPostsLoading } = useGetReportsQuery({
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
      <Loader show={isPostsLoading || isLoading || isTagsLoading} />
      <div className="flex flex-col bg-white gap-5 p-5 pt-0 max-w-[1400px] md:p-12 md:pt-0 md:gap-16">
        <h2>{t("reports")}</h2>
        <section className="flex flex-col gap-5 md:justify-between md:items-center md:gap-8 md:flex-row">
          <input
            type="text"
            placeholder="Search..."
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
                    {tag === "" ? "Tag" : pickTitleUsingID(tag, tags.docs)}
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
                      ? "Category"
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
            aria-disabled={isPostsLoading}
            className="flex justify-between items-center gap-3 bg-secondary text-primary cursor-pointer rounded-4xl p-2 ps-4 w-full md:max-w-[10rem] md:ps-6"
          >
            <span>{t("clear")}</span>
            <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
              <Refresh />
            </div>
          </button>
        </section>
        <section>
          {data && data.docs ? (
            <div className="flex flex-col gap-5 md:gap-8">
              <div className="grid grid-flow-row grid-cols-1 gap-5 md:gap-8 md:grid-cols-3">
                {data.docs.map((post) => (
                  <div
                    key={post.id}
                    className="flex flex-col justify-between gap-3 p-5 bg-[#E4E4E4] rounded-2xl md:gap-6 md:rounded-3xl"
                  >
                    <Link to={`${routes.Reports.absolute}/${post.id}`}>
                      {typeof post.featuredImage === "string" && (
                        <img
                          src={`${config.env.apiKey}${post.featuredImage}`}
                          className="rounded-2xl object-cover object-center h-full md:h-96 md:rounded-3xl"
                        />
                      )}
                      {post.featuredImage &&
                        typeof post.featuredImage !== "string" && (
                          <img
                            src={`${config.env.apiKey}${post.featuredImage.url}`}
                            className="rounded-2xl object-cover object-center md:rounded-3xl"
                          />
                        )}
                    </Link>
                    <div className="flex flex-col gap-2">
                      <small>PDF</small>
                      <div className="flex justify-between items-center w-full gap-3 md:gap-6">
                        <Link
                          className="font-poppins-medium text-lg"
                          to={`${routes.Reports.absolute}/${post.id}`}
                        >
                          {post.title}
                        </Link>
                        {post.pdf && typeof post.pdf === "string" && (
                          <a
                            href={makeDownloadable(
                              `${config.env.apiKey}${post.pdf}`
                            )}
                            download
                            className="flex justify-center items-center bg-primary rounded-full min-w-12 min-h-12"
                          >
                            <ArrowDown className="size-5" />
                          </a>
                        )}
                        {post.pdf &&
                          typeof post.pdf !== "string" &&
                          post.pdf.url && (
                            <a
                              href={makeDownloadable(
                                `${config.env.apiKey}${post.pdf.url}`
                              )}
                              download
                              className="flex justify-center items-center bg-primary rounded-full min-w-12 min-h-12"
                            >
                              <ArrowDown className="size-5" />
                            </a>
                          )}
                      </div>
                    </div>
                  </div>
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

export default Reports;
