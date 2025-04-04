import { useState } from "react";
import { Loader, Pagination } from "../components";
import { useGetPostsQuery } from "../features/posts.api";
import {
  ChevronUp,
  ChevronDown,
  ArrowDown,
  Refresh,
} from "../components/Icons";
import { Link } from "react-router-dom";
import { config } from "../config";
import { routes } from "../routing";
import { createFilter, createSelect, pickIdUsingTitle } from "../utils/filters";
import { useGetCategoriesQuery } from "../features/categories.api";

const Reports = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const { data: categories, isLoading } = useGetCategoriesQuery({
    select: createSelect(["id", "title"]),
  });

  const reportId = pickIdUsingTitle("report", categories?.docs);

  const { data } = useGetPostsQuery(
    {
      where: {
        and: [
          createFilter(
            {
              label: "categories",
              value: reportId,
            },
            "contains"
          ),
          createFilter({ label: "title", value: search }, "like"),
        ],
      },
      limit: 6,
      page,
    },
    {
      skip: !reportId,
    }
  );

  const clearSearch = () => {
    setSearch("");
    setPage(1);
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
    <div className="flex flex-col bg-white gap-5 p-5 pt-0 md:p-12 md:pt-0 md:gap-16">
      <h2>Reports</h2>
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
          open={open}
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
            <li
              className="cursor-pointer p-1 hover:bg-primary"
              onClick={() => closeCategoryDropdown("cat 1")}
            >
              Category 1
            </li>
            <li
              className="cursor-pointer p-1 hover:bg-primary"
              onClick={() => closeCategoryDropdown("cat 2")}
            >
              Category 2
            </li>
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
                  className="flex flex-col justify-between gap-3 p-5 bg-[#E4E4E4] rounded-2xl md:gap-6 md:rounded-3xl"
                >
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
                  <div className="flex flex-col gap-2">
                    <small>PDF</small>
                    <div className="flex justify-between items-center w-full gap-3 md:gap-6">
                      <p>{post.title}</p>
                      <div className="flex justify-center items-center bg-primary rounded-full min-w-12 min-h-12">
                        <ArrowDown className="size-5" />
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
          <p>No reports found</p>
        )}
      </section>
    </div>
  );
};

export default Reports;
