import { useState } from "react";
import { Loader, Pagination, RichTextReader } from "../components";
import { useGetPostsQuery } from "../features/posts.api";
import {
  ChevronUp,
  ChevronDown,
  Refresh,
  ArrowUpRight,
} from "../components/Icons";
import { Link } from "react-router-dom";
import { config } from "../config";
import { routes } from "../routing";
import { createSelect, pickIdUsingTitle } from "../utils/filters";
import { useGetCategoriesQuery } from "../features/categories.api";

const Resources = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const { data: categories, isLoading } = useGetCategoriesQuery({
    query: {
      select: createSelect(["id", "title"]),
    },
  });
  const resourcesId = pickIdUsingTitle("resources", categories?.docs);

  const { data, isLoading: isPostsLoading } = useGetPostsQuery(
    {
      query: {
        where: {
          and: [
            {
              categories: {
                contains: resourcesId,
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
      skip: !resourcesId,
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

  if (isLoading) return <Loader />;

  return (
    <>
      <Loader show={isLoading || isPostsLoading} />
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
                  <Link
                    to={`${routes.Posts.absolute}/${post.id}`}
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
                      <div className="flex gap-5 items-center">
                        {["FactCheck", "News"].map((tag, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 bg-primary rounded-2xl md:rounded-3xl md:px-4 md:py-1"
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                      <h3>{post.title}</h3>
                      <small className="text-[#555555]">PDF</small>
                      <RichTextReader
                        data={post.excerpt}
                        className="text-[#555555]"
                      />
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
