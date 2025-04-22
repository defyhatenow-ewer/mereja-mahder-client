import { useEffect, useState } from "react";
import { Loader, Pagination, RichTextReader } from "../components";
import {
  ChevronUp,
  ChevronDown,
  Refresh,
  ArrowUpRight,
} from "../components/Icons";
import { Link, useSearchParams } from "react-router-dom";
import { config } from "../config";
import { routes } from "../routing";
import { useGetResourcesQuery } from "../features/resources.api";
import { useGetCategoriesQuery } from "../features/categories.api";
import { useGetTagsQuery } from "../features/tag.api";
import {
  createSelect,
  pickIdUsingTitle,
  pickTitleUsingID,
} from "../utils/filters";

const Resources = () => {
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

  const { data, isLoading: isPostsLoading } = useGetResourcesQuery({
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
    <>
      <Loader show={isPostsLoading || isLoading || isTagsLoading} />
      <div className="flex flex-col bg-white gap-5 p-5 pt-0 md:p-12 md:pt-0 md:gap-16">
        <div className="flex flex-col gap-3">
          <h2>Resources</h2>
          <h3 className="text-[#D5D5D5] text-2xl font-poppins">
            Cybersecurity & Online Safety
          </h3>
        </div>
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
            <span>Clear</span>
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
                  <Link
                    to={`${routes.Resources.absolute}/${post.id}`}
                    key={post.id}
                    className="flex flex-col justify-between gap-0 rounded-md bg-[#E4E4E4]"
                  >
                    {typeof post.featuredImage === "string" && (
                      <img
                        src={`${config.env.apiKey}${post.featuredImage}`}
                        className="rounded-md object-cover object-center"
                      />
                    )}
                    {post.featuredImage &&
                      typeof post.featuredImage !== "string" && (
                        <img
                          src={`${config.env.apiKey}${post.featuredImage.url}`}
                          className="rounded-md object-cover object-center"
                        />
                      )}
                    <div className="flex flex-col gap-2 p-5 md:p-8">
                      <div className="flex gap-3 items-center">
                        {post.tags &&
                          post.tags.map((tag, index) => (
                            <Link
                              to={`${routes.Resources.absolute}?tag=${tag.title}`}
                              key={index}
                              className="px-3 py-2 bg-primary rounded-2xl text-xs md:rounded-3xl md:px-4 md:py-1"
                            >
                              {tag.title}
                            </Link>
                          ))}
                      </div>
                      <h3>{post.title}</h3>
                      <small className="text-[#555555]">PDF</small>
                      {post.excerpt && (
                        <RichTextReader
                          data={post.excerpt}
                          className="text-[#555555]"
                        />
                      )}
                      <div className="flex justify-end">
                        <div className="flex justify-center items-center rounded-full p-3 bg-primary text-secondary">
                          <ArrowUpRight />
                        </div>
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
            <p>No resources found</p>
          )}
        </section>
      </div>
    </>
  );
};

export default Resources;
