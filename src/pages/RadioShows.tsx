import { useState } from "react";
import { Loader, Pagination } from "../components";
import { useGetPostsQuery } from "../features/posts.api";
import { ChevronUp, ChevronDown, Refresh } from "../components/Icons";
import { Link } from "react-router-dom";
import { config } from "../config";
import { routes } from "../routing";
import { createSelect, pickIdUsingTitle } from "../utils/filters";
import { formatDateTime } from "../utils";
import { useGetCategoriesQuery } from "../features/categories.api";

const RadioShows = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const { data: categories, isLoading } = useGetCategoriesQuery({
    query: {
      select: createSelect(["id", "title"]),
    },
  });
  const radioShowId = pickIdUsingTitle("radio show", categories?.docs);

  const { data, isLoading: isPostsLoading } = useGetPostsQuery(
    {
      query: {
        where: {
          and: [
            {
              categories: {
                contains: radioShowId,
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
    },
    {
      skip: !radioShowId,
    }
  );

  const clearSearch = () => {
    setSearch("");
    setPage(1);
    setCategory("");
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
      <Loader show={isLoading || isPostsLoading} />
      <div className="flex flex-col bg-white gap-8 p-5 pt-0 md:p-12 md:pt-0 md:gap-16">
        <div className="flex flex-col gap-3">
          <h2>Media Productions</h2>
          <h3 className="text-[#D5D5D5] text-2xl font-poppins">
            Podcasts, Radio talk shows & TV interviews
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
          <details
            id="category-menu"
            className="dropdown dropdown-end bg-[#EBEBEB] text-sm w-full p-2 rounded-2xl md:rounded-4xl md:py-3 md:px-5 md:max-w-[10rem]"
            onToggle={(e) => {
              if (e.currentTarget.open) {
                setOpen(true);
              } else {
                setOpen(false);
              }
            }}
          >
            <summary className="list-none text-white h-full align-middle cursor-pointer">
              <div className="h-full flex justify-between items-center text-black rounded-md">
                <span>{category === "" ? "Category" : category}</span>
                {open ? (
                  <ChevronUp className="size-6" />
                ) : (
                  <ChevronDown className="size-6" />
                )}
              </div>
            </summary>
            <ul className="p-3 gap-2 shadow menu dropdown-content z-[1] rounded-sm w-32 text-sm">
              {["Category 1", "Category 2"].map((cat) => (
                <li
                  key={cat}
                  className="cursor-pointer p-1 hover:bg-primary"
                  onClick={() => closeCategoryDropdown(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </details>
          <button
            onClick={clearSearch}
            aria-disabled={isLoading}
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
                  <div
                    key={post.id}
                    className="flex flex-col justify-between gap-3 border-1 border-[#D5D5D5] rounded-3xl md:rounded-none md:border-0 md:gap-5"
                  >
                    {typeof post.featuredImage === "string" && (
                      <img
                        src={`${config.env.apiKey}${post.featuredImage}`}
                        className="w-full object-cover object-center h-full rounded-3xl md:rounded-none md:h-64"
                      />
                    )}
                    {post.featuredImage &&
                      typeof post.featuredImage !== "string" && (
                        <img
                          src={`${config.env.apiKey}${post.featuredImage.url}`}
                          className="w-full object-cover object-center h-full rounded-3xl md:rounded-none md:h-64"
                        />
                      )}
                    <div className="flex flex-col gap-3 p-5 md:p-0 md:gap-5">
                      <small className="text-[#0B121580]">
                        {formatDateTime(post.createdAt)}
                      </small>
                      <a
                        className="text-left text-lg md:text-xl"
                        href={`${routes.RadioShows.absolute}/${post.id}`}
                      >
                        {post.title}
                      </a>
                      <div className="flex gap-2 items-center flex-wrap md:hidden">
                        {post.tags.map((tag) => (
                          <Link
                            to={`${routes.Posts.absolute}?tag=${tag.title}`}
                            key={tag.id}
                            className="px-3 py-2 bg-primary rounded-2xl text-xs md:text-sm md:rounded-3xl md:px-4 md:py-1"
                          >
                            {tag.title}
                          </Link>
                        ))}
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
            <p>No radio shows found</p>
          )}
        </section>
      </div>
    </>
  );
};

export default RadioShows;
